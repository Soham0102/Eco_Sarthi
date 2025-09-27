from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
import time
from datetime import datetime

# HuggingFace
from transformers import pipeline

# Routes
from routes.complaint_routes import complaint_routes
from routes.admin_routes import admin_routes
from routes.enhanced_admin_routes import enhanced_admin_routes
from routes.pickup_routes import pickup_routes
from routes.worker_routes import worker_routes
from routes.auth_routes import auth_routes
from routes.citizen_routes import citizen_routes
from routes.enhanced_worker_routes import enhanced_worker_routes
from routes.directory_routes import directory_routes
from werkzeug.utils import secure_filename

# ✅ Import schemes
from schemes_data import SCHEMES  

# ---------------- Logging Setup ----------------
LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] - %(name)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("server.log", encoding="utf-8")
    ],
)
logger = logging.getLogger("JantaVoice")

# ---------------- Flask Setup ----------------
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.environ.get("APP_SECRET_KEY", "super_secret_key_change_later")

# Register Blueprints
app.register_blueprint(complaint_routes)                 
app.register_blueprint(admin_routes)                   
app.register_blueprint(enhanced_admin_routes)
app.register_blueprint(pickup_routes)                     
app.register_blueprint(worker_routes)
app.register_blueprint(auth_routes)
app.register_blueprint(citizen_routes)
app.register_blueprint(enhanced_worker_routes)
app.register_blueprint(directory_routes)

# ---------------- HuggingFace Model ----------------
HF_MODEL_NAME = os.environ.get("HF_MODEL_NAME", "bigscience/bloom-560m")

GEN_MAX_LENGTH = int(os.environ.get("GEN_MAX_LENGTH", "256"))
GEN_TEMPERATURE = float(os.environ.get("GEN_TEMPERATURE", "0.8"))
GEN_TOP_P = float(os.environ.get("GEN_TOP_P", "0.95"))
GEN_DO_SAMPLE = os.environ.get("GEN_DO_SAMPLE", "true").lower() == "true"

chatbot = None
try:
    logger.info(f"Loading Hugging Face model: {HF_MODEL_NAME}")
    chatbot = pipeline("text-generation", model=HF_MODEL_NAME)
    logger.info("✅ Chatbot model loaded successfully.")
except Exception as e:
    logger.exception(f"❌ Failed to load Hugging Face model: {e}")
    chatbot = None 

# ---------------- Helpers ----------------
def _build_prompt(user_text: str) -> str:
    return (
        "आप एक सहायक हैं जो भारत सरकार की योजनाओं की जानकारी"
        " बहुत ही सरल हिंदी में गरीब लोगों को समझाते हैं।\n\n"
        f"सवाल: {user_text.strip()}\n\n"
        "उत्तर आसान, छोटे बिंदुओं में, और स्पष्ट हिंदी में दें।\n"
        "अगर योजना का नाम, पात्रता, आवेदन प्रक्रिया और लाभ बता सकें तो शामिल करें।\n\n"
        "उत्तर:\n"
    )

def _postprocess_generated(user_prompt: str, generated_text: str) -> str:
    try:
        if generated_text.startswith(user_prompt):
            generated_text = generated_text[len(user_prompt):]
        return generated_text.strip()
    except Exception:
        return generated_text.strip()

def find_scheme_info(user_text: str):
    for scheme_name, data in SCHEMES.items():
        if scheme_name in user_text:
            return scheme_name, data
    return None, None

# ---------------- Waste Classification Helper ----------------
def classify_waste_from_features(avg_r: float, avg_g: float, avg_b: float, brightness: float, saturation: float, color_variance: float, edge_density: float):
    scores = {
        'food_waste': 0,
        'plastic_container': 0,
        'paper_item': 0,
        'metal_item': 0,
        'glass_item': 0,
        'electronic_device': 0,
        'textile_item': 0,
    }

    # Similar heuristics as frontend WasteClassification.jsx
    if avg_r > 100 and avg_g > 80 and avg_b < 100:
        scores['food_waste'] += 30
    if saturation < 50:
        scores['food_waste'] += 20
    if color_variance > 80:
        scores['food_waste'] += 25
    if edge_density > 0.1:
        scores['food_waste'] += 15

    if brightness > 150:
        scores['plastic_container'] += 25
    if 40 < saturation < 120:
        scores['plastic_container'] += 20
    if 40 < color_variance < 100:
        scores['plastic_container'] += 20
    if edge_density < 0.08:
        scores['plastic_container'] += 15

    if brightness > 180:
        scores['paper_item'] += 30
    if saturation < 30:
        scores['paper_item'] += 25
    if color_variance < 50:
        scores['paper_item'] += 20
    if edge_density < 0.05:
        scores['paper_item'] += 15

    if abs(avg_r - avg_g) < 20 and abs(avg_g - avg_b) < 20:
        scores['metal_item'] += 25
    if 120 < brightness < 200:
        scores['metal_item'] += 20
    if saturation < 40:
        scores['metal_item'] += 20
    if edge_density > 0.12:
        scores['metal_item'] += 15

    if brightness > 200:
        scores['glass_item'] += 25
    if color_variance < 30:
        scores['glass_item'] += 20
    if edge_density > 0.15:
        scores['glass_item'] += 20
    if saturation < 20:
        scores['glass_item'] += 15

    if brightness < 100:
        scores['electronic_device'] += 25
    if color_variance > 60:
        scores['electronic_device'] += 20
    if edge_density > 0.08:
        scores['electronic_device'] += 20
    if saturation > 30:
        scores['electronic_device'] += 15

    if 80 < brightness < 180:
        scores['textile_item'] += 20
    if color_variance > 70:
        scores['textile_item'] += 25
    if edge_density < 0.06:
        scores['textile_item'] += 20
    if saturation > 20:
        scores['textile_item'] += 15

    best = max(scores.items(), key=lambda kv: kv[1])
    max_possible = 90
    confidence = min(95, max(70, round((best[1] / max_possible) * 100)))
    return best[0], confidence, scores

# ---------------- Routes ----------------
@app.route("/", methods=["GET"])
def health_check():
    logger.info("Health check pinged")
    return jsonify({
        "status": "running",
        "message": "JantaVoice API is live 🚀",
        "version": "2.0",
        "timestamp_utc": datetime.utcnow().isoformat() + "Z",
        "chatbot_model": HF_MODEL_NAME,
        "chatbot_loaded": chatbot is not None
    }), 200

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        if chatbot is None:
            return jsonify({"reply": "Chatbot model not loaded."}), 500

        data = request.get_json(silent=True) or {}
        prompt = data.get("message", "").strip()

        if not prompt:
            return jsonify({"reply": "Message is empty"}), 400

        # Step 1: Predefined schemes
        scheme_name, scheme_data = find_scheme_info(prompt)
        if scheme_data:
            reply = f"👉 *{scheme_name}*\n\n"
            reply += f"🌐 आधिकारिक लिंक: {scheme_data['link']}\n\n"
            reply += f"📌 पात्रता: {scheme_data['eligibility']}\n\n"
            reply += f"🎯 लाभ: {scheme_data['benefits']}\n\n"
            reply += "📝 आवेदन की प्रक्रिया:\n"
            for i, step in enumerate(scheme_data["steps"], 1):
                reply += f"{i}. {step}\n"

            return jsonify({"reply": reply}), 200

        # Step 2: LLM fallback
        full_prompt = _build_prompt(prompt)
        outputs = chatbot(
            full_prompt,
            max_length=GEN_MAX_LENGTH,
            do_sample=GEN_DO_SAMPLE,
            top_p=GEN_TOP_P,
            temperature=GEN_TEMPERATURE,
            num_return_sequences=1,
            pad_token_id=None
        )
        raw_text = outputs[0].get("generated_text", "")
        reply = _postprocess_generated(full_prompt, raw_text)

        return jsonify({"reply": reply}), 200

    except Exception as e:
        logger.exception("Chat error")
        return jsonify({"reply": f"Error: {str(e)}"}), 500


@app.route("/api/waste/classify", methods=["POST"])
def waste_classify():
    """
    Accepts an image file 'image'. Computes simple color/edge features and classifies.
    Returns category, confidence, and features used. No persistence.
    """
    try:
        if 'image' not in request.files:
            return jsonify({"success": False, "message": "Image file required"}), 400
        file = request.files['image']
        if not file:
            return jsonify({"success": False, "message": "Empty file"}), 400

        # Read image bytes and compute coarse features using Pillow (if available)
        from PIL import Image
        import numpy as np

        img = Image.open(file.stream).convert('RGB')
        # Downscale to speed up feature extraction
        img = img.resize((256, 256))
        arr = np.asarray(img, dtype=np.float32)
        h, w, _ = arr.shape
        total_pixels = h * w

        avg_r = float(arr[:, :, 0].mean())
        avg_g = float(arr[:, :, 1].mean())
        avg_b = float(arr[:, :, 2].mean())
        brightness = (avg_r + avg_g + avg_b) / 3.0
        saturation = float(np.max(arr, axis=2).mean() - np.min(arr, axis=2).mean())

        # Color variance
        mean_vec = np.array([avg_r, avg_g, avg_b])
        diff = arr - mean_vec
        color_variance = float(np.sqrt((diff ** 2).sum(axis=2)).mean())

        # Simple edge density via horizontal diff
        gray = arr.mean(axis=2)
        diff_h = np.abs(gray[:, 1:] - gray[:, :-1])
        edge_density = float((diff_h > 30).sum()) / float(total_pixels)

        waste_type, confidence, scores = classify_waste_from_features(
            avg_r, avg_g, avg_b, brightness, saturation, color_variance, edge_density
        )

        return jsonify({
            "success": True,
            "result": {
                "wasteType": waste_type,
                "confidence": confidence,
                "features": {
                    "avgR": avg_r, "avgG": avg_g, "avgB": avg_b,
                    "brightness": brightness, "saturation": saturation,
                    "colorVariance": color_variance, "edgeDensity": edge_density
                },
                "scores": scores
            }
        }), 200
    except Exception as e:
        logger.exception("Waste classify error")
        return jsonify({"success": False, "message": str(e)}), 500

# Voice bot functionality removed as requested

# ---------------- Error Handlers ----------------
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ---------------- Main ----------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("DEBUG", "True").lower() == "true"
    logger.info(f"🚀 Starting JantaVoice server on port {port}")
    app.run(debug=debug_mode, use_reloader=False, host="0.0.0.0", port=port)

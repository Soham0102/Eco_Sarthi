from flask import send_from_directory, Blueprint, request, jsonify, session
from config import complaints_collection
from utils.generate_id import generate_complaint_id, generate_token
import datetime
import os
import traceback
import logging

# Setup logging
logger = logging.getLogger(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

complaint_routes = Blueprint("complaint_routes", __name__)

# Check if database is available
def is_database_available():
    """Check if MongoDB is available"""
    return complaints_collection is not None

# ------------------ Serve uploaded files ------------------
@complaint_routes.route('/uploads/<filename>')
def uploaded_file(filename):
    """
    Serves files from the UPLOAD_FOLDER directory.
    """
    return send_from_directory(UPLOAD_FOLDER, filename)

# ------------------ Helper for safe float conversion ------------------
def _to_float(v):
    """
    Converts a value to a float, returning None on failure.
    """
    try:
        if v is None:
            return None
        if isinstance(v, (int, float)):
            return float(v)
        s = str(v).strip()
        if s == "" or s.lower() == "null":
            return None
        return float(s)
    except (ValueError, TypeError):
        return None

# ------------------ Unified Complaint Submission Endpoint ------------------
@complaint_routes.route("/api/complaint", methods=["POST"])
def submit_complaint():
    """
    Handles both text-based and voice/photo-based complaint submissions.
    """
    try:
        complaint_id = generate_complaint_id()
        token = generate_token()
        
        # Determine if the request is for file upload or JSON data
        if request.content_type and request.content_type.startswith("multipart/form-data"):
            # This handles voice/photo complaints
            complaint_data = request.form
            voice_file = request.files.get("voice")
            photo_file = request.files.get("photo")
            complaint_type = "voice" if voice_file else "text"
            
            # Save files if they exist
            voice_path = None
            if voice_file:
                save_path = os.path.join(UPLOAD_FOLDER, f"{complaint_id}.wav")
                voice_file.save(save_path)
                voice_path = f"/uploads/{complaint_id}.wav"
            
            photo_url = None
            if photo_file:
                photo_filename = f"{complaint_id}_{photo_file.filename}"
                photo_path = os.path.join(UPLOAD_FOLDER, photo_filename)
                photo_file.save(photo_path)
                photo_url = f"/uploads/{photo_filename}"
            
            complaint = {
                "id": complaint_id,
                "token": token,
                "type": complaint_type,
                "name": complaint_data.get("name"),
                "location": complaint_data.get("location"),
                "latitude": _to_float(complaint_data.get("latitude")),
                "longitude": _to_float(complaint_data.get("longitude")),
                "department": complaint_data.get("department"),
                "urgency": complaint_data.get("urgency"),
                "description": complaint_data.get("description"),
                "timestamp": datetime.datetime.utcnow(),
                "status": "Pending",
                "voice_path": voice_path,
                "photoUrl": photo_url
            }

        else:
            # This handles JSON data complaints
            complaint_data = request.json
            if not all(k in complaint_data for k in ["name", "description", "location", "urgency", "department"]):
                return jsonify({"success": False, "message": "Missing one or more required fields."}), 400

            complaint = {
                "id": complaint_id,
                "token": token,
                "type": "text",
                "name": complaint_data.get("name"),
                "location": complaint_data.get("location"),
                "latitude": _to_float(complaint_data.get("latitude")),
                "longitude": _to_float(complaint_data.get("longitude")),
                "department": complaint_data.get("department"),
                "urgency": complaint_data.get("urgency"),
                "description": complaint_data.get("description"),
                "timestamp": datetime.datetime.utcnow(),
                "status": "Pending"
            }

        # Check if database is available
        if not is_database_available():
            logger.warning("Database not available - complaint not saved")
            return jsonify({
                "success": True,
                "complaintId": complaint_id,
                "token": token,
                "message": "Complaint processed but not saved (database unavailable)"
            }), 201

        inserted = complaints_collection.insert_one(complaint)

        # Award citizen points if a citizenId is provided
        try:
            citizen_id = (request.form.get('citizenId') if request.content_type and request.content_type.startswith("multipart/form-data") else (request.json or {}).get('citizenId'))
            if citizen_id:
                import sqlite3
                conn = sqlite3.connect('ecosarthi.db')
                cursor = conn.cursor()
                # Add citizen activity and increment points
                cursor.execute('''
                    INSERT INTO citizen_activities (citizen_id, activity_type, description, points_earned)
                    VALUES (?, 'Complaint', 'Filed a complaint', 10)
                ''', (citizen_id,))
                cursor.execute('''
                    UPDATE citizens SET green_points = green_points + 10 WHERE citizen_id = ?
                ''', (citizen_id,))
                conn.commit()
                conn.close()
        except Exception:
            pass

        # We'll return the complaint ID and a token for client-side use
        return jsonify({
            "success": True,
            "complaintId": complaint_id,
            "token": str(inserted.inserted_id)
        }), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "message": "Submission failed.", "error": str(e)}), 500

# ------------------ Women & Child Complaint ------------------
@complaint_routes.route("/api/complaint/women-child", methods=["POST"])
def submit_women_child_complaint():
    """
    Dedicated endpoint for Women & Child complaints.
    """
    try:
        complaint_id = generate_complaint_id()
        token = generate_token()

        # Determine if the request is for file upload or JSON data
        if request.content_type and request.content_type.startswith("multipart/form-data"):
            complaint_data = request.form
            voice_file = request.files.get("voice")
            photo_file = request.files.get("photo")
            complaint_type = "voice" if voice_file else "text"

            # Log received data for debugging
            logger.info(f"Received women-child complaint data: {dict(complaint_data)}")
            logger.info(f"Complaint text received: '{complaint_data.get('text', 'NOT_FOUND')}'")

            voice_path = None
            if voice_file:
                save_path = os.path.join(UPLOAD_FOLDER, f"{complaint_id}.wav")
                voice_file.save(save_path)
                voice_path = f"/uploads/{complaint_id}.wav"
            
            photo_url = None
            if photo_file:
                photo_filename = f"{complaint_id}_{photo_file.filename}"
                photo_path = os.path.join(UPLOAD_FOLDER, photo_filename)
                photo_file.save(photo_path)
                photo_url = f"/uploads/{photo_filename}"

            # Handle both 'text' and 'description' fields from frontend
            complaint_text = complaint_data.get("text") or complaint_data.get("description") or "No complaint text provided"
            
            logger.info(f"Final complaint text to be saved: '{complaint_text}'")

            complaint = {
                "id": complaint_id,
                "token": token,
                "type": complaint_type,
                "category": "Women-Child",
                "name": complaint_data.get("name", "Anonymous"),
                "location": complaint_data.get("location", "Unknown"),
                "latitude": _to_float(complaint_data.get("latitude")),
                "longitude": _to_float(complaint_data.get("longitude")),
                "department": complaint_data.get("department", "Women-Child"),
                "urgency": complaint_data.get("urgency", "normal"),
                "description": complaint_text,  # Use the complaint text here
                "timestamp": datetime.datetime.utcnow(),
                "status": "Pending",
                "voice_path": voice_path,
                "photoUrl": photo_url
            }

        else:
            complaint_data = request.json
            if not all(k in complaint_data for k in ["name", "description", "location", "urgency", "department"]):
                return jsonify({"success": False, "message": "Missing one or more required fields."}), 400

            complaint = {
                "id": complaint_id,
                "token": token,
                "type": "text",
                "category": "Women-Child",
                "name": complaint_data.get("name"),
                "location": complaint_data.get("location"),
                "latitude": _to_float(complaint_data.get("latitude")),
                "longitude": _to_float(complaint_data.get("longitude")),
                "department": complaint_data.get("department"),
                "urgency": complaint_data.get("urgency"),
                "description": complaint_data.get("description"),
                "timestamp": datetime.datetime.utcnow(),
                "status": "Pending"
            }
        
        inserted = complaints_collection.insert_one(complaint)

        return jsonify({
            "success": True,
            "complaintId": complaint_id,
            "token": str(inserted.inserted_id)
        }), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "message": "Submission failed.", "error": str(e)}), 500

# ------------------ Update Complaint Status ------------------
@complaint_routes.route("/api/complaint/status", methods=["PUT"])
def update_complaint_status():
    """
    Updates the status of a complaint. Requires admin authentication.
    """
    try:
        if "admin_logged_in" not in session:
            return jsonify({"success": False, "message": "Unauthorized"}), 401

        data = request.json
        complaint_id = data.get("id")
        new_status = data.get("status")

        if not complaint_id or not new_status:
            return jsonify({"success": False, "message": "Invalid input"}), 400

        result = complaints_collection.update_one(
            {"id": complaint_id},
            {"$set": {"status": new_status}}
        )

        if result.modified_count == 0:
            return jsonify({"success": False, "message": "No complaint found with the given ID"}), 404

        return jsonify({"success": True, "message": "Complaint status updated successfully"}), 200

    except Exception as e:
        return jsonify({"success": False, "message": "Internal server error", "error": str(e)}), 500

# ------------------ Get Complaint Status ------------------
@complaint_routes.route("/api/complaint/<complaint_id>", methods=["GET"])
def get_complaint_status(complaint_id):
    """
    Retrieves a single complaint by its ID.
    """
    try:
        complaint = complaints_collection.find_one({"id": complaint_id})
        if not complaint:
            return jsonify({"success": False, "message": "Complaint not found"}), 404

        # Clean up the object before returning
        complaint.pop('_id', None)
        complaint.pop('token', None) # Don't expose the internal token

        return jsonify({
            "success": True,
            "complaint": {
                "complaintId": complaint.get("id"),
                "name": complaint.get("name"),
                "location": complaint.get("location"),
                "latitude": complaint.get("latitude"),
                "longitude": complaint.get("longitude"),
                "department": complaint.get("department"),
                "urgency": complaint.get("urgency"),
                "description": complaint.get("description"),
                "status": complaint.get("status"),
                "photoUrl": complaint.get("photoUrl"),
                "voice_path": complaint.get("voice_path")
            }
        }), 200

    except Exception as e:
        return jsonify({"success": False, "message": "Failed to fetch complaint", "error": str(e)}), 500
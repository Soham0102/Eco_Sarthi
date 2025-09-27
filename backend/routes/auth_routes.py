from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from config import users_collection
import datetime

auth_routes = Blueprint("auth_routes", __name__)


def is_db():
    return users_collection is not None


@auth_routes.route("/api/auth/signup", methods=["POST"])
def signup():
    if not is_db():
        return jsonify({"success": False, "message": "Database unavailable"}), 503

    data = request.get_json(silent=True) or {}
    role = (data.get("role") or "").strip().lower()  # citizen|worker|admin
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()
    name = (data.get("name") or "").strip()

    if role not in {"citizen", "worker", "admin"}:
        return jsonify({"success": False, "message": "Invalid role"}), 400
    if not email or not password or not name:
        return jsonify({"success": False, "message": "name, email, password required"}), 400

    existing = users_collection.find_one({"email": email})
    if existing:
        return jsonify({"success": False, "message": "Email already registered"}), 409

    user_doc = {
        "name": name,
        "email": email,
        "passwordHash": generate_password_hash(password),
        "role": role,
        "createdAt": datetime.datetime.utcnow(),
        "credits": 0,
        "penalties": 0,
        "profile": data.get("profile", {}),
    }
    users_collection.insert_one(user_doc)
    user_doc["_id"] = str(user_doc.get("_id", ""))
    return jsonify({"success": True, "user": {k: v for k, v in user_doc.items() if k != "passwordHash"}}), 201


@auth_routes.route("/api/auth/login", methods=["POST"])
def login():
    if not is_db():
        return jsonify({"success": False, "message": "Database unavailable"}), 503

    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()
    role = (data.get("role") or "").strip().lower() if data.get("role") else None

    if not email or not password:
        return jsonify({"success": False, "message": "email and password required"}), 400

    user = users_collection.find_one({"email": email})
    if not user or not check_password_hash(user.get("passwordHash", ""), password):
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    if role and user.get("role") != role:
        return jsonify({"success": False, "message": "Role mismatch"}), 403

    session["userId"] = str(user.get("_id"))
    session["role"] = user.get("role")
    return jsonify({
        "success": True,
        "user": {
            "id": str(user.get("_id")),
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role"),
            "credits": user.get("credits", 0),
            "penalties": user.get("penalties", 0),
        }
    }), 200


@auth_routes.route("/api/auth/logout", methods=["POST"])
def logout():
    session.pop("userId", None)
    session.pop("role", None)
    return jsonify({"success": True}), 200



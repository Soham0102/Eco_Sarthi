from flask import Blueprint, request, session, jsonify
from config import complaints_collection
from bson.objectid import ObjectId
import logging

# Setup logging
logger = logging.getLogger(__name__)

# Create a new blueprint for admin-related routes
admin_routes = Blueprint("admin_routes", __name__)

# Dummy credentials for demonstration purposes
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

# Check if database is available
def is_database_available():
    """Check if MongoDB is available"""
    return complaints_collection is not None

# 🔐 Admin Login route
@admin_routes.route("/api/admin/login", methods=["POST"])
def admin_login():
    """Authenticates an admin user and sets a session flag upon successful login."""
    data = request.json
    if data.get("username") == ADMIN_USERNAME and data.get("password") == ADMIN_PASSWORD:
        session["admin_logged_in"] = True
        return jsonify({"success": True, "message": "Login successful."})
    return jsonify({"success": False, "message": "Invalid credentials."}), 401

# 🚪 Admin Logout route
@admin_routes.route("/api/admin/logout", methods=["POST"])
def admin_logout():
    """Logs out the current admin user by clearing the session flag."""
    session.pop("admin_logged_in", None)
    return jsonify({"success": True, "message": "Logged out successfully."})

# 📅 Get all complaints route
@admin_routes.route("/api/admin/complaints", methods=["GET"])
def get_all_complaints():
    """Fetches all complaints from the database and returns them, sorted by timestamp."""
    try:
        # Check for admin session
        if not session.get("admin_logged_in"):
            return jsonify({"success": False, "message": "Unauthorized"}), 401

        # Check if database is available
        if not is_database_available():
            logger.warning("Database not available - returning empty complaints list")
            return jsonify({
                "success": True,
                "complaints": [],
                "message": "Database not available - no complaints loaded"
            }), 200

        # Retrieve and sort all complaints
        complaints = list(complaints_collection.find({}).sort("timestamp", -1))
        
        # Convert ObjectId to string for JSON serialization
        for complaint in complaints:
            complaint["_id"] = str(complaint["_id"])

            # Ensure lat/lng/location fields are always present in the response to prevent key errors on the frontend
            complaint["latitude"] = complaint.get("latitude")
            complaint["longitude"] = complaint.get("longitude")
            complaint["location"] = complaint.get("location")

        return jsonify({
            "success": True,
            "complaints": complaints
        }), 200
    except Exception as e:
        logger.error(f"Error fetching complaints: {e}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
# ✅ Update complaint status route: Pending / Processing / Resolved
@admin_routes.route("/api/admin/update_status", methods=["POST"])
def update_status():
    """Updates the status of a specific complaint based on its ID."""
    # Check for admin session
    if not session.get("admin_logged_in"):
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    data = request.json
    complaint_id = data.get("id")
    new_status = data.get("status")

    if not complaint_id or not new_status:
        return jsonify({"success": False, "message": "Missing ID or status"}), 400

    # Update the complaint status in the database
    result = complaints_collection.update_one(
        {"id": complaint_id},
        {"$set": {"status": new_status}}
    )

    if result.modified_count == 1:
        return jsonify({"success": True, "message": f"Status updated to {new_status}."})
    else:
        # Check if the complaint exists with the same status already
        exists = complaints_collection.find_one({"id": complaint_id})
        if exists:
            return jsonify({"success": True, "message": "Status already set."})
        return jsonify({"success": False, "message": "Complaint not found."})

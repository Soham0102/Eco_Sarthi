from flask import Blueprint, request, jsonify
from datetime import datetime

worker_routes = Blueprint("worker_routes", __name__)


# Very simple demo auth. Replace with real DB check.
@worker_routes.route("/api/worker/login", methods=["POST"])
def worker_login():
    data = request.get_json(silent=True) or {}
    worker_id = (data.get("workerId") or "").strip()
    password = (data.get("password") or "").strip()

    if not worker_id or not password:
        return jsonify({"success": False, "message": "Worker ID and password required"}), 400

    # Demo acceptance: any non-empty credentials; special demo user
    worker_name = "Demo Worker" if worker_id.lower().startswith("worker") else f"Worker {worker_id}"
    return jsonify({
        "success": True,
        "workerId": worker_id,
        "workerName": worker_name
    }), 200


@worker_routes.route("/api/worker/tasks", methods=["GET"])
def worker_tasks():
    # In real app, filter by workerId from auth/session
    tasks = [
        {"id": 1, "type": "Collection", "location": "Sector 15, Gurgaon", "time": "09:00 AM", "status": "pending", "priority": "high"},
        {"id": 2, "type": "Collection", "location": "Sector 16, Gurgaon", "time": "10:30 AM", "status": "pending", "priority": "medium"},
        {"id": 3, "type": "Segregation Check", "location": "Sector 17, Gurgaon", "time": "12:00 PM", "status": "pending", "priority": "high"},
        {"id": 4, "type": "Drop-off", "location": "Waste Processing Facility", "time": "02:00 PM", "status": "pending", "priority": "high"}
    ]
    return jsonify({"tasks": tasks}), 200


@worker_routes.route("/api/worker/tasks/<int:task_id>/complete", methods=["POST"])
def complete_task(task_id: int):
    payload = request.get_json(silent=True) or {}
    # Here you would persist completion, photo URL, notes, etc.
    return jsonify({
        "success": True,
        "taskId": task_id,
        "completedAt": datetime.utcnow().isoformat() + "Z",
        "notes": payload.get("notes"),
        "photo": payload.get("photo")
    }), 200


@worker_routes.route("/api/worker/issues", methods=["POST"])
def report_issue():
    data = request.get_json(silent=True) or {}
    if not data.get("type") or not data.get("location"):
        return jsonify({"success": False, "message": "type and location required"}), 400
    return jsonify({
        "success": True,
        "issue": {
            "id": int(datetime.utcnow().timestamp()),
            "type": data.get("type"),
            "location": data.get("location"),
            "description": data.get("description"),
            "priority": data.get("priority", "medium"),
            "reportedAt": datetime.utcnow().isoformat() + "Z",
            "gpsLocation": data.get("gpsLocation"),
            "photos": data.get("photos", [])
        }
    }), 200



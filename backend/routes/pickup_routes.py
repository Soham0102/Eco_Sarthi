from flask import Blueprint, request, jsonify
from config import pickup_collection
from utils.generate_id import generate_pickup_id
import datetime
import logging
import traceback

# Setup logging
logger = logging.getLogger(__name__)

pickup_routes = Blueprint("pickup_routes", __name__)

# Check if database is available
def is_database_available():
    """Check if MongoDB is available"""
    return pickup_collection is not None

# ------------------ Create Pickup Request ------------------
@pickup_routes.route("/api/pickup/request", methods=["POST"])
def create_pickup_request():
    """
    Create a new pickup request for recyclable materials
    """
    try:
        if not is_database_available():
            return jsonify({
                "success": False, 
                "message": "Database not available. Please try again later."
            }), 503

        data = request.json
        
        # Validate required fields
        required_fields = ["name", "phone", "address", "materials", "preferredDate", "preferredTime"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    "success": False, 
                    "message": f"Missing required field: {field}"
                }), 400

        # Generate unique pickup ID
        pickup_id = generate_pickup_id()
        
        # Create pickup request object
        pickup_request = {
            "id": pickup_id,
            "name": data["name"],
            "phone": data["phone"],
            "email": data.get("email", ""),
            "address": data["address"],
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude"),
            "materials": data["materials"],  # List of recyclable materials
            "quantity": data.get("quantity", "Medium"),
            "preferredDate": data["preferredDate"],
            "preferredTime": data["preferredTime"],
            "specialInstructions": data.get("specialInstructions", ""),
            "status": "Pending",
            "createdAt": datetime.datetime.utcnow(),
            "updatedAt": datetime.datetime.utcnow(),
            "assignedDriver": None,
            "pickupDate": None,
            "pickupTime": None,
            "notes": []
        }

        # Insert into database
        result = pickup_collection.insert_one(pickup_request)
        
        if result.inserted_id:
            logger.info(f"Pickup request created successfully: {pickup_id}")
            # Create a clean response without ObjectId
            response_data = pickup_request.copy()
            response_data["_id"] = str(result.inserted_id)
            return jsonify({
                "success": True,
                "message": "Pickup request created successfully!",
                "pickupId": pickup_id,
                "data": response_data
            }), 201
        else:
            return jsonify({
                "success": False,
                "message": "Failed to create pickup request"
            }), 500

    except Exception as e:
        logger.error(f"Error creating pickup request: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "success": False,
            "message": "Internal server error. Please try again later."
        }), 500

# ------------------ Get All Pickup Requests (Admin) ------------------
@pickup_routes.route("/api/pickup/requests", methods=["GET"])
def get_all_pickup_requests():
    """
    Get all pickup requests (for admin dashboard)
    """
    try:
        if not is_database_available():
            return jsonify({
                "success": False, 
                "message": "Database not available. Please try again later."
            }), 503

        # Get query parameters for filtering
        status_filter = request.args.get("status", "All")
        date_filter = request.args.get("date", "All")
        
        # Build filter
        filter_query = {}
        if status_filter != "All":
            filter_query["status"] = status_filter
            
        if date_filter != "All":
            today = datetime.datetime.utcnow().date()
            if date_filter == "Today":
                filter_query["preferredDate"] = today.strftime("%Y-%m-%d")
            elif date_filter == "This Week":
                start_of_week = today - datetime.timedelta(days=today.weekday())
                end_of_week = start_of_week + datetime.timedelta(days=6)
                filter_query["preferredDate"] = {
                    "$gte": start_of_week.strftime("%Y-%m-%d"),
                    "$lte": end_of_week.strftime("%Y-%m-%d")
                }

        # Get pickup requests with pagination
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 20))
        skip = (page - 1) * limit

        # Get total count
        total_count = pickup_collection.count_documents(filter_query)
        
        # Get pickup requests
        pickup_requests = list(pickup_collection.find(filter_query)
                             .sort("createdAt", -1)
                             .skip(skip)
                             .limit(limit))

        # Convert ObjectId to string for JSON serialization
        for pickup_request in pickup_requests:
            pickup_request["_id"] = str(pickup_request["_id"])
            pickup_request["createdAt"] = pickup_request["createdAt"].isoformat()
            pickup_request["updatedAt"] = pickup_request["updatedAt"].isoformat()

        return jsonify({
            "success": True,
            "data": pickup_requests,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": (total_count + limit - 1) // limit
            }
        }), 200

    except Exception as e:
        logger.error(f"Error fetching pickup requests: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "success": False,
            "message": "Internal server error. Please try again later."
        }), 500

# ------------------ Get Pickup Request by ID ------------------
@pickup_routes.route("/api/pickup/request/<pickup_id>", methods=["GET"])
def get_pickup_request(pickup_id):
    """
    Get a specific pickup request by ID
    """
    try:
        if not is_database_available():
            return jsonify({
                "success": False, 
                "message": "Database not available. Please try again later."
            }), 503

        pickup_request = pickup_collection.find_one({"id": pickup_id})
        
        if not pickup_request:
            return jsonify({
                "success": False,
                "message": "Pickup request not found"
            }), 404

        # Convert ObjectId to string for JSON serialization
        pickup_request["_id"] = str(pickup_request["_id"])
        pickup_request["createdAt"] = pickup_request["createdAt"].isoformat()
        pickup_request["updatedAt"] = pickup_request["updatedAt"].isoformat()

        return jsonify({
            "success": True,
            "data": pickup_request
        }), 200

    except Exception as e:
        logger.error(f"Error fetching pickup request {pickup_id}: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "success": False,
            "message": "Internal server error. Please try again later."
        }), 500

# ------------------ Update Pickup Request Status ------------------
@pickup_routes.route("/api/pickup/request/<pickup_id>/status", methods=["PUT"])
def update_pickup_status(pickup_id):
    """
    Update the status of a pickup request (for admin)
    """
    try:
        if not is_database_available():
            return jsonify({
                "success": False, 
                "message": "Database not available. Please try again later."
            }), 503

        data = request.json
        new_status = data.get("status")
        notes = data.get("notes", "")
        
        if not new_status:
            return jsonify({
                "success": False,
                "message": "Status is required"
            }), 400

        # Valid statuses
        valid_statuses = ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"]
        if new_status not in valid_statuses:
            return jsonify({
                "success": False,
                "message": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            }), 400

        # Update the pickup request
        update_data = {
            "status": new_status,
            "updatedAt": datetime.datetime.utcnow()
        }

        # Add notes if provided
        if notes:
            update_data["notes"] = pickup_collection.find_one({"id": pickup_id}).get("notes", []) + [{
                "text": notes,
                "timestamp": datetime.datetime.utcnow().isoformat(),
                "status": new_status
            }]

        # Add pickup date/time if status is confirmed
        if new_status == "Confirmed":
            update_data["pickupDate"] = data.get("pickupDate")
            update_data["pickupTime"] = data.get("pickupTime")
            update_data["assignedDriver"] = data.get("assignedDriver")

        result = pickup_collection.update_one(
            {"id": pickup_id},
            {"$set": update_data}
        )

        if result.modified_count > 0:
            logger.info(f"Pickup request {pickup_id} status updated to {new_status}")
            return jsonify({
                "success": True,
                "message": f"Pickup request status updated to {new_status}"
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Pickup request not found or no changes made"
            }), 404

    except Exception as e:
        logger.error(f"Error updating pickup request {pickup_id} status: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "success": False,
            "message": "Internal server error. Please try again later."
        }), 500

# ------------------ Get Pickup Statistics ------------------
@pickup_routes.route("/api/pickup/stats", methods=["GET"])
def get_pickup_statistics():
    """
    Get statistics for pickup requests (for admin dashboard)
    """
    try:
        if not is_database_available():
            return jsonify({
                "success": False, 
                "message": "Database not available. Please try again later."
            }), 503

        # Get total counts by status
        total_pending = pickup_collection.count_documents({"status": "Pending"})
        total_confirmed = pickup_collection.count_documents({"status": "Confirmed"})
        total_in_progress = pickup_collection.count_documents({"status": "In Progress"})
        total_completed = pickup_collection.count_documents({"status": "Completed"})
        total_cancelled = pickup_collection.count_documents({"status": "Cancelled"})
        total_requests = pickup_collection.count_documents({})

        # Get today's requests
        today = datetime.datetime.utcnow().date()
        today_requests = pickup_collection.count_documents({
            "createdAt": {
                "$gte": datetime.datetime.combine(today, datetime.time.min),
                "$lt": datetime.datetime.combine(today, datetime.time.max)
            }
        })

        # Get this week's requests
        start_of_week = today - datetime.timedelta(days=today.weekday())
        end_of_week = start_of_week + datetime.timedelta(days=6)
        week_requests = pickup_collection.count_documents({
            "createdAt": {
                "$gte": datetime.datetime.combine(start_of_week, datetime.time.min),
                "$lt": datetime.datetime.combine(end_of_week, datetime.time.max)
            }
        })

        # Get material distribution
        pipeline = [
            {"$unwind": "$materials"},
            {"$group": {"_id": "$materials", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        material_stats = list(pickup_collection.aggregate(pipeline))

        stats = {
            "totalRequests": total_requests,
            "statusCounts": {
                "pending": total_pending,
                "confirmed": total_confirmed,
                "inProgress": total_in_progress,
                "completed": total_completed,
                "cancelled": total_cancelled
            },
            "timeBased": {
                "today": today_requests,
                "thisWeek": week_requests
            },
            "materialDistribution": material_stats
        }

        return jsonify({
            "success": True,
            "data": stats
        }), 200

    except Exception as e:
        logger.error(f"Error fetching pickup statistics: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "success": False,
            "message": "Internal server error. Please try again later."
        }), 500

# ------------------ Search Pickup Requests ------------------
@pickup_routes.route("/api/pickup/search", methods=["GET"])
def search_pickup_requests():
    """
    Search pickup requests by various criteria
    """
    try:
        if not is_database_available():
            return jsonify({
                "success": False, 
                "message": "Database not available. Please try again later."
            }), 503

        search_term = request.args.get("q", "")
        if not search_term:
            return jsonify({
                "success": False,
                "message": "Search term is required"
            }), 400

        # Build search query
        search_query = {
            "$or": [
                {"name": {"$regex": search_term, "$options": "i"}},
                {"phone": {"$regex": search_term, "$options": "i"}},
                {"address": {"$regex": search_term, "$options": "i"}},
                {"id": {"$regex": search_term, "$options": "i"}}
            ]
        }

        # Get search results
        results = list(pickup_collection.find(search_query)
                      .sort("createdAt", -1)
                      .limit(20))

        # Convert ObjectId to string for JSON serialization
        for pickup_result in results:
            pickup_result["_id"] = str(pickup_result["_id"])
            pickup_result["createdAt"] = pickup_result["createdAt"].isoformat()
            pickup_result["updatedAt"] = pickup_result["updatedAt"].isoformat()

        return jsonify({
            "success": True,
            "data": results,
            "count": len(results)
        }), 200

    except Exception as e:
        logger.error(f"Error searching pickup requests: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "success": False,
            "message": "Internal server error. Please try again later."
        }), 500

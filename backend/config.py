from pymongo import MongoClient
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    # Connect to MongoDB
    client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=5000)
    
    # Test the connection
    client.admin.command('ping')
    logger.info("✅ MongoDB connection successful")
    
    db = client["ecosaathi"]
    complaints_collection = db["complaints"]
    pickup_collection = db["pickup_requests"]
    users_collection = db["users"]
    training_progress_collection = db["training_progress"]
    reports_collection = db["reports"]
    rewards_collection = db["rewards"]
    admin_records_collection = db["admin_records"]
    facility_data_collection = db["facility_data"]
    worker_tasks_collection = db["worker_tasks"]
    cms_materials_collection = db["cms_materials"]
    segregation_rules_collection = db["segregation_rules"]
    
    # Test if we can access the collections
    complaints_collection.find_one()
    pickup_collection.find_one()
    users_collection.find_one()
    training_progress_collection.find_one()
    reports_collection.find_one()
    rewards_collection.find_one()
    admin_records_collection.find_one()
    facility_data_collection.find_one()
    worker_tasks_collection.find_one()
    cms_materials_collection.find_one()
    segregation_rules_collection.find_one()
    logger.info("✅ Database and collections access successful")
    
except Exception as e:
    logger.error(f"❌ MongoDB connection failed: {e}")
    logger.error("Please make sure MongoDB is running on localhost:27017")
    
    # Create fallback collections for testing
    complaints_collection = None
    pickup_collection = None
    users_collection = None
    training_progress_collection = None
    reports_collection = None
    rewards_collection = None
    admin_records_collection = None
    facility_data_collection = None
    worker_tasks_collection = None
    cms_materials_collection = None
    segregation_rules_collection = None
    logger.warning("⚠️  Using fallback mode - complaints and pickup requests will not be saved to database")

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
    
    # Test if we can access the collections
    complaints_collection.find_one()
    pickup_collection.find_one()
    logger.info("✅ Database and collections access successful")
    
except Exception as e:
    logger.error(f"❌ MongoDB connection failed: {e}")
    logger.error("Please make sure MongoDB is running on localhost:27017")
    
    # Create fallback collections for testing
    complaints_collection = None
    pickup_collection = None
    logger.warning("⚠️  Using fallback mode - complaints and pickup requests will not be saved to database")

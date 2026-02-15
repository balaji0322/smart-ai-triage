#!/usr/bin/env python3
"""
MongoDB Connection Test Script
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_mongodb_connection():
    """Test MongoDB connection"""
    
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    db_name = os.getenv("MONGODB_DB_NAME", "triage_db")
    
    print("=" * 60)
    print("MongoDB Connection Test")
    print("=" * 60)
    print()
    print(f"Connection URL: {mongodb_url}")
    print(f"Database Name: {db_name}")
    print()
    
    try:
        # Create client
        print("Connecting to MongoDB...")
        client = AsyncIOMotorClient(mongodb_url, serverSelectionTimeoutMS=5000)
        
        # Test connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        print()
        
        # Get database
        db = client[db_name]
        
        # List collections
        collections = await db.list_collection_names()
        print(f"Collections in '{db_name}':")
        if collections:
            for collection in collections:
                count = await db[collection].count_documents({})
                print(f"  - {collection}: {count} documents")
        else:
            print("  (No collections yet - will be created on first use)")
        print()
        
        # Test write operation
        print("Testing write operation...")
        test_collection = db.test_connection
        result = await test_collection.insert_one({"test": "connection", "status": "success"})
        print(f"✅ Write test successful! Document ID: {result.inserted_id}")
        
        # Test read operation
        print("Testing read operation...")
        doc = await test_collection.find_one({"_id": result.inserted_id})
        print(f"✅ Read test successful! Document: {doc}")
        
        # Clean up test document
        await test_collection.delete_one({"_id": result.inserted_id})
        print("✅ Cleanup successful!")
        print()
        
        print("=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        print()
        print("Your MongoDB connection is working correctly.")
        print("You can now start the backend server.")
        print()
        
        # Close connection
        client.close()
        return True
        
    except Exception as e:
        print("❌ Connection failed!")
        print()
        print(f"Error: {str(e)}")
        print()
        print("=" * 60)
        print("Troubleshooting:")
        print("=" * 60)
        print()
        print("1. Check if MongoDB is running:")
        print("   - Local: mongosh")
        print("   - Docker: docker ps | findstr mongo")
        print()
        print("2. Verify connection string in .env file")
        print()
        print("3. For MongoDB Atlas:")
        print("   - Check IP whitelist")
        print("   - Verify username/password")
        print("   - Ensure connection string is correct")
        print()
        print("4. Install MongoDB:")
        print("   - Download: https://www.mongodb.com/try/download/community")
        print("   - Or use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas")
        print()
        
        return False

if __name__ == "__main__":
    result = asyncio.run(test_mongodb_connection())
    sys.exit(0 if result else 1)

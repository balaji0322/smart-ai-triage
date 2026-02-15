#!/usr/bin/env python3
"""
Create MongoDB Indexes for Better Performance
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def create_indexes():
    """Create recommended indexes"""
    
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    db_name = os.getenv("MONGODB_DB_NAME", "triage_db")
    
    print("=" * 60)
    print("Creating MongoDB Indexes")
    print("=" * 60)
    print()
    
    try:
        client = AsyncIOMotorClient(mongodb_url)
        db = client[db_name]
        
        # Users collection indexes
        print("Creating indexes for 'users' collection...")
        await db.users.create_index("email", unique=True)
        print("  ✅ email (unique)")
        
        # Patients collection indexes
        print("Creating indexes for 'patients' collection...")
        await db.patients.create_index("user_id", unique=True)
        print("  ✅ user_id (unique)")
        
        # Triage records collection indexes
        print("Creating indexes for 'triage_records' collection...")
        await db.triage_records.create_index("patient_id")
        print("  ✅ patient_id")
        await db.triage_records.create_index("status")
        print("  ✅ status")
        await db.triage_records.create_index([("priority_score", -1)])
        print("  ✅ priority_score (descending)")
        await db.triage_records.create_index([("created_at", -1)])
        print("  ✅ created_at (descending)")
        
        # Audit logs collection indexes
        print("Creating indexes for 'audit_logs' collection...")
        await db.audit_logs.create_index([("timestamp", -1)])
        print("  ✅ timestamp (descending)")
        await db.audit_logs.create_index("user_id")
        print("  ✅ user_id")
        
        print()
        print("=" * 60)
        print("✅ All indexes created successfully!")
        print("=" * 60)
        print()
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating indexes: {str(e)}")
        return False

if __name__ == "__main__":
    asyncio.run(create_indexes())

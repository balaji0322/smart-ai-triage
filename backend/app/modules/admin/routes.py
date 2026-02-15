from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter()

@router.get("/analytics")
async def get_analytics(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Total triages
    total_triages = await db.triage_records.count_documents({})
    
    # Risk distribution
    pipeline = [
        {"$group": {"_id": "$risk_level", "count": {"$sum": 1}}}
    ]
    risk_dist_cursor = db.triage_records.aggregate(pipeline)
    risk_distribution = {doc["_id"]: doc["count"] async for doc in risk_dist_cursor}
    
    # Recent triages (last 24 hours)
    last_24h = datetime.utcnow() - timedelta(hours=24)
    recent_triages = await db.triage_records.count_documents({"created_at": {"$gte": last_24h}})
    
    return {
        "total_triages": total_triages,
        "risk_distribution": risk_distribution,
        "recent_triages_24h": recent_triages
    }

@router.get("/system-logs")
async def get_system_logs(
    limit: int = 100,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    cursor = db.audit_logs.find().sort("timestamp", -1).limit(limit)
    logs = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string
    for log in logs:
        log["_id"] = str(log["_id"])
        if log.get("user_id"):
            log["user_id"] = str(log["user_id"])
    
    return logs

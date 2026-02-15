from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from bson import ObjectId

from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter()

@router.get("/pending-cases")
async def get_pending_cases(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if current_user["role"] != "doctor":
        raise HTTPException(status_code=403, detail="Access denied")
    
    cursor = db.triage_records.find({"status": "pending"}).sort("priority_score", -1)
    pending_cases = await cursor.to_list(length=100)
    
    # Convert ObjectId to string
    for case in pending_cases:
        case["_id"] = str(case["_id"])
        case["patient_id"] = str(case["patient_id"])
        if case.get("doctor_assigned"):
            case["doctor_assigned"] = str(case["doctor_assigned"])
    
    return pending_cases

@router.patch("/update-status/{triage_id}")
async def update_triage_status(
    triage_id: str,
    status: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if current_user["role"] != "doctor":
        raise HTTPException(status_code=403, detail="Access denied")
    
    triage_record = await db.triage_records.find_one({"_id": ObjectId(triage_id)})
    
    if not triage_record:
        raise HTTPException(status_code=404, detail="Triage record not found")
    
    await db.triage_records.update_one(
        {"_id": ObjectId(triage_id)},
        {"$set": {
            "status": status,
            "doctor_assigned": current_user["_id"]
        }}
    )
    
    return {"message": "Status updated successfully", "triage_id": triage_id}

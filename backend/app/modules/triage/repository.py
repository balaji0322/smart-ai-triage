from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from bson import ObjectId

class TriageRepository:
    @staticmethod
    async def create_triage_record(
        db: AsyncIOMotorDatabase,
        patient_id: str,
        symptoms: dict,
        vitals: dict,
        risk_level: str,
        ai_confidence: float,
        priority_score: int,
        recommendations: str
    ) -> dict:
        from datetime import datetime
        
        triage_data = {
            "patient_id": ObjectId(patient_id),
            "symptoms": symptoms,
            "vitals": vitals,
            "risk_level": risk_level,
            "ai_confidence": ai_confidence,
            "priority_score": priority_score,
            "recommendations": recommendations,
            "status": "pending",
            "created_at": datetime.utcnow()
        }
        
        result = await db.triage_records.insert_one(triage_data)
        triage_data["_id"] = result.inserted_id
        return triage_data
    
    @staticmethod
    async def get_patient_by_user_id(db: AsyncIOMotorDatabase, user_id: str) -> Optional[dict]:
        patient = await db.patients.find_one({"user_id": ObjectId(user_id)})
        return patient
    
    @staticmethod
    async def get_triage_history(db: AsyncIOMotorDatabase, patient_id: str) -> List[dict]:
        cursor = db.triage_records.find({"patient_id": ObjectId(patient_id)}).sort("created_at", -1)
        records = await cursor.to_list(length=100)
        return records
    
    @staticmethod
    async def get_triage_by_id(db: AsyncIOMotorDatabase, triage_id: str) -> Optional[dict]:
        triage = await db.triage_records.find_one({"_id": ObjectId(triage_id)})
        return triage

triage_repository = TriageRepository()

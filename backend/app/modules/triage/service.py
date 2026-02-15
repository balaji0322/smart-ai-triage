from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status
from typing import List

from app.modules.triage.repository import triage_repository
from app.modules.triage.schema import TriageRequest
from app.services.gemini_ai_service import gemini_service

class TriageService:
    @staticmethod
    async def analyze_patient(db: AsyncIOMotorDatabase, current_user: dict, triage_data: TriageRequest) -> dict:
        patient = await triage_repository.get_patient_by_user_id(db, str(current_user["_id"]))
        
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient profile not found"
            )
        
        ai_response = await gemini_service.analyze_patient(
            symptoms=triage_data.symptoms,
            vitals=triage_data.vitals,
            medical_history=patient.get("medical_history")
        )
        
        triage_record = await triage_repository.create_triage_record(
            db=db,
            patient_id=str(patient["_id"]),
            symptoms=triage_data.symptoms,
            vitals=triage_data.vitals,
            risk_level=ai_response["risk_level"],
            ai_confidence=ai_response["ai_confidence"],
            priority_score=ai_response["priority_score"],
            recommendations=ai_response["recommendations"]
        )
        
        return triage_record
    
    @staticmethod
    async def get_patient_history(db: AsyncIOMotorDatabase, patient_id: str) -> List[dict]:
        return await triage_repository.get_triage_history(db, patient_id)

triage_service = TriageService()

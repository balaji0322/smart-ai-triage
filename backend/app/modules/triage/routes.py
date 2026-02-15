from fastapi import APIRouter, Depends, Request, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.modules.triage.schema import TriageRequest, TriageResponse, TriageHistoryResponse
from app.modules.triage.service import triage_service
from app.modules.triage.repository import triage_repository
from app.services.audit_service import audit_service

router = APIRouter()

@router.post("/analyze", response_model=TriageResponse)
async def analyze_triage(
    triage_data: TriageRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if current_user["role"] != "patient":
        raise HTTPException(status_code=403, detail="Only patients can submit triage requests")
    
    triage_record = await triage_service.analyze_patient(db, current_user, triage_data)
    
    await audit_service.log_action(
        db=db,
        user_id=str(current_user["_id"]),
        action="TRIAGE_ANALYSIS",
        details=f"Risk level: {triage_record['risk_level']}, Priority: {triage_record['priority_score']}",
        ip_address=request.client.host if request.client else None
    )
    
    # Convert to response model
    return TriageResponse(
        id=str(triage_record["_id"]),
        risk_level=triage_record["risk_level"],
        priority_score=triage_record["priority_score"],
        ai_confidence=triage_record["ai_confidence"],
        recommendations=triage_record["recommendations"],
        status=triage_record["status"],
        created_at=triage_record["created_at"]
    )

@router.get("/history/{patient_id}", response_model=List[TriageHistoryResponse])
async def get_triage_history(
    patient_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    patient = await triage_repository.get_patient_by_user_id(db, str(current_user["_id"]))
    
    if current_user["role"] == "patient" and str(patient["_id"]) != patient_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    history = await triage_service.get_patient_history(db, patient_id)
    
    # Convert to response models
    return [
        TriageHistoryResponse(
            id=str(record["_id"]),
            risk_level=record["risk_level"],
            priority_score=record["priority_score"],
            status=record["status"],
            doctor_assigned=str(record["doctor_assigned"]) if record.get("doctor_assigned") else None,
            created_at=record["created_at"],
            symptoms=record["symptoms"],
            vitals=record["vitals"]
        )
        for record in history
    ]

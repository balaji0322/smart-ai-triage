from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class TriageRecord(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    patient_id: PyObjectId
    symptoms: Dict[str, Any]
    vitals: Dict[str, Any]
    risk_level: str
    ai_confidence: Optional[float] = None
    priority_score: Optional[int] = None
    recommendations: Optional[str] = None
    doctor_assigned: Optional[PyObjectId] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "patient_id": "507f1f77bcf86cd799439011",
                "symptoms": {"chest_pain": True, "shortness_of_breath": True},
                "vitals": {"heart_rate": 110, "blood_pressure": "160/95"},
                "risk_level": "high",
                "ai_confidence": 0.87,
                "priority_score": 8,
                "recommendations": "Immediate medical attention required",
                "status": "pending",
                "created_at": "2026-02-15T10:00:00"
            }
        }

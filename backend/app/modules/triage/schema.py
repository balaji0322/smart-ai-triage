from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime

class TriageRequest(BaseModel):
    symptoms: Dict[str, Any] = Field(..., description="Patient symptoms data")
    vitals: Dict[str, Any] = Field(..., description="Patient vital signs")

class TriageResponse(BaseModel):
    id: str
    risk_level: str
    priority_score: int
    ai_confidence: float
    recommendations: str
    primary_concerns: Optional[List[str]] = None
    reasoning: Optional[str] = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class TriageHistoryResponse(BaseModel):
    id: str
    risk_level: str
    priority_score: int
    status: str
    doctor_assigned: Optional[str] = None
    created_at: datetime
    symptoms: Dict[str, Any]
    vitals: Dict[str, Any]
    
    class Config:
        from_attributes = True

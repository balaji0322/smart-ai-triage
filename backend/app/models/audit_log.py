from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class AuditLog(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: Optional[PyObjectId] = None
    action: str
    details: Optional[str] = None
    ip_address: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "action": "USER_LOGIN",
                "details": "User logged in successfully",
                "ip_address": "192.168.1.1",
                "timestamp": "2026-02-15T10:00:00"
            }
        }

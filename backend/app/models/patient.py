from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId
from app.models.user import PyObjectId

class Patient(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    age: Optional[int] = None
    gender: Optional[str] = None
    medical_history: Optional[str] = None
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "age": 35,
                "gender": "male",
                "medical_history": "Hypertension, Type 2 Diabetes"
            }
        }

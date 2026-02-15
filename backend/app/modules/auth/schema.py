from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    role: str = Field(default="patient", pattern="^(patient|doctor|admin)$")
    age: Optional[int] = Field(None, ge=0, le=150)
    gender: Optional[str] = None
    medical_history: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "name": "John Doe",
                "email": "john@example.com",
                "role": "patient",
                "created_at": "2026-02-15T10:00:00"
            }
        }

class RefreshTokenRequest(BaseModel):
    refresh_token: str

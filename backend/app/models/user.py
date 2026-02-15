from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Any
from datetime import datetime
from enum import Enum
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler):
        from pydantic_core import core_schema
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ])
        ],
        serialization=core_schema.plain_serializer_function_ser_schema(
            lambda x: str(x)
        ))

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")

class UserRole(str, Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"
    ADMIN = "admin"

class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: EmailStr
    password_hash: str
    role: UserRole = UserRole.PATIENT
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "password_hash": "hashed_password",
                "role": "patient",
                "created_at": "2026-02-15T10:00:00"
            }
        }

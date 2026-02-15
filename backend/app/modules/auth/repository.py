from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from bson import ObjectId
from datetime import datetime

from app.models.user import User, UserRole
from app.models.patient import Patient

class AuthRepository:
    @staticmethod
    async def get_user_by_email(db: AsyncIOMotorDatabase, email: str) -> Optional[dict]:
        user = await db.users.find_one({"email": email})
        return user
    
    @staticmethod
    async def get_user_by_id(db: AsyncIOMotorDatabase, user_id: str) -> Optional[dict]:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        return user
    
    @staticmethod
    async def create_user(
        db: AsyncIOMotorDatabase,
        name: str,
        email: str,
        password_hash: str,
        role: str,
        age: Optional[int] = None,
        gender: Optional[str] = None,
        medical_history: Optional[str] = None
    ) -> dict:
        user_data = {
            "name": name,
            "email": email,
            "password_hash": password_hash,
            "role": role,
            "created_at": datetime.utcnow()
        }
        
        result = await db.users.insert_one(user_data)
        user_data["_id"] = result.inserted_id
        
        # Create patient profile if role is patient
        if role == "patient":
            patient_data = {
                "user_id": result.inserted_id,
                "age": age,
                "gender": gender,
                "medical_history": medical_history
            }
            await db.patients.insert_one(patient_data)
        
        return user_data

auth_repository = AuthRepository()

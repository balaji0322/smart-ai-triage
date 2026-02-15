from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status
from typing import Dict
from bson import ObjectId

from app.modules.auth.repository import auth_repository
from app.modules.auth.schema import UserRegister, UserLogin
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)

class AuthService:
    @staticmethod
    async def register_user(db: AsyncIOMotorDatabase, user_data: UserRegister) -> dict:
        existing_user = await auth_repository.get_user_by_email(db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        password_hash = get_password_hash(user_data.password)
        
        user = await auth_repository.create_user(
            db=db,
            name=user_data.name,
            email=user_data.email,
            password_hash=password_hash,
            role=user_data.role,
            age=user_data.age,
            gender=user_data.gender,
            medical_history=user_data.medical_history
        )
        
        return user
    
    @staticmethod
    async def authenticate_user(db: AsyncIOMotorDatabase, login_data: UserLogin) -> Dict[str, any]:
        user = await auth_repository.get_user_by_email(db, login_data.email)
        
        if not user or not verify_password(login_data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        user_id_str = str(user["_id"])
        access_token = create_access_token(data={"sub": user_id_str, "role": user["role"]})
        refresh_token = create_refresh_token(data={"sub": user_id_str})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user
        }
    
    @staticmethod
    async def refresh_access_token(db: AsyncIOMotorDatabase, refresh_token: str) -> Dict[str, str]:
        payload = decode_token(refresh_token)
        
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        user_id = payload.get("sub")
        user = await auth_repository.get_user_by_id(db, user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        access_token = create_access_token(data={"sub": user_id, "role": user["role"]})
        
        return {"access_token": access_token}

auth_service = AuthService()

from fastapi import APIRouter, Depends, Request
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_db
from app.modules.auth.schema import UserRegister, UserLogin, TokenResponse, RefreshTokenRequest, UserResponse
from app.modules.auth.service import auth_service
from app.services.audit_service import audit_service

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister, request: Request, db: AsyncIOMotorDatabase = Depends(get_db)):
    user = await auth_service.register_user(db, user_data)
    
    # Generate tokens directly (don't try to authenticate with plain password)
    from app.core.security import create_access_token, create_refresh_token
    
    user_id_str = str(user["_id"])
    access_token = create_access_token(data={"sub": user_id_str, "role": user["role"]})
    refresh_token = create_refresh_token(data={"sub": user_id_str})
    
    await audit_service.log_action(
        db=db,
        user_id=user_id_str,
        action="USER_REGISTERED",
        details=f"New {user['role']} account created",
        ip_address=request.client.host if request.client else None
    )
    
    # Convert user dict to UserResponse
    user_response = UserResponse(
        id=user_id_str,
        name=user["name"],
        email=user["email"],
        role=user["role"],
        created_at=user["created_at"]
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )

@router.post("/login", response_model=TokenResponse)
async def login(login_data: UserLogin, request: Request, db: AsyncIOMotorDatabase = Depends(get_db)):
    tokens = await auth_service.authenticate_user(db, login_data)
    
    await audit_service.log_action(
        db=db,
        user_id=str(tokens["user"]["_id"]),
        action="USER_LOGIN",
        details="User logged in successfully",
        ip_address=request.client.host if request.client else None
    )
    
    # Convert user dict to UserResponse
    user_response = UserResponse(
        id=str(tokens["user"]["_id"]),
        name=tokens["user"]["name"],
        email=tokens["user"]["email"],
        role=tokens["user"]["role"],
        created_at=tokens["user"]["created_at"]
    )
    
    return TokenResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        user=user_response
    )

@router.post("/refresh")
async def refresh_token(token_data: RefreshTokenRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    result = await auth_service.refresh_access_token(db, token_data.refresh_token)
    return result

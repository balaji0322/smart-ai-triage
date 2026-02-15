import logging
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from datetime import datetime
from bson import ObjectId

logger = logging.getLogger(__name__)

class AuditService:
    @staticmethod
    async def log_action(
        db: AsyncIOMotorDatabase,
        user_id: Optional[str],
        action: str,
        details: Optional[str] = None,
        ip_address: Optional[str] = None
    ):
        try:
            audit_log = {
                "user_id": ObjectId(user_id) if user_id else None,
                "action": action,
                "details": details,
                "ip_address": ip_address,
                "timestamp": datetime.utcnow()
            }
            await db.audit_logs.insert_one(audit_log)
            logger.info(f"Audit log created: {action} by user {user_id}")
        except Exception as e:
            logger.error(f"Failed to create audit log: {str(e)}")

audit_service = AuditService()

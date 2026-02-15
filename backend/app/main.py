from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import logging

from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.modules.auth.routes import router as auth_router
from app.modules.triage.routes import router as triage_router
from app.modules.doctor.routes import router as doctor_router
from app.modules.admin.routes import router as admin_router

logging.basicConfig(
    level=logging.INFO,
    format='{"time": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s"}'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Smart Patient Triage API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    logger.info("Application startup complete")

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()
    logger.info("Application shutdown complete")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info({
        "method": request.method,
        "path": request.url.path,
        "status": response.status_code,
        "duration": f"{process_time:.3f}s",
        "client": request.client.host if request.client else "unknown"
    })
    
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(triage_router, prefix="/api/v1/triage", tags=["Triage"])
app.include_router(doctor_router, prefix="/api/v1/doctor", tags=["Doctor"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0", "database": "MongoDB"}

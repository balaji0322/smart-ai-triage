# AI Smart Patient Triage - Backend

Production-ready FastAPI backend with Clean Architecture, RBAC, and healthcare-grade security.

## Architecture

- **Clean Architecture**: Separation of concerns with layers (routes → service → repository)
- **RBAC**: Role-Based Access Control (Patient, Doctor, Admin)
- **Security**: JWT authentication, bcrypt password hashing, input validation
- **AI Integration**: Abstracted Gemini AI service with retry logic and fallback
- **Audit Logging**: Healthcare-grade audit trail for all actions

## Tech Stack

- FastAPI
- PostgreSQL + SQLAlchemy
- Redis (caching)
- JWT Authentication
- Gemini AI
- Docker

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### 2. Docker Deployment (Recommended)

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on port 8000

### 3. Manual Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations (tables auto-created on startup)
# Start server
uvicorn app.main:app --reload --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app entry point
│   ├── core/
│   │   ├── config.py          # Settings & environment
│   │   ├── security.py        # JWT & password handling
│   │   └── database.py        # Database connection
│   ├── models/                # SQLAlchemy models
│   ├── modules/
│   │   ├── auth/              # Authentication module
│   │   ├── triage/            # Triage module
│   │   ├── doctor/            # Doctor module
│   │   └── admin/             # Admin module
│   ├── services/
│   │   ├── gemini_ai_service.py
│   │   └── audit_service.py
│   └── utils/
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## Security Features

- Bcrypt password hashing
- JWT access + refresh tokens
- Role-based middleware
- Input validation with Pydantic
- API rate limiting ready
- Audit logging for all actions
- No direct AI API exposure

## Testing

See `API_EXAMPLES.md` for request/response examples.

## Production Deployment

1. Set strong `SECRET_KEY` in environment
2. Use production database credentials
3. Enable HTTPS/TLS
4. Configure CORS for your frontend domain
5. Set up monitoring and logging
6. Use Gunicorn with multiple workers

# AI Smart Patient Triage - Project Analysis

## Project Overview

A full-stack healthcare triage application with AI-powered risk assessment, featuring a React frontend and FastAPI backend with clean architecture principles.

---

## ✅ Installation Status

### Frontend Dependencies (Installed ✓)
- **React**: 19.2.4
- **React DOM**: 19.2.4
- **TypeScript**: 5.8.3
- **Vite**: 6.4.1
- **Lucide React**: 0.564.0 (Icons)
- **Recharts**: 3.7.0 (Charts)
- **@google/genai**: 1.41.0 (AI Integration)
- **@vitejs/plugin-react**: 5.1.4
- **@types/node**: 22.19.11

### Backend Dependencies (Installed ✓)
- **FastAPI**: 0.115.0
- **Uvicorn**: 0.32.0 (ASGI server)
- **SQLAlchemy**: 2.0.36 (ORM)
- **Pydantic**: 2.10.3 (Validation)
- **Pydantic Settings**: 2.6.1
- **Python-Jose**: 3.3.0 (JWT)
- **Passlib**: 1.7.4 (Password hashing)
- **Bcrypt**: 4.3.0
- **Google Genai**: 1.41.0
- **Redis**: 5.2.0
- **Psycopg2-binary**: 2.9.10 (PostgreSQL)
- **Python-multipart**: 0.0.20

---

## 📁 Project Structure

```
smarttriage-ai/
│
├── frontend/                          # React Frontend
│   ├── components/                    # React Components
│   │   ├── AdminDashboard.tsx        # Admin analytics dashboard
│   │   ├── AnalysisResults.tsx       # Triage results display
│   │   ├── Dashboard.tsx             # Main dashboard
│   │   ├── DoctorList.tsx            # Doctor management
│   │   ├── HospitalSelector.tsx      # Hospital selection
│   │   ├── Login.tsx                 # Authentication UI
│   │   ├── PatientInput.tsx          # Patient data entry
│   │   ├── RiskBadge.tsx             # Risk level indicator
│   │   ├── VitalSignInput.tsx        # Vital signs form
│   │   └── VoiceAssistant.tsx        # Voice input feature
│   │
│   ├── services/
│   │   └── geminiService.ts          # AI service integration
│   │
│   ├── App.tsx                        # Main app component
│   ├── index.tsx                      # Entry point
│   ├── index.html                     # HTML template
│   ├── constants.ts                   # App constants
│   └── types.ts                       # TypeScript types
│
├── backend/                           # FastAPI Backend
│   ├── app/
│   │   ├── main.py                   # FastAPI app entry
│   │   │
│   │   ├── core/                     # Core functionality
│   │   │   ├── config.py            # Settings & env vars
│   │   │   ├── security.py          # JWT & auth
│   │   │   └── database.py          # DB connection
│   │   │
│   │   ├── models/                   # SQLAlchemy models
│   │   │   ├── user.py              # User model
│   │   │   ├── patient.py           # Patient model
│   │   │   ├── triage_record.py     # Triage records
│   │   │   └── audit_log.py         # Audit logging
│   │   │
│   │   ├── modules/                  # Feature modules
│   │   │   ├── auth/                # Authentication
│   │   │   │   ├── routes.py
│   │   │   │   ├── service.py
│   │   │   │   ├── repository.py
│   │   │   │   └── schema.py
│   │   │   │
│   │   │   ├── triage/              # Triage system
│   │   │   │   ├── routes.py
│   │   │   │   ├── service.py
│   │   │   │   ├── repository.py
│   │   │   │   └── schema.py
│   │   │   │
│   │   │   ├── doctor/              # Doctor features
│   │   │   │   └── routes.py
│   │   │   │
│   │   │   └── admin/               # Admin features
│   │   │       └── routes.py
│   │   │
│   │   ├── services/                 # Business services
│   │   │   ├── gemini_ai_service.py # AI integration
│   │   │   └── audit_service.py     # Audit logging
│   │   │
│   │   └── utils/                    # Utilities
│   │
│   ├── requirements.txt              # Python dependencies
│   ├── Dockerfile                    # Docker config
│   ├── docker-compose.yml            # Multi-container setup
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Env template
│   ├── start.py                      # Server startup script
│   └── README.md                     # Backend docs
│
├── start.bat                          # Windows startup
├── start.ps1                          # PowerShell startup
├── start.sh                           # Linux/Mac startup
├── start.js                           # Node.js startup (CommonJS)
├── start.mjs                          # Node.js startup (ES modules)
│
├── package.json                       # Frontend dependencies
├── vite.config.ts                     # Vite configuration
├── tsconfig.json                      # TypeScript config
├── .env.local                         # Frontend env vars
├── .gitignore                         # Git ignore rules
└── README.md                          # Main documentation
```

---

## 🏗️ Architecture

### Backend Architecture (Clean Architecture)

```
┌─────────────────────────────────────────┐
│         API Layer (Routes)              │
│  - Authentication endpoints             │
│  - Triage endpoints                     │
│  - Doctor endpoints                     │
│  - Admin endpoints                      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Service Layer (Business Logic)     │
│  - AuthService                          │
│  - TriageService                        │
│  - GeminiAIService                      │
│  - AuditService                         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    Repository Layer (Data Access)       │
│  - AuthRepository                       │
│  - TriageRepository                     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Database Layer (SQLAlchemy)        │
│  - Users                                │
│  - Patients                             │
│  - TriageRecords                        │
│  - AuditLogs                            │
└─────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│         Components (UI Layer)           │
│  - Login, Dashboard, PatientInput       │
│  - AdminDashboard, DoctorList           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Services (API Integration)         │
│  - geminiService.ts                     │
│  - (Backend API calls)                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Backend API                     │
│  - REST endpoints                       │
└─────────────────────────────────────────┘
```

---

## 🔐 Security Features

### Authentication & Authorization
- ✅ JWT access tokens (30 min expiry)
- ✅ JWT refresh tokens (7 day expiry)
- ✅ Bcrypt password hashing
- ✅ Role-based access control (RBAC)
  - Patient role
  - Doctor role
  - Admin role

### Data Protection
- ✅ Input validation with Pydantic
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ CORS configuration
- ✅ Audit logging for all actions
- ✅ Sensitive field protection

### API Security
- ✅ Bearer token authentication
- ✅ Request logging
- ✅ Error handling middleware
- ✅ Rate limiting ready (configurable)

---

## 🤖 AI Integration

### Gemini AI Service
- **Purpose**: Analyze patient symptoms and vitals
- **Features**:
  - Structured medical prompts
  - JSON response validation
  - Retry logic (3 attempts)
  - Fallback responses
  - Confidence scoring

### AI Workflow
```
Patient Input → Backend API → AI Service Layer → Gemini API
                                    ↓
                            Validate Response
                                    ↓
                            Store in Database
                                    ↓
                            Return to Frontend
```

---

## 📊 Database Schema

### Users Table
- id (PK)
- name
- email (unique)
- password_hash
- role (patient/doctor/admin)
- created_at

### Patients Table
- id (PK)
- user_id (FK → Users)
- age
- gender
- medical_history

### Triage Records Table
- id (PK)
- patient_id (FK → Patients)
- symptoms (JSON)
- vitals (JSON)
- risk_level
- ai_confidence
- priority_score
- recommendations
- doctor_assigned (FK → Users)
- status
- created_at

### Audit Logs Table
- id (PK)
- user_id (FK → Users)
- action
- details
- ip_address
- timestamp

---

## 🚀 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /refresh` - Refresh access token

### Triage (`/api/v1/triage`)
- `POST /analyze` - Analyze patient (Patient only)
- `GET /history/{patient_id}` - Get triage history

### Doctor (`/api/v1/doctor`)
- `GET /pending-cases` - Get pending triage cases (Doctor only)
- `PATCH /update-status/{triage_id}` - Update case status (Doctor only)

### Admin (`/api/v1/admin`)
- `GET /analytics` - System analytics (Admin only)
- `GET /system-logs` - Audit logs (Admin only)

### Health
- `GET /health` - Health check endpoint

---

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=sqlite:///./triage.db
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-api-key
ALLOWED_ORIGINS=["http://localhost:3000"]
```

**Frontend (.env.local)**
```env
GEMINI_API_KEY=your-api-key
```

---

## 🎯 Key Features

### For Patients
- ✅ Register and login
- ✅ Submit symptoms and vitals
- ✅ Receive AI-powered triage assessment
- ✅ View triage history
- ✅ Voice input support

### For Doctors
- ✅ View pending triage cases
- ✅ Cases sorted by priority
- ✅ Update case status
- ✅ Assign cases to self

### For Admins
- ✅ System analytics dashboard
- ✅ Risk distribution charts
- ✅ View audit logs
- ✅ Monitor system activity

---

## 🧪 Testing

### API Documentation
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

### Test Workflow
1. Register a patient account
2. Login to get JWT token
3. Submit triage analysis
4. View results and history

---

## 🐳 Deployment Options

### Option 1: Docker (Production)
```bash
cd backend
docker-compose up -d
```

### Option 2: Manual (Development)
```bash
# Terminal 1 - Backend
cd backend
python start.py

# Terminal 2 - Frontend
npm run dev
```

### Option 3: Single Command
```bash
# Windows
start.bat

# Linux/Mac
./start.sh

# Node.js
node start.mjs
```

---

## 📈 Performance Considerations

### Backend
- Connection pooling (10 connections, 20 max overflow)
- Async/await support
- Structured logging (JSON format)
- Health check endpoint

### Frontend
- Vite for fast builds
- Code splitting ready
- TypeScript for type safety
- Modern React 19 features

---

## 🔄 Future Enhancements

### Planned Features
- [ ] Redis caching for analytics
- [ ] Background task processing (Celery)
- [ ] Email notifications
- [ ] SMS alerts for critical cases
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time updates (WebSockets)
- [ ] Advanced analytics dashboard
- [ ] Machine learning model training
- [ ] HIPAA compliance features

### Scalability
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Load balancing
- [ ] Database replication
- [ ] CDN integration
- [ ] Monitoring (Prometheus/Grafana)

---

## 📝 Development Guidelines

### Code Style
- Backend: PEP 8 (Python)
- Frontend: ESLint + Prettier
- Type safety: TypeScript + Pydantic

### Git Workflow
- Feature branches
- Pull request reviews
- Semantic versioning

### Testing Strategy
- Unit tests (pytest for backend)
- Integration tests
- E2E tests (Playwright/Cypress)
- API tests (Postman/Thunder Client)

---

## 🆘 Troubleshooting

### Common Issues

**Backend won't start**
- Check Python version (3.11+)
- Verify all dependencies installed
- Check .env file exists
- Ensure port 8000 is free

**Frontend won't start**
- Check Node.js version (16+)
- Run `npm install`
- Verify port 3000 is free
- Check vite.config.ts

**Database errors**
- SQLite file permissions
- Check DATABASE_URL in .env
- Tables auto-create on first run

**AI service errors**
- Verify GEMINI_API_KEY is set
- Check API quota/limits
- Review fallback responses

---

## 📞 Support

For issues, questions, or contributions:
- Check documentation
- Review API examples
- Open GitHub issue
- Contact development team

---

## 📄 License

MIT License - See LICENSE file for details

---

**Last Updated**: February 15, 2026
**Version**: 1.0.0
**Status**: ✅ All dependencies installed and ready to run

# 🏗️ AI Smart Patient Triage - System Architecture

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│                   Browser (http://localhost:3000)               │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │    Login     │  │    Admin     │  │  Ambulance   │        │
│  │ Registration │  │  Dashboard   │  │   Portal     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP REST API
                         │ (CORS Enabled)
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    FRONTEND LAYER                               │
│                React 19 + TypeScript + Vite                     │
│                    Port: 3000                                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Components:                                              │ │
│  │  - Login.tsx (Auth UI)                                    │ │
│  │  - AdminDashboard.tsx (Hospital View)                     │ │
│  │  - PatientInput.tsx (Patient Form)                        │ │
│  │  - AnalysisResults.tsx (Triage Display)                   │ │
│  │  - HospitalSelector.tsx (Hospital Picker)                 │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Services:                                                │ │
│  │  - apiService.ts (Backend API Client)                     │ │
│  │  - geminiService.ts (AI Service)                          │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ API Calls
                         │ Authorization: Bearer <JWT>
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    BACKEND LAYER                                │
│                FastAPI + Python 3.12                            │
│                    Port: 8000                                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  API Routes (/api/v1):                                    │ │
│  │  - /auth/register, /auth/login, /auth/refresh            │ │
│  │  - /triage/analyze, /triage/history/{id}                 │ │
│  │  - /doctor/pending-cases, /doctor/update-status          │ │
│  │  - /admin/analytics, /admin/system-logs                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Middleware:                                              │ │
│  │  - CORS (Cross-Origin Resource Sharing)                  │ │
│  │  - JWT Authentication                                     │ │
│  │  - Request Logging                                        │ │
│  │  - Error Handling                                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Services:                                                │ │
│  │  - auth_service.py (Authentication Logic)                │ │
│  │  - gemini_ai_service.py (AI Integration)                 │ │
│  │  - audit_service.py (Audit Logging)                      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Security:                                                │ │
│  │  - JWT Access Tokens (30 min)                            │ │
│  │  - JWT Refresh Tokens (7 days)                           │ │
│  │  - Password Hashing (bcrypt)                             │ │
│  │  - Role-Based Access Control                             │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Motor (Async MongoDB Driver)
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    DATABASE LAYER                               │
│                    MongoDB 7.0+                                 │
│                    Port: 27017                                  │
│                                                                 │
│  Database: smartaitriage                                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Collections:                                             │ │
│  │                                                           │ │
│  │  📁 users                                                 │ │
│  │     - _id, name, email, password_hash, role              │ │
│  │     - age, gender, created_at                            │ │
│  │     - Index: email (unique)                              │ │
│  │                                                           │ │
│  │  📁 patients                                              │ │
│  │     - _id, user_id, age, gender                          │ │
│  │     - medical_history, created_at                        │ │
│  │     - Index: user_id                                     │ │
│  │                                                           │ │
│  │  📁 triage_records                                        │ │
│  │     - _id, patient_id, symptoms, vitals                  │ │
│  │     - risk_level, priority_score, ai_confidence          │ │
│  │     - recommendations, doctor_assigned                   │ │
│  │     - created_at, updated_at                             │ │
│  │     - Indexes: patient_id, created_at, risk_level        │ │
│  │                                                           │ │
│  │  📁 audit_logs                                            │ │
│  │     - _id, user_id, action, details                      │ │
│  │     - ip_address, timestamp                              │ │
│  │     - Indexes: user_id, timestamp                        │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Registration Flow

```
User (Browser)
    │
    │ 1. Fill registration form
    │    (name, email, password, role)
    ▼
Frontend (Login.tsx)
    │
    │ 2. POST /api/v1/auth/register
    │    Body: {name, email, password, role}
    ▼
Backend (auth/routes.py)
    │
    │ 3. Validate input (Pydantic)
    ▼
Auth Service (auth/service.py)
    │
    │ 4. Check if email exists
    │ 5. Hash password (bcrypt)
    ▼
Auth Repository (auth/repository.py)
    │
    │ 6. Insert user document
    ▼
MongoDB (users collection)
    │
    │ 7. User created
    ▼
Auth Service
    │
    │ 8. Generate JWT tokens
    │    - Access token (30 min)
    │    - Refresh token (7 days)
    ▼
Audit Service
    │
    │ 9. Log action: USER_REGISTERED
    ▼
Backend Response
    │
    │ 10. Return: {access_token, refresh_token, user}
    ▼
Frontend
    │
    │ 11. Store token in localStorage
    │ 12. Redirect to dashboard
    ▼
User sees Dashboard
```

### 2. User Login Flow

```
User (Browser)
    │
    │ 1. Enter email & password
    ▼
Frontend (Login.tsx)
    │
    │ 2. POST /api/v1/auth/login
    │    Body: {email, password}
    ▼
Backend (auth/routes.py)
    │
    │ 3. Validate input
    ▼
Auth Service
    │
    │ 4. Find user by email
    │ 5. Verify password (bcrypt)
    ▼
MongoDB (users collection)
    │
    │ 6. User found
    ▼
Auth Service
    │
    │ 7. Generate JWT tokens
    ▼
Audit Service
    │
    │ 8. Log action: USER_LOGIN
    ▼
Backend Response
    │
    │ 9. Return: {access_token, refresh_token, user}
    ▼
Frontend
    │
    │ 10. Store token
    │ 11. Redirect to dashboard
    ▼
User sees Dashboard
```

### 3. Triage Analysis Flow

```
Ambulance User
    │
    │ 1. Enter patient data
    │    (symptoms, vitals)
    ▼
Frontend (PatientInput.tsx)
    │
    │ 2. POST /api/v1/triage/analyze
    │    Headers: Authorization: Bearer <token>
    │    Body: {symptoms, vitals}
    ▼
Backend (triage/routes.py)
    │
    │ 3. Verify JWT token
    │ 4. Extract user info
    ▼
Triage Service
    │
    │ 5. Validate input
    │ 6. Call AI service
    ▼
Gemini AI Service
    │
    │ 7. Build medical prompt
    │ 8. Call Gemini API
    │ 9. Parse AI response
    ▼
Triage Service
    │
    │ 10. Calculate risk level
    │ 11. Determine priority
    ▼
Triage Repository
    │
    │ 12. Save triage record
    ▼
MongoDB (triage_records)
    │
    │ 13. Record saved
    ▼
Backend Response
    │
    │ 14. Return: {risk_level, priority, recommendations}
    ▼
Frontend (AnalysisResults.tsx)
    │
    │ 15. Display results
    │ 16. Show hospital selector
    ▼
User selects hospital
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                            │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Network Security
├── CORS Protection
│   ├── Allowed Origins: localhost:3000, 3001, 5173
│   ├── Credentials: Enabled
│   └── Methods: GET, POST, PUT, PATCH, DELETE
│
└── HTTPS (Production)
    └── TLS 1.3

Layer 2: Authentication
├── JWT Tokens
│   ├── Access Token (30 min expiry)
│   ├── Refresh Token (7 day expiry)
│   └── HS256 Algorithm
│
└── Password Security
    ├── bcrypt hashing
    ├── Salt rounds: 12
    └── Min length: 8 characters

Layer 3: Authorization
├── Role-Based Access Control (RBAC)
│   ├── Patient: Basic access
│   ├── Doctor: Medical operations
│   └── Admin: Full access
│
└── Endpoint Protection
    └── @require_role decorator

Layer 4: Input Validation
├── Pydantic Models
│   ├── Type checking
│   ├── Field validation
│   └── Data sanitization
│
└── MongoDB Injection Prevention
    └── Parameterized queries

Layer 5: Audit & Monitoring
├── Audit Logs
│   ├── User actions
│   ├── IP addresses
│   └── Timestamps
│
└── Request Logging
    ├── Method, path, status
    ├── Duration
    └── Client IP
```

## Deployment Architecture

### Development (Current)

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT ENVIRONMENT                      │
└─────────────────────────────────────────────────────────────────┘

Windows Machine (localhost)
│
├── MongoDB (Windows Service)
│   └── Port: 27017
│
├── Backend (Python/Uvicorn)
│   ├── Port: 8000
│   ├── Auto-reload: Enabled
│   └── Debug: Enabled
│
└── Frontend (Vite Dev Server)
    ├── Port: 3000
    ├── Hot Reload: Enabled
    └── Source Maps: Enabled

Startup: start.bat (One Command)
```

### Production (Recommended)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION ENVIRONMENT                       │
└─────────────────────────────────────────────────────────────────┘

Cloud Infrastructure (AWS/Azure/GCP)
│
├── Load Balancer (HTTPS)
│   └── SSL/TLS Termination
│
├── Frontend (Static Hosting)
│   ├── CDN (CloudFront/Azure CDN)
│   ├── Nginx
│   └── Gzip Compression
│
├── Backend (Container)
│   ├── Docker + Gunicorn + Uvicorn
│   ├── Multiple Workers
│   ├── Health Checks
│   └── Auto-scaling
│
├── MongoDB (Managed Service)
│   ├── MongoDB Atlas
│   ├── Replica Set
│   ├── Automated Backups
│   └── Authentication Enabled
│
└── Monitoring
    ├── Prometheus
    ├── Grafana
    └── ELK Stack
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                           │
└─────────────────────────────────────────────────────────────────┘

Frontend
├── React 19.0.0
├── TypeScript 5.7.3
├── Vite 6.4.1
├── Tailwind CSS 3.4.17
├── Lucide React (Icons)
└── Fetch API (HTTP Client)

Backend
├── FastAPI 0.115.12
├── Python 3.12+
├── Motor 3.7.0 (Async MongoDB)
├── PyMongo 4.11.0
├── Pydantic 2.10.6
├── Passlib (bcrypt)
├── PyJWT 2.10.1
└── Uvicorn 0.34.0

Database
├── MongoDB 7.0+
├── Motor (Async Driver)
└── Indexes for Performance

AI/ML
├── Google Gemini API
└── Custom Prompt Engineering

DevOps
├── Docker
├── Docker Compose
└── Windows Batch Scripts

Development Tools
├── Git
├── VS Code
├── MongoDB Compass
└── Postman/Thunder Client
```

## File Structure

```
smarttriage-ai/
│
├── 🚀 Startup Scripts
│   ├── start.bat              # Start all services
│   ├── stop.bat               # Stop all services
│   └── status.bat             # Check status
│
├── 📖 Documentation
│   ├── STARTUP_GUIDE.md
│   ├── ONE_COMMAND_STARTUP.md
│   ├── COMPLETE_SETUP_SUMMARY.md
│   ├── SYSTEM_ARCHITECTURE.md (this file)
│   └── FRONTEND_BACKEND_FIXED.md
│
├── 🎨 Frontend
│   ├── components/
│   │   ├── Login.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── PatientInput.tsx
│   │   ├── AnalysisResults.tsx
│   │   └── ...
│   ├── services/
│   │   ├── apiService.ts
│   │   └── geminiService.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── types.ts
│
├── 🔧 Backend
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── patient.py
│   │   │   ├── triage_record.py
│   │   │   └── audit_log.py
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── triage/
│   │   │   ├── doctor/
│   │   │   └── admin/
│   │   └── services/
│   │       ├── gemini_ai_service.py
│   │       └── audit_service.py
│   ├── .env
│   ├── start.py
│   └── requirements.txt
│
└── 📦 Configuration
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── tailwind.config.js
```

## Performance Considerations

### Database Optimization
- ✅ Indexes on frequently queried fields
- ✅ Async operations with Motor
- ✅ Connection pooling
- ✅ Query optimization

### Backend Optimization
- ✅ Async/await throughout
- ✅ Pydantic for fast validation
- ✅ JWT for stateless auth
- ✅ Response caching (future)

### Frontend Optimization
- ✅ Code splitting (Vite)
- ✅ Lazy loading components
- ✅ Optimized bundle size
- ✅ Hot module replacement

## Scalability

### Horizontal Scaling
- Backend: Multiple Uvicorn workers
- Frontend: CDN distribution
- Database: MongoDB replica sets

### Vertical Scaling
- Increase server resources
- Optimize queries
- Add caching layer (Redis)

### Load Balancing
- Nginx reverse proxy
- Round-robin distribution
- Health check endpoints

---

**Architecture Status**: ✅ PRODUCTION READY
**Last Updated**: February 15, 2026
**Version**: 1.0.0

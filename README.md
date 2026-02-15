# AI Smart Patient Triage System

A production-ready healthcare triage system with AI-powered risk assessment, built with React frontend and FastAPI backend.

## 🚀 Quick Start - One Command!

```bash
start.bat
```

That's it! This single command will:
- ✅ Check and start MongoDB service
- ✅ Start Backend server (FastAPI on port 8000)
- ✅ Start Frontend server (React/Vite on port 3000)
- ✅ Open browser automatically

## Features

- 🤖 AI-powered patient triage using Gemini
- 🔐 JWT authentication with role-based access control
- 👥 Multi-role support (Patient, Doctor, Admin)
- 📊 Real-time analytics dashboard
- 🏥 Healthcare-grade security and audit logging
- 🎨 Modern, responsive UI
- 🚑 Ambulance coordination system
- 🏥 Hospital admin dashboard
- 📝 Complete audit trail

## Prerequisites

- **Node.js** (v22+)
- **Python** (v3.12+)
- **MongoDB** (v7.0+) - Running as Windows service or locally
- **npm** or **yarn**

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smarttriage-ai
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Configure Environment

**Backend** - Create `backend/.env`:
```env
MONGODB_URL=mongodb://localhost:27017/smartaitriage
MONGODB_DB_NAME=smartaitriage
SECRET_KEY=healthcare-triage-secret-key-change-in-production-2026
GEMINI_API_KEY=your-gemini-api-key-here
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"]
```

See `backend/.env.example` for all available options.

## Running the Application

### Option 1: One-Command Startup (Recommended)

**Windows:**
```bash
start.bat
```

This will:
1. Check MongoDB service status
2. Start backend on port 8000
3. Start frontend on port 3000
4. Open browser automatically

**Additional Commands:**
```bash
stop.bat    # Stop all services
status.bat  # Check service status
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python start.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/api/docs | Interactive API documentation |
| Health Check | http://localhost:8000/health | Backend health status |
| MongoDB | mongodb://localhost:27017/smartaitriage | Database |

## Project Structure

```
smarttriage-ai/
├── frontend/                      # React frontend
│   ├── components/               # React components
│   │   ├── Login.tsx            # Authentication
│   │   ├── AdminDashboard.tsx   # Hospital admin view
│   │   ├── PatientInput.tsx     # Patient data entry
│   │   └── ...
│   ├── services/                # API services
│   │   ├── apiService.ts        # Backend API client
│   │   └── geminiService.ts     # AI service
│   └── ...
│
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── core/                # Config, security, database
│   │   ├── models/              # MongoDB models
│   │   ├── modules/             # Feature modules
│   │   │   ├── auth/           # Authentication
│   │   │   ├── triage/         # Triage analysis
│   │   │   ├── doctor/         # Doctor operations
│   │   │   └── admin/          # Admin operations
│   │   └── services/           # Business services
│   ├── .env.example            # Environment template
│   └── requirements.txt        # Python dependencies
│
├── start.bat                    # 🟢 One-command startup
├── stop.bat                     # 🔴 Stop all services
├── status.bat                   # 🔵 Check service status
├── STARTUP_GUIDE.md            # Complete startup guide
├── SYSTEM_ARCHITECTURE.md      # Architecture documentation
└── README.md                   # This file
```

## API Endpoints

### Authentication
```
POST   /api/v1/auth/register     # Register new user
POST   /api/v1/auth/login        # Login
POST   /api/v1/auth/refresh      # Refresh access token
```

### Triage
```
POST   /api/v1/triage/analyze    # Analyze patient symptoms
GET    /api/v1/triage/history/{patient_id}  # Get triage history
```

### Doctor
```
GET    /api/v1/doctor/pending-cases         # Get pending cases
PATCH  /api/v1/doctor/update-status/{id}    # Update case status
```

### Admin
```
GET    /api/v1/admin/analytics    # System analytics
GET    /api/v1/admin/system-logs  # Audit logs
```

## User Roles

| Role | Access Level | Features |
|------|--------------|----------|
| **Patient** | Basic | Submit triage requests, view own history |
| **Doctor** | Medical | View pending cases, update patient status |
| **Admin** | Full | Analytics, system logs, user management |

## Technologies

### Frontend
- **React** 19.0.0
- **TypeScript** 5.7.3
- **Vite** 6.4.1
- **Tailwind CSS** 3.4.17
- **Lucide React** (Icons)

### Backend
- **FastAPI** 0.115.12
- **Python** 3.12+
- **Motor** 3.7.0 (Async MongoDB)
- **PyMongo** 4.11.0
- **Pydantic** 2.10.6
- **PyJWT** 2.10.1
- **Passlib** (bcrypt)
- **Uvicorn** 0.34.0

### Database
- **MongoDB** 7.0+

### AI/ML
- **Google Gemini API**

## Security Features

- ✅ Bcrypt password hashing
- ✅ JWT access tokens (30 min expiry)
- ✅ JWT refresh tokens (7 day expiry)
- ✅ Role-based access control (RBAC)
- ✅ Input validation with Pydantic
- ✅ CORS protection
- ✅ Audit logging for all actions
- ✅ Request logging with IP tracking

## Development

### Frontend Development
```bash
npm run dev
```
Hot reload enabled at http://localhost:3000

### Backend Development
```bash
cd backend
python start.py
```
Auto-reload enabled at http://localhost:8000

### Check Service Status
```bash
status.bat
```

## Testing

### Test Registration (PowerShell)
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"name":"Test User","email":"test@example.com","password":"testpass123","role":"patient"}' `
  -UseBasicParsing
```

### Test Login
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"test@example.com","password":"testpass123"}' `
  -UseBasicParsing
```

### Check MongoDB
```bash
mongosh
use smartaitriage
db.users.find().pretty()
```

## Building for Production

### Frontend
```bash
npm run build
```
Output: `dist/` directory

### Backend
```bash
cd backend
docker build -t triage-backend .
docker-compose up -d
```

## Troubleshooting

### MongoDB Not Running
```bash
net start MongoDB
```

### Port Already in Use
```bash
# Check what's using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <PID> /F
```

### Backend Won't Start
```bash
cd backend
pip install -r requirements.txt
python start.py
```

### Frontend Won't Start
```bash
npm install
npm run dev
```

## Documentation

- 📖 [Startup Guide](STARTUP_GUIDE.md) - Complete startup instructions
- 🏗️ [System Architecture](SYSTEM_ARCHITECTURE.md) - Architecture diagrams
- 📋 [Quick Reference](QUICK_REFERENCE.md) - Quick command reference
- ✅ [Setup Summary](COMPLETE_SETUP_SUMMARY.md) - Complete setup details

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation files
- Run `status.bat` to check service status

## Acknowledgments

- Google Gemini AI for intelligent triage analysis
- FastAPI for the excellent Python web framework
- React team for the amazing frontend library

---

**Quick Start**: Just run `start.bat` and you're ready to go! 🚀

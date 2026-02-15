# AI Smart Patient Triage System

A production-ready healthcare triage system with AI-powered risk assessment, built with React frontend and FastAPI backend.

## Features

- 🤖 AI-powered patient triage using Gemini
- 🔐 JWT authentication with role-based access control
- 👥 Multi-role support (Patient, Doctor, Admin)
- 📊 Real-time analytics dashboard
- 🏥 Healthcare-grade security and audit logging
- 🎨 Modern, responsive UI

## Quick Start

### Prerequisites

- Node.js (v16+)
- Python (v3.11+)
- npm or yarn

### Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### Running the Application

#### Option 1: Single Command (Recommended)

**Windows (Command Prompt):**
```bash
start.bat
```

**Windows (PowerShell):**
```powershell
.\start.ps1
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Using Node.js (Cross-platform):**
```bash
node start.js
```

#### Option 2: Manual Start

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

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/api/docs
- **Health Check:** http://localhost:8000/health

## Default Test Accounts

Create accounts through the registration page or use the API.

### API Endpoints

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/triage/analyze` - Analyze patient symptoms
- `GET /api/v1/doctor/pending-cases` - Get pending triage cases (Doctor only)
- `GET /api/v1/admin/analytics` - System analytics (Admin only)

## Project Structure

```
smarttriage-ai/
├── frontend/              # React frontend
│   ├── components/       # React components
│   ├── services/         # API services
│   └── ...
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── core/        # Config, security, database
│   │   ├── models/      # Database models
│   │   ├── modules/     # Feature modules
│   │   └── services/    # Business services
│   └── ...
├── start.bat            # Windows batch startup
├── start.ps1            # PowerShell startup
├── start.sh             # Linux/Mac startup
└── start.js             # Node.js startup
```

## Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=triage_db
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
ALLOWED_ORIGINS=["http://localhost:3000"]
```

### Frontend Environment Variables

Create `.env.local`:

```env
GEMINI_API_KEY=your-gemini-api-key
```

## Development

### Frontend Development
```bash
npm run dev
```

### Backend Development
```bash
cd backend
python start.py
```

### Building for Production

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
cd backend
docker build -t triage-backend .
```

## Docker Deployment

```bash
cd backend
docker-compose up -d
```

## Technologies

### Frontend
- React 19
- TypeScript
- Vite
- Recharts
- Lucide Icons

### Backend
- FastAPI
- Motor (async MongoDB)
- PyMongo
- JWT Authentication
- Google Gemini AI
- Redis (optional)

## Security

- Bcrypt password hashing
- JWT access + refresh tokens
- Role-based access control
- Input validation
- Audit logging
- CORS protection

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

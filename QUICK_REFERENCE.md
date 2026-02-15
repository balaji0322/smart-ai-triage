# 🚀 Quick Reference Card

## One-Command Startup

```bash
start.bat
```

**That's it!** Everything starts automatically.

## Essential Commands

| Command | Purpose |
|---------|---------|
| `start.bat` | Start all services (MongoDB + Backend + Frontend) |
| `stop.bat` | Stop all services |
| `status.bat` | Check service status |

## Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/api/docs |
| MongoDB | mongodb://localhost:27017/smartaitriage |

## API Endpoints

### Authentication
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

### Triage
```
POST /api/v1/triage/analyze
GET  /api/v1/triage/history/{patient_id}
```

### Doctor
```
GET   /api/v1/doctor/pending-cases
PATCH /api/v1/doctor/update-status/{triage_id}
```

### Admin
```
GET /api/v1/admin/analytics
GET /api/v1/admin/system-logs
```

## Quick Tests

### Test Registration (PowerShell)
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"name":"Test","email":"test@test.com","password":"test1234","role":"patient"}' `
  -UseBasicParsing
```

### Check MongoDB
```bash
mongosh
use smartaitriage
db.users.find()
```

### Check Backend Health
```bash
curl http://localhost:8000/health
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8000 in use | `netstat -ano \| findstr :8000` then `taskkill /PID <PID> /F` |
| Port 3000 in use | `netstat -ano \| findstr :3000` then `taskkill /PID <PID> /F` |
| MongoDB not running | `net start MongoDB` |
| Backend won't start | `cd backend && pip install -r requirements.txt` |
| Frontend won't start | `npm install` |

## File Locations

| File | Location |
|------|----------|
| Backend config | `backend/.env` |
| API service | `frontend/services/apiService.ts` |
| Login component | `frontend/components/Login.tsx` |
| Main app | `frontend/App.tsx` |

## Environment Variables

### backend/.env
```env
MONGODB_URL=mongodb://localhost:27017/smartaitriage
MONGODB_DB_NAME=smartaitriage
SECRET_KEY=healthcare-triage-secret-key-change-in-production-2026
GEMINI_API_KEY=your-api-key-here
```

## User Roles

| Role | Access Level |
|------|--------------|
| patient | Basic access, can submit triage |
| doctor | Medical operations, view cases |
| admin | Full access, analytics, logs |

## Default Ports

| Service | Port |
|---------|------|
| Frontend | 3000 |
| Backend | 8000 |
| MongoDB | 27017 |

## MongoDB Collections

- `users` - User accounts
- `patients` - Patient records
- `triage_records` - Triage analysis results
- `audit_logs` - System audit trail

## JWT Tokens

- Access Token: 30 minutes
- Refresh Token: 7 days
- Algorithm: HS256

## Quick Start Checklist

- [ ] MongoDB service running
- [ ] Run `start.bat`
- [ ] Wait for browser to open
- [ ] Register new account
- [ ] Login and test

## Documentation

- `STARTUP_GUIDE.md` - Complete guide
- `ONE_COMMAND_STARTUP.md` - Startup details
- `SYSTEM_ARCHITECTURE.md` - Architecture
- `COMPLETE_SETUP_SUMMARY.md` - Full summary
- `QUICK_REFERENCE.md` - This file

---

**Need Help?** Run `status.bat` to check what's running.

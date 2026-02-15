# API Request & Response Examples

## Authentication

### Register User (Patient)
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "patient",
  "age": 35,
  "gender": "male",
  "medical_history": "Hypertension, Type 2 Diabetes"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "created_at": "2026-02-15T10:30:00"
  }
}
```

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Refresh Token
```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Triage

### Analyze Patient
```bash
POST /api/v1/triage/analyze
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "symptoms": {
    "chest_pain": true,
    "shortness_of_breath": true,
    "duration_hours": 2,
    "severity": "severe"
  },
  "vitals": {
    "heart_rate": 110,
    "blood_pressure": "160/95",
    "temperature": 37.2,
    "oxygen_saturation": 94
  }
}
```

Response:
```json
{
  "id": 1,
  "risk_level": "high",
  "priority_score": 8,
  "ai_confidence": 0.87,
  "recommendations": "Immediate medical attention required. Possible cardiac event. Recommend ECG and cardiac enzyme tests.",
  "primary_concerns": [
    "Chest pain with elevated heart rate",
    "Reduced oxygen saturation"
  ],
  "reasoning": "Combination of chest pain, elevated heart rate, and reduced oxygen saturation suggests potential cardiac emergency",
  "status": "pending",
  "created_at": "2026-02-15T10:35:00"
}
```

### Get Triage History
```bash
GET /api/v1/triage/history/1
Authorization: Bearer <access_token>
```

## Doctor Endpoints

### Get Pending Cases
```bash
GET /api/v1/doctor/pending-cases
Authorization: Bearer <doctor_access_token>
```

Response:
```json
[
  {
    "id": 1,
    "patient_id": 1,
    "risk_level": "high",
    "priority_score": 8,
    "status": "pending",
    "created_at": "2026-02-15T10:35:00"
  }
]
```

### Update Triage Status
```bash
PATCH /api/v1/doctor/update-status/1?status=in_progress
Authorization: Bearer <doctor_access_token>
```

## Admin Endpoints

### Get Analytics
```bash
GET /api/v1/admin/analytics
Authorization: Bearer <admin_access_token>
```

Response:
```json
{
  "total_triages": 150,
  "risk_distribution": {
    "critical": 5,
    "high": 20,
    "moderate": 75,
    "low": 50
  },
  "recent_triages_24h": 12
}
```

### Get System Logs
```bash
GET /api/v1/admin/system-logs?limit=50
Authorization: Bearer <admin_access_token>
```

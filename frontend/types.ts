export interface Vitals {
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  spo2: number;
  respiratoryRate: number;
}

export interface PatientData {
  id: string;
  name: string; // Added patient name
  age: number | '';
  gender: 'Male' | 'Female' | 'Other' | '';
  arrivalTime: string;
  vitals: Vitals;
  symptoms: string;
  conditions: string[];
  files: File[];
  manualRiskLevel?: string;
}

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ContributingFactor {
  factor: string;
  influence: number; // 0-1
}

export interface DepartmentRecommendation {
  primary: string;
  secondary?: string;
  reasoning: string;
  actionTimeline: string;
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  confidence: number; // 0-100
  priority: string; // e.g., P1, P2
  department: DepartmentRecommendation;
  contributingFactors: ContributingFactor[];
  clinicalReasoning: string[];
  probabilities: {
    high: number;
    medium: number;
    low: number;
  };
  recommendedActions: string[];
  timestamp: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  status: 'Available' | 'Busy' | 'Offline';
  image?: string;
}

export interface Ambulance {
  id: string;
  unitNumber: string;
  status: 'IDLE' | 'DISPATCHED' | 'ON_SCENE' | 'TRANSPORTING' | 'RETURNING';
  driverName: string;
  currentLocation: string;
  coordinates: { x: number; y: number }; // Simulated GPS coordinates (0-100%)
  eta?: string;
  patientId?: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number }; // simple lat/lng
  capabilities: string[]; // e.g., 'Trauma Level 1', 'Stroke Center'
  specialties: string[]; // e.g., 'Cardiology', 'Neurology'
  occupancy: number; // percentage
  distance?: number; // calculated at runtime
}

export interface Alert {
  id: string;
  targetHospitalId: string; // The specific hospital this alert is for
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  symptoms: string;
  triageLevel: RiskLevel;
  timestamp: string;
  status: 'Pending' | 'Assigned' | 'Resolved';
  assignedDoctorId?: string;
  analysis?: AnalysisResult;
}

export type UserRole = 'admin' | 'ambulance' | null;

export interface DashboardStats {
  queue: {
    high: number;
    medium: number;
    low: number;
    total: number;
    avgWait: number;
  };
  deptLoad: {
    name: string;
    capacity: number; // 0-100
  }[];
  history: {
    id: string;
    age: number;
    gender: string;
    time: string;
    risk: RiskLevel;
    dept: string;
  }[];
}

export interface GroundingResult {
    source: string;
    content: string;
    uri?: string;
}
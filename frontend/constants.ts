import { PatientData, Hospital } from "./types";

export const INITIAL_VITALS = {
  systolic: 120,
  diastolic: 80,
  heartRate: 72,
  temperature: 98.6,
  spo2: 98,
  respiratoryRate: 16,
};

export const PRE_EXISTING_CONDITIONS_LIST = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Kidney Disease",
  "Cancer",
  "Immunocompromised",
];

export const SYMPTOM_TAGS = [
  "Chest Pain",
  "Fever",
  "Headache",
  "Shortness of Breath",
  "Abdominal Pain",
  "Nausea",
  "Dizziness",
  "Cough",
];

export const MOCK_SCENARIOS: Record<string, Partial<PatientData>> = {
  high: {
    age: 58,
    gender: 'Male',
    symptoms: "Severe crushing chest pain radiating to left arm and jaw. Profuse sweating and nausea. Started 45 mins ago while gardening.",
    vitals: {
      systolic: 165,
      diastolic: 105,
      heartRate: 118,
      temperature: 98.9,
      spo2: 94,
      respiratoryRate: 24
    },
    conditions: ["Hypertension", "Diabetes"]
  },
  medium: {
    age: 34,
    gender: 'Female',
    symptoms: "Persistent high fever for 3 days, productive cough with green sputum, localized right-sided chest pain when breathing deeply.",
    vitals: {
      systolic: 118,
      diastolic: 76,
      heartRate: 98,
      temperature: 102.4,
      spo2: 95,
      respiratoryRate: 20
    },
    conditions: ["Asthma"]
  },
  low: {
    age: 22,
    gender: 'Male',
    symptoms: "Twisted right ankle while playing soccer. Swelling and bruising present. Can bear some weight but painful.",
    vitals: {
      systolic: 124,
      diastolic: 82,
      heartRate: 78,
      temperature: 98.4,
      spo2: 99,
      respiratoryRate: 14
    },
    conditions: []
  }
};

// Simulated Hospitals in a city grid
export const MOCK_HOSPITALS: Hospital[] = [
  {
    id: 'HOSP-001',
    name: 'City General Hospital',
    address: '123 Main St, Downtown',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    capabilities: ['Trauma Level 1', 'Stroke Center', 'Burn Unit'],
    specialties: ['Cardiology', 'Neurology', 'Emergency'],
    occupancy: 78
  },
  {
    id: 'HOSP-002',
    name: 'Westside Community Medical',
    address: '450 Sunset Blvd',
    coordinates: { lat: 37.7649, lng: -122.4644 }, // Roughly 4km away
    capabilities: ['Trauma Level 3'],
    specialties: ['Pediatrics', 'General Medicine'],
    occupancy: 45
  },
  {
    id: 'HOSP-003',
    name: 'St. Mary Heart Institute',
    address: '888 Cardiac Way',
    coordinates: { lat: 37.7849, lng: -122.4094 }, // Roughly 2km away
    capabilities: ['Trauma Level 2', 'Cardiac Center of Excellence'],
    specialties: ['Cardiology', 'Thoracic Surgery'],
    occupancy: 92
  },
  {
    id: 'HOSP-004',
    name: 'North Bay Trauma Center',
    address: '22 Ocean View Dr',
    coordinates: { lat: 37.8049, lng: -122.4294 }, // Roughly 5km away
    capabilities: ['Trauma Level 1', 'Neurosurgery'],
    specialties: ['Neurology', 'Orthopedics'],
    occupancy: 60
  }
];
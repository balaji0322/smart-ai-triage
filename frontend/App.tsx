import React, { useState, useEffect } from 'react';
import PatientInput from './components/PatientInput';
import AnalysisResults from './components/AnalysisResults';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import HospitalSelector from './components/HospitalSelector';
import { PatientData, AnalysisResult, UserRole, Alert, Doctor, DashboardStats, Ambulance as AmbulanceType, Hospital } from './types';
import { analyzePatientTriage } from './services/geminiService';
import { triageAPI, authAPI, getAuthToken } from './services/apiService';
import { Stethoscope, LogOut, Ambulance, Send } from 'lucide-react';
import { MOCK_HOSPITALS } from './constants';

// --- MOCK DATA (Only for UI elements not yet connected to backend) ---
const MOCK_DOCTORS: Doctor[] = [
    { id: 'd1', name: 'Dr. Sarah Wilson', department: 'Cardiology', status: 'Available' },
    { id: 'd2', name: 'Dr. James Chen', department: 'Emergency', status: 'Busy' },
    { id: 'd3', name: 'Dr. Emily Ross', department: 'Neurology', status: 'Available' },
    { id: 'd4', name: 'Dr. Michael Patel', department: 'General Med', status: 'Offline' },
    { id: 'd5', name: 'Dr. Lisa Wong', department: 'Trauma', status: 'Available' },
];

const MOCK_AMBULANCES: AmbulanceType[] = [
    { id: 'a1', unitNumber: 'AMB-101', status: 'TRANSPORTING', driverName: 'John Doe', currentLocation: 'I-95 South, Exit 42', coordinates: { x: 45, y: 30 }, eta: '8 mins', patientId: 'PT-2026-1024' },
    { id: 'a2', unitNumber: 'AMB-102', status: 'IDLE', driverName: 'Jane Smith', currentLocation: 'Hospital Base', coordinates: { x: 50, y: 50 } },
    { id: 'a3', unitNumber: 'AMB-103', status: 'DISPATCHED', driverName: 'Mike Johnson', currentLocation: 'Downtown Sector 4', coordinates: { x: 75, y: 20 }, eta: '12 mins' },
    { id: 'a4', unitNumber: 'AMB-104', status: 'ON_SCENE', driverName: 'Sarah Connor', currentLocation: 'Westside Apts', coordinates: { x: 20, y: 65 } },
];

const INITIAL_STATS: DashboardStats = {
    queue: { high: 2, medium: 5, low: 3, total: 10, avgWait: 12 },
    deptLoad: [
        { name: 'Emergency', capacity: 78 },
        { name: 'Cardiology', capacity: 45 },
        { name: 'Gen Med', capacity: 62 },
        { name: 'Neuro', capacity: 30 },
    ],
    history: []
};

// --- APP COMPONENT ---
const App: React.FC = () => {
  // Auth State
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Check for existing auth token on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // TODO: Validate token and get user info
      // For now, we'll require re-login
    }
  }, []);

  const currentHospitalId = 'HOSP-001'; 

  // App State
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [ambulances, setAmbulances] = useState<AmbulanceType[]>(MOCK_AMBULANCES);
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);

  // Ambulance Local State
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  
  const [pendingPatientData, setPendingPatientData] = useState<PatientData | null>(null);
  const [showHospitalSelector, setShowHospitalSelector] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // --- HANDLERS ---

  const handleLogin = (role: UserRole, userData: any) => {
    setUserRole(role);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    authAPI.logout();
    setUserRole(null);
    setCurrentUser(null);
    setAnalysisResult(null);
    setPendingPatientData(null);
    setShowHospitalSelector(false);
    setSelectedHospital(null);
    setSuccessMessage('');
  };

  const handleAddAlert = (alert: Alert) => {
      setAlerts(prev => [alert, ...prev]);
      if (alert.targetHospitalId === currentHospitalId) {
          setStats(prev => ({
              ...prev,
              queue: {
                  ...prev.queue,
                  total: prev.queue.total + 1,
                  high: alert.triageLevel === 'HIGH' ? prev.queue.high + 1 : prev.queue.high,
                  medium: alert.triageLevel === 'MEDIUM' ? prev.queue.medium + 1 : prev.queue.medium,
                  low: alert.triageLevel === 'LOW' ? prev.queue.low + 1 : prev.queue.low,
              }
          }));
      }
  };

  // Ambulance Workflow Step 1: Analyze using BACKEND API
  const handleAnalyze = async (data: PatientData) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setPendingPatientData(data);
    setSelectedHospital(null);
    setSuccessMessage('');
    
    try {
      setProgressMessage("Connecting to backend API...");
      await new Promise(r => setTimeout(r, 500));
      
      setProgressMessage("Analyzing patient data...");
      
      // Call BACKEND API instead of Gemini directly
      const result = await triageAPI.analyze({
        symptoms: { description: data.symptoms },
        vitals: {
          systolic: data.vitals.systolic,
          diastolic: data.vitals.diastolic,
          heart_rate: data.vitals.heartRate,
          temperature: data.vitals.temperature,
          spo2: data.vitals.spo2,
          respiratory_rate: data.vitals.respiratoryRate
        }
      });
      
      // Transform backend response to match frontend format
      const transformedResult: AnalysisResult = {
        riskLevel: result.risk_level,
        confidence: result.ai_confidence * 100,
        priority: `P${result.priority_score <= 3 ? '1' : result.priority_score <= 6 ? '2' : '3'}`,
        department: {
          primary: 'Emergency',
          secondary: 'General Medicine',
          reasoning: result.recommendations,
          actionTimeline: result.risk_level === 'high' ? 'IMMEDIATE' : result.risk_level === 'medium' ? '15-30 mins' : '1-2 hours'
        },
        contributingFactors: [
          { factor: 'Vital Signs', influence: 0.8 },
          { factor: 'Symptoms', influence: 0.7 }
        ],
        clinicalReasoning: [result.recommendations],
        probabilities: {
          high: result.risk_level === 'high' ? 0.8 : 0.2,
          medium: result.risk_level === 'medium' ? 0.7 : 0.2,
          low: result.risk_level === 'low' ? 0.8 : 0.1
        },
        recommendedActions: [result.recommendations],
        timestamp: result.created_at
      };
      
      setAnalysisResult(transformedResult);
      setProgressMessage("Analysis complete!");
      
    } catch (e: any) {
      console.error(e);
      alert(`Analysis failed: ${e.message}. Please check backend connection.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Ambulance Workflow Step 2: Select Hospital & Send
  const handleSendToHospital = (hospital: Hospital) => {
      if (!analysisResult || !pendingPatientData) return;
      
      const newAlert: Alert = {
          id: `ALT-${Date.now().toString().slice(-4)}`,
          targetHospitalId: hospital.id,
          patientId: pendingPatientData.id,
          patientName: pendingPatientData.name || 'Unknown Patient',
          age: Number(pendingPatientData.age) || 0,
          gender: pendingPatientData.gender,
          symptoms: pendingPatientData.symptoms,
          triageLevel: analysisResult.riskLevel,
          timestamp: new Date().toISOString(),
          status: 'Pending',
          analysis: analysisResult
      };

      handleAddAlert(newAlert);
      
      setSelectedHospital(hospital);
      setShowHospitalSelector(false);
      setSuccessMessage(`Alert successfully dispatched to ${hospital.name}`);
  };

  // Admin: Assign Doctor
  const handleAssignDoctor = (alertId: string, doctorId: string) => {
      setAlerts(prev => prev.map(a => 
          a.id === alertId ? { ...a, status: 'Assigned', assignedDoctorId: doctorId } : a
      ));
      
      setDoctors(prev => prev.map(d => 
          d.id === doctorId ? { ...d, status: 'Busy' } : d
      ));
  };

  // --- RENDER ---

  if (!userRole) {
      return <Login onLogin={handleLogin} />;
  }

  // HOSPITAL ADMIN VIEW
  if (userRole === 'admin') {
      // FILTER ALERTS: Only show alerts for THIS hospital (HOSP-001)
      const myHospitalAlerts = alerts.filter(a => a.targetHospitalId === currentHospitalId);

      return (
          <AdminDashboard 
              stats={stats}
              alerts={myHospitalAlerts}
              doctors={doctors}
              ambulances={ambulances}
              onLogout={handleLogout}
              onAssignDoctor={handleAssignDoctor}
              onAddAlert={(alert) => handleAddAlert({...alert, targetHospitalId: currentHospitalId})} // Admin manual entry always goes to self
          />
      );
  }

  // AMBULANCE ASSISTANT VIEW
  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden text-gray-900 font-sans">
      <header className="bg-slate-900 text-white border-b border-gray-800 h-16 flex items-center px-6 justify-between flex-shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
             <Ambulance className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Ambulance Portal</h1>
            <p className="text-xs text-gray-400 tracking-wider font-medium">UNIT: AMB-101 • GPS ACTIVE</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition">
            <LogOut size={16} /> Logout
        </button>
      </header>

      <main className="flex-1 p-4 lg:p-6 overflow-hidden">
        <div className="h-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-full min-h-0">
             <PatientInput 
                onAnalyze={handleAnalyze} 
                isAnalyzing={isAnalyzing}
                onLoadDemo={() => {}} 
                onGenerateSynthetic={() => {}}
                submitLabel={analysisResult ? "Re-Analyze Patient" : "Analyze Triage"}
             />
          </div>
          <div className="h-full min-h-0 relative">
            <AnalysisResults 
                result={analysisResult} 
                loading={isAnalyzing} 
                progressMessage={progressMessage}
            />
            
            {/* AMBULANCE ACTION FOOTER - Only shows after analysis */}
            {analysisResult && !isAnalyzing && (
                <div className="absolute bottom-6 left-6 right-6">
                    {successMessage ? (
                         <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-bottom-4">
                             <div className="font-bold flex items-center gap-2">
                                <Send size={20} /> {successMessage}
                             </div>
                             <button 
                                onClick={() => {
                                    setSuccessMessage('');
                                    setAnalysisResult(null);
                                    setPendingPatientData(null);
                                }}
                                className="bg-white px-3 py-1 rounded text-sm text-green-700 font-medium hover:bg-green-50"
                             >
                                New Patient
                             </button>
                         </div>
                    ) : (
                        <div className="bg-slate-900/90 backdrop-blur text-white p-4 rounded-xl shadow-2xl border border-slate-700 flex justify-between items-center animate-in fade-in slide-in-from-bottom-4">
                            <div>
                                <h3 className="font-bold text-lg">Analysis Complete</h3>
                                <p className="text-slate-400 text-sm">Review results and select destination.</p>
                            </div>
                            <button 
                                onClick={() => setShowHospitalSelector(true)}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-blue-900/50"
                            >
                                <Ambulance size={20} /> Locate Nearby Hospitals
                            </button>
                        </div>
                    )}
                </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL: Hospital Selector */}
      {showHospitalSelector && analysisResult && (
          <HospitalSelector 
            analysis={analysisResult}
            onCancel={() => setShowHospitalSelector(false)}
            onSelect={handleSendToHospital}
          />
      )}
    </div>
  );
};

export default App;
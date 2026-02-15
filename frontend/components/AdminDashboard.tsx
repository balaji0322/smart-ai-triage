import React, { useState } from 'react';
import { 
    LayoutDashboard, 
    AlertCircle, 
    Users, 
    Stethoscope, 
    Ambulance, 
    LogOut,
    Search,
    Bell,
    PlusCircle,
    MapPin,
    Navigation,
    Clock,
    Radio
} from 'lucide-react';
import { Alert, Doctor, DashboardStats, PatientData, AnalysisResult, Ambulance as AmbulanceType } from '../types';
import Dashboard from './Dashboard'; // Reuse existing stats dashboard
import DoctorList from './DoctorList';
import RiskBadge from './RiskBadge';
import PatientInput from './PatientInput';
import AnalysisResults from './AnalysisResults';
import { analyzePatientTriage } from '../services/geminiService';

interface AdminDashboardProps {
  stats: DashboardStats;
  alerts: Alert[];
  doctors: Doctor[];
  ambulances: AmbulanceType[];
  onLogout: () => void;
  onAssignDoctor: (alertId: string, doctorId: string) => void;
  onAddAlert: (alert: Alert) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  stats, 
  alerts, 
  doctors, 
  ambulances,
  onLogout,
  onAssignDoctor,
  onAddAlert
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'alerts' | 'patients' | 'doctors' | 'ambulance'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Local state for Admin Triage
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');

  // Filtering alerts for the alerts view
  const emergencyAlerts = alerts.filter(a => a.triageLevel === 'HIGH' || a.triageLevel === 'MEDIUM');

  const handleAdminTriage = async (data: PatientData) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setProgressMessage("Initiating Triage Protocol...");
    
    try {
        await new Promise(r => setTimeout(r, 600));
        setProgressMessage("Analyzing Vitals & History...");
        
        const result = await analyzePatientTriage(data);
        setAnalysisResult(result);
        
        // Auto-create alert/record in system
        const newAlert: Alert = {
            id: `ADM-${Date.now().toString().slice(-4)}`,
            targetHospitalId: 'HOSP-001', // Assigned to current hospital context
            patientId: data.id,
            patientName: data.name || 'Walk-in Patient',
            age: Number(data.age) || 0,
            gender: data.gender,
            symptoms: data.symptoms,
            triageLevel: result.riskLevel,
            timestamp: new Date().toISOString(),
            status: 'Pending',
            analysis: result
        };
        onAddAlert(newAlert);
        
    } catch (e) {
        console.error("Admin triage error", e);
        alert("Triage analysis failed.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const getAmbulanceStatusColor = (status: string) => {
      switch(status) {
          case 'IDLE': return 'bg-gray-500';
          case 'DISPATCHED': return 'bg-amber-500';
          case 'ON_SCENE': return 'bg-blue-500';
          case 'TRANSPORTING': return 'bg-red-500';
          case 'RETURNING': return 'bg-green-500';
          default: return 'bg-gray-500';
      }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg">
                <Stethoscope size={20} className="text-white" />
             </div>
             <div>
                <h2 className="font-bold text-lg leading-none">SmartTriage</h2>
                <span className="text-xs text-slate-400">Admin Portal</span>
             </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <button 
                onClick={() => setActiveView('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <LayoutDashboard size={18} /> Dashboard
            </button>
            <button 
                onClick={() => setActiveView('alerts')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === 'alerts' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <AlertCircle size={18} /> 
                <div className="flex-1 text-left">Emergency Alerts</div>
                {emergencyAlerts.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{emergencyAlerts.length}</span>}
            </button>
            <button 
                onClick={() => setActiveView('patients')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === 'patients' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <PlusCircle size={18} /> New Admission
            </button>
            <button 
                onClick={() => setActiveView('doctors')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === 'doctors' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <Stethoscope size={18} /> Doctor Availability
            </button>
            <button 
                onClick={() => setActiveView('ambulance')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === 'ambulance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <Ambulance size={18} /> Ambulance Status
            </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold">A</div>
                <div className="overflow-hidden">
                    <div className="text-sm font-bold truncate">Admin User</div>
                    <div className="text-xs text-slate-400 truncate">HOSP-001</div>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
            >
                <LogOut size={16} /> Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">
                {activeView === 'overview' && 'Hospital Overview'}
                {activeView === 'alerts' && 'Emergency Alert Center'}
                {activeView === 'patients' && 'New Patient Admission'}
                {activeView === 'doctors' && 'Medical Staff'}
                {activeView === 'ambulance' && 'Live Ambulance Tracker'}
            </h1>
            
            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search patients..." 
                        className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 border border-transparent focus:bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2 border border-white"></div>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                        <Bell size={20} />
                    </button>
                </div>
            </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            
            {/* OVERVIEW VIEW */}
            {activeView === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Reuse Dashboard Component logic but adapted layout */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Cards Row */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Total Patients</div>
                                <div className="text-2xl font-black text-gray-800">{stats.queue.total}</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-red-500">
                                <div className="text-red-500 text-xs font-bold uppercase mb-1">Emergency</div>
                                <div className="text-2xl font-black text-red-600">{stats.queue.high + stats.queue.medium}</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                <div className="text-blue-500 text-xs font-bold uppercase mb-1">Inbound AMB</div>
                                <div className="text-2xl font-black text-blue-600">{ambulances.filter(a => a.status === 'TRANSPORTING').length}</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                <div className="text-green-500 text-xs font-bold uppercase mb-1">Doctors Avail</div>
                                <div className="text-2xl font-black text-green-600">{doctors.filter(d => d.status === 'Available').length}</div>
                            </div>
                        </div>
                        
                        {/* Live Emergency Feed */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800">Recent Emergency Alerts</h3>
                                <button onClick={() => setActiveView('alerts')} className="text-xs text-blue-600 font-medium hover:underline">View All</button>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {alerts.slice(0, 5).map(alert => (
                                    <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                                                ${alert.triageLevel === 'HIGH' ? 'bg-red-500' : alert.triageLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}
                                            `}>
                                                {alert.triageLevel === 'HIGH' ? 'P1' : alert.triageLevel === 'MEDIUM' ? 'P2' : 'P3'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{alert.patientName} <span className="text-xs text-gray-400 font-normal">({alert.age}y / {alert.gender})</span></div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">{alert.symptoms}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <RiskBadge level={alert.triageLevel} size="sm" />
                                            <div className="text-[10px] text-gray-400 mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                ))}
                                {alerts.length === 0 && <div className="p-8 text-center text-gray-400">No active alerts</div>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <DoctorList doctors={doctors} />
                        {/* Render existing Dashboard stats as small widgets */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-3">Department Load</h3>
                             <div className="space-y-3">
                                {stats.deptLoad.map(dept => (
                                    <div key={dept.name}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-medium text-gray-700">{dept.name}</span>
                                            <span className="text-gray-500">{dept.capacity}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-1000 ${
                                                    dept.capacity > 80 ? 'bg-red-500' : dept.capacity > 60 ? 'bg-amber-400' : 'bg-green-500'
                                                }`} 
                                                style={{width: `${dept.capacity}%`}}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ALERTS VIEW */}
            {activeView === 'alerts' && (
                <div className="space-y-4">
                     {alerts.map(alert => (
                        <div key={alert.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">{alert.patientId}</span>
                                    <RiskBadge level={alert.triageLevel} size="sm" animate={alert.triageLevel === 'HIGH'} />
                                    <span className="text-xs text-gray-400">{new Date(alert.timestamp).toLocaleString()}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{alert.patientName}, {alert.age} <span className="text-sm font-normal text-gray-500">({alert.gender})</span></h3>
                                <p className="text-gray-600 mb-4">{alert.symptoms}</p>
                                
                                {alert.analysis && (
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm mb-4">
                                        <div className="font-bold text-blue-800 mb-1 flex items-center gap-2">
                                            <AlertCircle size={16} /> AI Insight:
                                        </div>
                                        <p className="text-blue-900">{alert.analysis.department.reasoning}</p>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">BP: 140/90</div>
                                    <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">HR: 110</div>
                                    <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">SpO2: 96%</div>
                                </div>
                            </div>
                            
                            <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                                <div>
                                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Assign Doctor</div>
                                    {alert.assignedDoctorId ? (
                                        <div className="flex items-center gap-2 bg-green-50 p-2 rounded border border-green-100">
                                            <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-xs">
                                                ✓
                                            </div>
                                            <span className="text-sm font-medium text-green-800">Assigned to Dr. {doctors.find(d => d.id === alert.assignedDoctorId)?.name}</span>
                                        </div>
                                    ) : (
                                        <select 
                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            onChange={(e) => onAssignDoctor(alert.id, e.target.value)}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select available doctor...</option>
                                            {doctors.filter(d => d.status === 'Available').map(d => (
                                                <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <button className="mt-4 w-full bg-slate-900 text-white py-2 rounded-lg font-bold text-sm hover:bg-slate-800">
                                    View Full Records
                                </button>
                            </div>
                        </div>
                     ))}
                     {alerts.length === 0 && (
                         <div className="text-center p-12 bg-white rounded-xl border border-gray-200 text-gray-500">
                             No alerts at the moment.
                         </div>
                     )}
                </div>
            )}

            {/* DOCTORS VIEW */}
            {activeView === 'doctors' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map(doctor => (
                        <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500 border-4 border-white shadow">
                                {doctor.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                                <p className="text-sm text-gray-500">{doctor.department}</p>
                                <div className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-bold
                                    ${doctor.status === 'Available' ? 'bg-green-100 text-green-700' : 
                                      doctor.status === 'Busy' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}
                                `}>
                                    <div className={`w-2 h-2 rounded-full mr-1.5 ${
                                        doctor.status === 'Available' ? 'bg-green-500' : 
                                        doctor.status === 'Busy' ? 'bg-red-500' : 'bg-gray-500'
                                    }`}></div>
                                    {doctor.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PATIENTS VIEW - New Patient Admission */}
            {activeView === 'patients' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
                    <div className="h-full min-h-0 overflow-hidden">
                        <PatientInput 
                            onAnalyze={handleAdminTriage} 
                            isAnalyzing={isAnalyzing}
                            onLoadDemo={() => {}} 
                            onGenerateSynthetic={() => {}}
                            submitLabel="Assess Patient"
                        />
                    </div>
                    <div className="h-full min-h-0 overflow-hidden">
                        <AnalysisResults 
                            result={analysisResult} 
                            loading={isAnalyzing} 
                            progressMessage={progressMessage}
                        />
                    </div>
                </div>
            )}

            {/* AMBULANCE STATUS VIEW */}
            {activeView === 'ambulance' && (
                <div className="h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* List Column */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Ambulance size={18} className="text-blue-600" /> Fleet Status
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                            {ambulances.map(amb => (
                                <div key={amb.id} className="p-4 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-bold text-gray-900">{amb.unitNumber}</div>
                                            <div className="text-xs text-gray-500">{amb.driverName}</div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${getAmbulanceStatusColor(amb.status)}`}>
                                            {amb.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <MapPin size={12} className="text-gray-400" />
                                            {amb.currentLocation}
                                        </div>
                                        {amb.eta && (
                                            <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                                                <Clock size={12} /> ETA: {amb.eta}
                                            </div>
                                        )}
                                        {amb.patientId && (
                                            <div className="flex items-center gap-2 text-xs text-red-600 font-medium bg-red-50 p-1.5 rounded mt-2">
                                                <AlertCircle size={12} /> Patient: {amb.patientId}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Simulated Map Column */}
                    <div className="lg:col-span-2 bg-slate-900 rounded-xl shadow-inner border border-slate-700 relative overflow-hidden flex flex-col">
                        <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur text-white px-3 py-1 rounded text-xs font-mono border border-slate-600">
                            LIVE TACTICAL MAP
                        </div>
                        
                        {/* Map Grid Background */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="grid-map" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid-map)" />
                             </svg>
                        </div>

                        {/* Hospital Center Marker */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 border-2 border-white z-10">
                                <div className="text-white font-bold text-xs">H</div>
                            </div>
                            <div className="mt-1 bg-slate-900/80 text-white text-[10px] px-1 rounded">Hospital Base</div>
                            <div className="absolute w-32 h-32 bg-blue-500/10 rounded-full animate-ping"></div>
                        </div>

                        {/* Ambulance Markers */}
                        {ambulances.map(amb => (
                            <div 
                                key={amb.id}
                                className="absolute flex flex-col items-center group cursor-pointer transition-all duration-1000 ease-in-out"
                                style={{ top: `${amb.coordinates.y}%`, left: `${amb.coordinates.x}%` }}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white transform group-hover:scale-110 transition
                                    ${getAmbulanceStatusColor(amb.status)}
                                `}>
                                    <Ambulance size={12} className="text-white" />
                                </div>
                                
                                {/* Tooltip */}
                                <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 p-2 rounded shadow-xl text-xs whitespace-nowrap z-20 pointer-events-none">
                                    <div className="font-bold">{amb.unitNumber}</div>
                                    <div className="text-gray-500">{amb.status}</div>
                                    {amb.eta && <div className="text-blue-600 font-bold">ETA: {amb.eta}</div>}
                                </div>

                                {amb.status === 'TRANSPORTING' && (
                                    <div className="absolute w-full h-full bg-red-500/30 rounded-full animate-ping -z-10"></div>
                                )}
                            </div>
                        ))}

                        {/* Controls Overlay */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                             <button className="bg-slate-800 text-white p-2 rounded hover:bg-slate-700 border border-slate-600">
                                <Navigation size={18} />
                             </button>
                             <button className="bg-slate-800 text-white p-2 rounded hover:bg-slate-700 border border-slate-600">
                                <Radio size={18} />
                             </button>
                        </div>
                    </div>
                </div>
            )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
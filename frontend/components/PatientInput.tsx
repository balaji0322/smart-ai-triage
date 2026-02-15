import React, { useState, useEffect } from 'react';
import { User, Activity, FileText, Upload, Mic, Trash2, Save, Cloud, Check, Plus, Link as LinkIcon, FilePlus, Send } from 'lucide-react';
import { PatientData, Vitals } from '../types';
import { INITIAL_VITALS, PRE_EXISTING_CONDITIONS_LIST, SYMPTOM_TAGS, MOCK_SCENARIOS } from '../constants';
import VitalSignInput from './VitalSignInput';
import VoiceAssistant from './VoiceAssistant';

interface PatientInputProps {
  onAnalyze: (data: PatientData) => void;
  isAnalyzing: boolean;
  onLoadDemo: (type: 'high' | 'medium' | 'low') => void;
  onGenerateSynthetic: () => void;
  submitLabel?: string;
}

const PatientInput: React.FC<PatientInputProps> = ({ 
  onAnalyze, 
  isAnalyzing, 
  onLoadDemo, 
  onGenerateSynthetic,
  submitLabel = "ANALYZE WITH AI" 
}) => {
  const [patientId, setPatientId] = useState(`PT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<string>('');
  const [arrivalTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [vitals, setVitals] = useState<Vitals>(INITIAL_VITALS);
  const [symptoms, setSymptoms] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [manualRiskLevel, setManualRiskLevel] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleVitalChange = (key: keyof Vitals, val: string) => {
    setVitals(prev => ({ ...prev, [key]: Number(val) }));
  };

  const toggleCondition = (cond: string) => {
    setConditions(prev => 
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    setFiles([...files, ...newFiles]);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const loadScenario = (type: 'high' | 'medium' | 'low') => {
    const data = MOCK_SCENARIOS[type];
    if (data) {
      if (data.age) setAge(data.age);
      if (data.gender) setGender(data.gender);
      if (data.symptoms) setSymptoms(data.symptoms);
      if (data.vitals) setVitals(data.vitals as Vitals);
      if (data.conditions) setConditions(data.conditions);
      setPatientName(type === 'high' ? 'John Doe' : type === 'medium' ? 'Jane Smith' : 'Mike Ross');
    }
  };

  const handleSubmit = () => {
    onAnalyze({
      id: patientId,
      name: patientName,
      age,
      gender: gender as any,
      arrivalTime,
      vitals,
      symptoms,
      conditions,
      manualRiskLevel,
      files
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-2">
          <User className="text-blue-500" size={20} />
          <h2 className="font-bold text-gray-800">Patient Details</h2>
        </div>
        <div className="flex gap-2">
            <button onClick={onGenerateSynthetic} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition">
                Synthetic
            </button>
            <div className="relative group">
                <button className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition">
                    Load Demo
                </button>
                <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow-lg hidden group-hover:block z-10">
                    <button onClick={() => loadScenario('high')} className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 text-red-600">High Risk</button>
                    <button onClick={() => loadScenario('medium')} className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 text-amber-600">Medium Risk</button>
                    <button onClick={() => loadScenario('low')} className="w-full text-left px-3 py-2 text-xs hover:bg-green-50 text-green-600">Low Risk</button>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        {/* Demographics */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-400 uppercase text-xs font-bold tracking-wider">
            Patient Demographics
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Patient Name</label>
              <input 
                type="text" 
                value={patientName} 
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded p-2 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Patient ID</label>
              <input 
                type="text" 
                value={patientId} 
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded p-2 text-sm font-mono text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Age</label>
              <input 
                type="number" 
                value={age} 
                onChange={(e) => setAge(Number(e.target.value))} 
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Age" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value)} 
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Arrival Time</label>
              <input type="text" value={arrivalTime} disabled className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-sm text-gray-600" />
            </div>
          </div>
        </section>

        {/* Vitals */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-400 uppercase text-xs font-bold tracking-wider">
            <Activity size={14} /> Vital Signs
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <VitalSignInput 
              label="Sys BP" value={vitals.systolic} onChange={(v) => handleVitalChange('systolic', v)} 
              unit="mmHg" criticalHigh={180} criticalLow={90} warningHigh={140}
            />
            <VitalSignInput 
              label="Dia BP" value={vitals.diastolic} onChange={(v) => handleVitalChange('diastolic', v)} 
              unit="mmHg" criticalHigh={120} criticalLow={60} warningHigh={90}
            />
            <VitalSignInput 
              label="Heart Rate" value={vitals.heartRate} onChange={(v) => handleVitalChange('heartRate', v)} 
              unit="BPM" criticalHigh={120} criticalLow={40} warningHigh={100} warningLow={60}
            />
            <VitalSignInput 
              label="Temp" value={vitals.temperature} onChange={(v) => handleVitalChange('temperature', v)} 
              unit="°F" criticalHigh={104} warningHigh={100.4}
            />
            <VitalSignInput 
              label="SpO2" value={vitals.spo2} onChange={(v) => handleVitalChange('spo2', v)} 
              unit="%" criticalLow={90} warningLow={94}
            />
            <VitalSignInput 
              label="Resp Rate" value={vitals.respiratoryRate} onChange={(v) => handleVitalChange('respiratoryRate', v)} 
              unit="bpm" criticalHigh={30} warningHigh={24}
            />
          </div>
        </section>

        {/* Symptoms */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-400 uppercase text-xs font-bold tracking-wider">
            <FileText size={14} /> Symptoms
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {SYMPTOM_TAGS.map(tag => (
              <button 
                key={tag}
                onClick={() => setSymptoms(prev => prev ? `${prev}, ${tag}` : tag)}
                className="px-2 py-1 text-xs rounded-full border border-gray-200 hover:border-blue-400 hover:text-blue-600 transition"
              >
                + {tag}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Describe chief complaint..."
              maxLength={500}
            ></textarea>
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="text-xs text-gray-400">{symptoms.length}/500</span>
                <button 
                    onClick={() => setShowVoiceModal(true)}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-md"
                    title="Voice Input (Gemini Live)"
                >
                    <Mic size={16} />
                </button>
            </div>
          </div>
        </section>

        {/* Conditions */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-400 uppercase text-xs font-bold tracking-wider">
            Pre-existing Conditions
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {PRE_EXISTING_CONDITIONS_LIST.map(cond => (
              <label key={cond} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input 
                  type="checkbox" 
                  checked={conditions.includes(cond)}
                  onChange={() => toggleCondition(cond)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {cond}
              </label>
            ))}
          </div>

          {/* Risk Level (Optional) */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Observed Risk Level (Optional)</label>
            <select 
              value={manualRiskLevel}
              onChange={(e) => setManualRiskLevel(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
            >
              <option value="">Select observed risk level...</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>
        </section>

        {/* Documents */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-400 uppercase text-xs font-bold tracking-wider">
            Documents & Records
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          
          <div className="space-y-3">
             {/* Upload Area */}
             <div className="flex gap-3">
                <div 
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:border-blue-400 transition cursor-pointer bg-gray-50/50 group relative overflow-hidden"
                >
                    <input 
                        type="file" 
                        className="hidden" 
                        id="file-upload" 
                        multiple 
                        onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))} 
                    />
                    <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full h-full z-10">
                        <div className="bg-blue-100 p-2 rounded-full mb-2 group-hover:bg-blue-200 transition">
                            <Plus className="text-blue-600" size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Upload Reports</span>
                        <span className="text-xs text-gray-400 mt-1">Drag & drop or click</span>
                    </label>
                </div>

                <div className="flex-1 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer group bg-white">
                    <div className="bg-emerald-100 p-2 rounded-full mb-2 group-hover:bg-emerald-200 transition">
                        <LinkIcon className="text-emerald-600" size={24} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Connect EHR/EMR</span>
                    <span className="text-xs text-gray-400 mt-1">Epic, Cerner, etc.</span>
                </div>
             </div>

             {/* File List */}
             {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-100">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FileText size={16} className="text-blue-500 flex-shrink-0" />
                                <span className="text-xs text-blue-900 truncate">{f.name}</span>
                            </div>
                            {uploadProgress < 100 ? (
                                <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            ) : (
                                <Check size={16} className="text-green-500" />
                            )}
                        </div>
                    ))}
                </div>
             )}
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-gray-200 bg-white">
        <button 
          onClick={handleSubmit}
          disabled={isAnalyzing}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2
            ${isAnalyzing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]'}`}
        >
            {isAnalyzing ? (
                <>
                 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 Analyzing...
                </>
            ) : (
                <>
                  {submitLabel === "Send Emergency Alert" ? <Send size={20} /> : null}
                  {submitLabel}
                </>
            )}
        </button>
        <div className="grid grid-cols-2 gap-3 mt-3">
            <button 
                onClick={() => {
                    setAge(''); setSymptoms(''); setVitals(INITIAL_VITALS); setConditions([]); setManualRiskLevel(''); setPatientId(`PT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
                    setPatientName('');
                }}
                className="py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
            >
                <Trash2 size={16} /> Clear
            </button>
            <button className="py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium flex items-center justify-center gap-2">
                <Save size={16} /> Save Draft
            </button>
        </div>
      </div>

      <VoiceAssistant 
        isOpen={showVoiceModal} 
        onClose={() => setShowVoiceModal(false)} 
        onTranscript={(text) => setSymptoms(prev => prev + " " + text)}
      />
    </div>
  );
};

export default PatientInput;
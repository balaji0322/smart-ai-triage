import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import RiskBadge from './RiskBadge';
import { Activity, Clock, AlertCircle, CheckCircle, Brain, ArrowRight, MapPin, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { searchMedicalProtocols, findNearbySpecialists } from '../services/geminiService';

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  loading: boolean;
  progressMessage: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, loading, progressMessage }) => {
  const [protocolInfo, setProtocolInfo] = useState<{text: string, sources: any[]} | null>(null);
  const [nearbyInfo, setNearbyInfo] = useState<string | null>(null);
  const [loadingExtras, setLoadingExtras] = useState(false);

  // Handlers for Grounding
  const handleCheckProtocols = async () => {
    if(!result) return;
    setLoadingExtras(true);
    const data = await searchMedicalProtocols(result.clinicalReasoning[0] || "Triage protocols");
    setProtocolInfo(data);
    setLoadingExtras(false);
  };

  const handleFindNearby = async () => {
     if(!result) return;
     setLoadingExtras(true);
     // Simulate getting location
     const text = await findNearbySpecialists(result.department.primary, 37.7749, -122.4194);
     setNearbyInfo(text);
     setLoadingExtras(false);
  };

  if (loading) {
    return (
      <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center p-12">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <Brain className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing Patient Data</h3>
        <p className="text-gray-500 animate-pulse">{progressMessage}</p>
        <div className="w-64 h-2 bg-gray-100 rounded-full mt-8 overflow-hidden">
            <div className="h-full bg-blue-500 animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Activity size={40} className="text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Analyze</h2>
        <p className="text-gray-500 max-w-md">
          Complete the patient form on the left and click "Analyze with AI" to generate a comprehensive risk assessment and triage plan.
        </p>
      </div>
    );
  }

  // Visualization Data
  const factorData = result.contributingFactors.map(f => ({
    name: f.factor.length > 20 ? f.factor.substring(0, 20) + '...' : f.factor,
    full: f.factor,
    value: f.influence * 100
  }));

  const COLORS = {
      HIGH: '#EF4444',
      MEDIUM: '#F59E0B',
      LOW: '#10B981'
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar space-y-6 pr-2">
      {/* Risk Header Card */}
      <div className="bg-white rounded-xl shadow-md border-l-8 border-l-transparent overflow-hidden" 
           style={{ borderLeftColor: COLORS[result.riskLevel] }}>
        <div className="p-6">
           <div className="flex justify-between items-start mb-6">
             <RiskBadge level={result.riskLevel} size="lg" animate />
             <div className="text-right">
                <div className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Confidence Score</div>
                <div className="text-3xl font-black text-gray-800">{result.confidence}%</div>
             </div>
           </div>
           
           <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
             <div>
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Priority Level</div>
                <div className="text-xl font-bold text-gray-800">{result.priority}</div>
             </div>
             <div>
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Est. Wait Time</div>
                <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Clock size={18} className="text-gray-400" />
                    {result.riskLevel === 'HIGH' ? 'IMMEDIATE' : result.riskLevel === 'MEDIUM' ? '< 30 mins' : '< 120 mins'}
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="text-blue-500" size={20} /> Recommendation
        </h3>
        
        <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg flex-1 border border-blue-100">
                <div className="text-xs text-blue-600 font-bold uppercase mb-1">Primary Department</div>
                <div className="text-xl font-bold text-blue-900">{result.department.primary}</div>
            </div>
            {result.department.secondary && (
                <div className="bg-gray-50 p-4 rounded-lg flex-1 border border-gray-200">
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Consult</div>
                    <div className="text-lg font-bold text-gray-700">{result.department.secondary}</div>
                </div>
            )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 border-l-4 border-blue-400 italic">
            "{result.department.reasoning}"
        </div>
        
        {/* Grounding Actions */}
        <div className="flex gap-3 mt-4">
            <button 
                onClick={handleFindNearby}
                className="flex items-center gap-2 text-xs bg-white border border-gray-300 px-3 py-2 rounded hover:bg-gray-50 text-gray-700 shadow-sm"
            >
                <MapPin size={14} /> Locate Services (Maps)
            </button>
        </div>
        {nearbyInfo && (
            <div className="mt-3 p-3 bg-green-50 text-xs text-green-800 rounded border border-green-200 whitespace-pre-line">
                <h4 className="font-bold mb-1">Nearby Services:</h4>
                {nearbyInfo}
            </div>
        )}
      </div>

      {/* Explainability */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Brain className="text-purple-500" size={20} /> AI Explainability
        </h3>

        <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Top Contributing Factors</h4>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={factorData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" width={120} tick={{fontSize: 11}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{fill: '#f3f4f6'}}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                            {factorData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? COLORS[result.riskLevel] : '#94a3b8'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div>
            <div className="flex justify-between items-center mb-2">
                 <h4 className="text-xs font-bold text-gray-500 uppercase">Clinical Reasoning</h4>
                 <button onClick={handleCheckProtocols} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                    <Search size={10} /> Check Protocols
                 </button>
            </div>
            <ul className="space-y-2">
                {result.clinicalReasoning.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
                        {point}
                    </li>
                ))}
            </ul>
             {protocolInfo && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs">
                    <h5 className="font-bold text-blue-800 mb-1">Protocol Search Result:</h5>
                    <p className="text-blue-900 mb-2">{protocolInfo.text}</p>
                    {protocolInfo.sources.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {protocolInfo.sources.map((src, i) => (
                                <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="px-2 py-1 bg-white rounded border border-blue-200 text-blue-600 hover:text-blue-800 truncate max-w-[150px]">
                                    {src.title || "Source"}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* Actions Checklist */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
         <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="text-amber-500" size={20} /> Immediate Actions
        </h3>
        <div className="space-y-3">
            {result.recommendedActions.map((action, i) => (
                <label key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                    <input type="checkbox" className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span className="text-sm font-medium text-gray-700">{action}</span>
                </label>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
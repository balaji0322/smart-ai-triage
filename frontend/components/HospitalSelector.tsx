import React, { useMemo } from 'react';
import { Hospital, AnalysisResult } from '../types';
import { MapPin, Navigation, AlertCircle, Activity, Star } from 'lucide-react';
import { MOCK_HOSPITALS } from '../constants';

interface HospitalSelectorProps {
  analysis: AnalysisResult;
  onSelect: (hospital: Hospital) => void;
  onCancel: () => void;
}

// Simple Haversine simulation (mocking ambulance at a fixed point relative to hospitals)
// In a real app, this would use navigator.geolocation
const AMBULANCE_LOC = { lat: 37.7700, lng: -122.4400 }; 

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const HospitalSelector: React.FC<HospitalSelectorProps> = ({ analysis, onSelect, onCancel }) => {
  
  const sortedHospitals = useMemo(() => {
    // 1. Calculate Distances
    const withDistance = MOCK_HOSPITALS.map(h => ({
      ...h,
      distance: calculateDistance(AMBULANCE_LOC.lat, AMBULANCE_LOC.lng, h.coordinates.lat, h.coordinates.lng)
    }));

    // 2. Score based on AI recommendations
    // If Analysis says "Cardiology" and Hospital has "Cardiology", boost score
    const recommendedDept = analysis.department.primary;
    
    return withDistance.sort((a, b) => {
      let scoreA = a.distance || 0;
      let scoreB = b.distance || 0;

      // Penalize distance, but Boost if specialty matches
      if (a.specialties.some(s => recommendedDept.includes(s))) scoreA -= 2; // Artificially reduce distance score to float to top
      if (b.specialties.some(s => recommendedDept.includes(s))) scoreB -= 2;

      return scoreA - scoreB;
    });
  }, [analysis]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Navigation className="text-blue-400" /> Select Destination Hospital
            </h2>
            <p className="text-slate-400 text-sm mt-1">
                Based on AI Analysis: <span className="text-white font-bold">{analysis.department.primary}</span> required.
            </p>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 space-y-3 bg-gray-50 flex-1">
            {sortedHospitals.map(hospital => {
                const isRecommended = hospital.specialties.some(s => analysis.department.primary.includes(s));
                
                return (
                    <button 
                        key={hospital.id}
                        onClick={() => onSelect(hospital)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:scale-[1.01] relative overflow-hidden group
                            ${isRecommended 
                                ? 'bg-white border-blue-500 shadow-md shadow-blue-100' 
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }
                        `}
                    >
                        {isRecommended && (
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                RECOMMENDED
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{hospital.name}</h3>
                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                    <MapPin size={14} /> {hospital.address}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-black text-xl text-gray-800">{(hospital.distance || 0).toFixed(1)} km</div>
                                <div className="text-xs text-gray-500 font-medium">Distance</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                                {hospital.capabilities.slice(0, 2).map(cap => (
                                    <span key={cap} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded border border-gray-200 font-medium">
                                        {cap}
                                    </span>
                                ))}
                            </div>
                            
                            {/* Occupancy */}
                            <div className={`ml-auto flex items-center gap-1 text-xs font-bold px-2 py-1 rounded
                                ${hospital.occupancy > 90 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}
                            `}>
                                <Activity size={12} /> {hospital.occupancy}% Busy
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-end gap-3">
            <button 
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-100"
            >
                Cancel Analysis
            </button>
        </div>
      </div>
    </div>
  );
};

export default HospitalSelector;
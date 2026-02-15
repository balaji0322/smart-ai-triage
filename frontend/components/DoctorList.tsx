import React from 'react';
import { Doctor } from '../types';

interface DoctorListProps {
    doctors: Doctor[];
    onAssign?: (doctorId: string) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors, onAssign }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Doctor Availability</h3>
                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {doctors.filter(d => d.status === 'Available').length} Online
                </span>
            </div>
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto custom-scrollbar">
                {doctors.map(doctor => (
                    <div key={doctor.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold border-2 border-white shadow-sm">
                                {doctor.name.charAt(0)}D
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">{doctor.name}</h4>
                                <p className="text-xs text-gray-500">{doctor.department}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                doctor.status === 'Available' ? 'bg-green-100 text-green-700' :
                                doctor.status === 'Busy' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                                {doctor.status}
                            </span>
                            {onAssign && doctor.status === 'Available' && (
                                <button 
                                    onClick={() => onAssign(doctor.id)}
                                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100 hover:bg-blue-100 font-medium"
                                >
                                    Assign
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorList;
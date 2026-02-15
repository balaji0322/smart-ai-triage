import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', animate = false }) => {
  const baseClasses = "font-bold rounded-full flex items-center justify-center transition-all";
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-xl tracking-wider"
  };

  const colorClasses = {
    HIGH: "bg-red-600 text-white shadow-lg shadow-red-200",
    MEDIUM: "bg-amber-500 text-white shadow-lg shadow-amber-200",
    LOW: "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
  };

  const animationClass = animate && level === 'HIGH' ? "animate-pulse" : "";

  return (
    <div className={`${baseClasses} ${sizeClasses[size]} ${colorClasses[level]} ${animationClass}`}>
      {level} RISK
    </div>
  );
};

export default RiskBadge;
import React from 'react';

interface VitalSignInputProps {
  label: string;
  value: number | string;
  onChange: (val: string) => void;
  unit?: string;
  min?: number;
  max?: number;
  warningLow?: number;
  warningHigh?: number;
  criticalLow?: number;
  criticalHigh?: number;
  placeholder?: string;
}

const VitalSignInput: React.FC<VitalSignInputProps> = ({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  warningLow,
  warningHigh,
  criticalLow,
  criticalHigh,
  placeholder
}) => {
  const numVal = Number(value);
  
  let borderColor = "border-gray-300 focus:ring-blue-500";
  let statusIcon = null;

  if (value !== '') {
    if ((criticalLow && numVal < criticalLow) || (criticalHigh && numVal > criticalHigh)) {
      borderColor = "border-red-500 ring-2 ring-red-200 animate-pulse";
      statusIcon = <span className="text-red-500 text-xs font-bold">CRITICAL</span>;
    } else if ((warningLow && numVal < warningLow) || (warningHigh && numVal > warningHigh)) {
      borderColor = "border-amber-400 ring-2 ring-amber-100";
      statusIcon = <span className="text-amber-500 text-xs font-bold">WARNING</span>;
    } else {
      borderColor = "border-green-500 ring-1 ring-green-100";
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {statusIcon}
      </div>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border p-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 transition-all ${borderColor}`}
          placeholder={placeholder || "0"}
          min={min}
          max={max}
        />
        {unit && (
          <span className="absolute right-3 top-2 text-gray-400 text-sm">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default VitalSignInput;
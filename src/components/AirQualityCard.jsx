import React from 'react';
import { Wind, HelpCircle, ShieldAlert } from 'lucide-react';
import { getAQICategory } from '../utils/api';

export default function AirQualityCard({ pollution }) {
  if (!pollution) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-full flex items-center justify-center shimmer-bg">
        <span className="text-slate-500 text-sm">Processing pollution stream...</span>
      </div>
    );
  }

  const { aqi, components, subIndices } = pollution;
  const aqiInfo = getAQICategory(aqi);

  // Helper to get safe limit percentage for bars
  const getProgressPercent = (value, pollutant) => {
    let limit = 100;
    if (pollutant === 'pm2_5') limit = 60; // 24-hr CPCB standard
    if (pollutant === 'pm10') limit = 100;
    if (pollutant === 'o3') limit = 100; // 8-hr standard
    if (pollutant === 'no2') limit = 80;
    if (pollutant === 'so2') limit = 80;
    if (pollutant === 'co') return Math.min(100, (value / 1000 / 2) * 100); // 8-hr is 2 mg/m3
    
    return Math.min(100, (value / limit) * 100);
  };

  const getPollutantStatus = (val, type) => {
    if (type === 'pm2_5') {
      if (val <= 30) return { label: "Good", color: "bg-emerald-500" };
      if (val <= 60) return { label: "Satisfactory", color: "bg-teal-500" };
      if (val <= 90) return { label: "Moderate", color: "bg-amber-500" };
      return { label: "Poor", color: "bg-red-500" };
    }
    if (type === 'pm10') {
      if (val <= 50) return { label: "Good", color: "bg-emerald-500" };
      if (val <= 100) return { label: "Satisfactory", color: "bg-teal-500" };
      if (val <= 250) return { label: "Moderate", color: "bg-amber-500" };
      return { label: "Poor", color: "bg-red-500" };
    }
    // Default fallback
    if (val < 40) return { label: "Low", color: "bg-emerald-500" };
    if (val < 100) return { label: "Moderate", color: "bg-amber-500" };
    return { label: "Elevated", color: "bg-red-500" };
  };

  const pollutants = [
    { key: 'pm2_5', name: 'PM2.5', label: 'Fine Particles', unit: 'µg/m³', value: components.pm2_5 },
    { key: 'pm10', name: 'PM10', label: 'Coarse Dust', unit: 'µg/m³', value: components.pm10 },
    { key: 'o3', name: 'Ozone (O₃)', label: 'Ground-level Gas', unit: 'µg/m³', value: components.o3 },
    { key: 'no2', name: 'NO₂', label: 'Nitrogen Dioxide', unit: 'µg/m³', value: components.no2 },
    { key: 'so2', name: 'SO₂', label: 'Sulfur Dioxide', unit: 'µg/m³', value: components.so2 },
    { key: 'co', name: 'CO', label: 'Carbon Monoxide', unit: 'mg/m³', value: (components.co / 1000).toFixed(2) }
  ];

  // Radial dial variables
  const radius = 68;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Cap AQI at 500 for the stroke progress
  const strokeDashoffset = circumference - (Math.min(500, aqi) / 500) * circumference;

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between space-y-6 glass-panel-hover">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-bold text-slate-200">Real-Time Air Quality</h2>
        </div>
        <div className="relative group cursor-help text-slate-500 hover:text-slate-400">
          <HelpCircle className="h-4 w-4" />
          <div className="absolute right-0 bottom-6 hidden group-hover:block w-64 bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-[10px] text-slate-400 leading-normal z-30 shadow-xl">
            Calculated using Indian CPCB breakpoint scales. PM2.5 and PM10 sub-indices usually dictate the final index.
          </div>
        </div>
      </div>

      {/* Main Dial & Classification Grid */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        {/* Radial AQI Meter */}
        <div className="relative flex items-center justify-center">
          <svg className="h-44 w-44 transform -rotate-90">
            {/* Background Track */}
            <circle
              stroke="rgba(30, 41, 59, 0.5)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius + stroke}
              cy={radius + stroke}
            />
            {/* Active Gauge */}
            <circle
              stroke={
                aqi <= 50 ? "#10b981" : // emerald
                aqi <= 100 ? "#14b8a6" : // teal
                aqi <= 200 ? "#f59e0b" : // amber
                aqi <= 300 ? "#f97316" : // orange
                aqi <= 400 ? "#ef4444" : // red
                "#a855f7" // purple
              }
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius + stroke}
              cy={radius + stroke}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Centered Value */}
          <div className="absolute text-center space-y-0.5">
            <span className="text-3xl font-extrabold tracking-tight text-white">{aqi}</span>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">CPCB AQI</p>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase mt-1 ${aqiInfo.bg} ${aqiInfo.color} border ${aqiInfo.border}`}>
              {aqiInfo.label}
            </span>
          </div>
        </div>

        {/* Hazard Exposure Descriptor */}
        <div className="space-y-3 max-w-xs text-center sm:text-left">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Health Hazard Level</h3>
            <p className={`text-lg font-extrabold ${aqiInfo.color}`}>{aqiInfo.hazardLevel} Risk</p>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {aqi <= 100 
              ? "Air quality is satisfying. Outdoor exercise is safe." 
              : aqi <= 200 
              ? "Sensitive groups may suffer mild breathing irritation; consider reducing long exposure."
              : "Significant health threats. Masking and indoor air filtering is strongly recommended."}
          </p>
        </div>
      </div>

      {/* Breakdowns of Individual Pollutants */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-800/60 pt-4">
        {pollutants.map((pol) => {
          const progress = getProgressPercent(components[pol.key], pol.key);
          const status = getPollutantStatus(components[pol.key], pol.key);
          return (
            <div key={pol.key} className="space-y-1.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/40">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-200">{pol.name}</span>
                <span className="text-slate-400 text-[10px]">{pol.value} {pol.unit}</span>
              </div>
              
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className={`h-full ${status.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {/* Sub-Index display */}
              <div className="flex justify-between items-center text-[9px] text-slate-500">
                <span>Sub-index: {subIndices[pol.key] || 0}</span>
                <span className="font-semibold uppercase tracking-wider">{status.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

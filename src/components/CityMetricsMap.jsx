import React from 'react';
import { Layers, ChevronRight, Activity } from 'lucide-react';
import { getAQICategory } from '../utils/api';

export default function CityMetricsMap({ cities, activeCity, onCitySelect }) {
  
  // Custom mock AQI for sidebar comparison to make it look active and populated
  const getCitySimulatedAQI = (cityName) => {
    switch (cityName) {
      case "Patna": return 242;
      case "Bhopal": return 85;
      case "Lucknow": return 188;
      case "Indore": return 68;
      case "Surat": return 125;
      case "Visakhapatnam": return 55;
      case "Jaipur": return 165;
      case "Nagpur": return 112;
      case "Coimbatore": return 42;
      case "Guwahati": return 135;
      default: return 90;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between gap-4 glass-panel-hover">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
        <Layers className="h-5 w-5 text-emerald-400" />
        <div>
          <h2 className="text-base font-bold text-slate-200">Regional Climate Monitoring</h2>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            Tier-2 Cities Comparative Hub
          </p>
        </div>
      </div>

      {/* Comparative List */}
      <div className="space-y-2.5 overflow-y-auto max-h-[360px] pr-1.5 scrollbar-thin flex-1">
        {cities.map((city) => {
          const isActive = city.name === activeCity.name;
          const simAqi = getCitySimulatedAQI(city.name);
          const aqiInfo = getAQICategory(simAqi);
          
          return (
            <div
              key={city.name}
              onClick={() => onCitySelect(city)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition duration-150 ${
                isActive
                  ? "bg-slate-900 border-emerald-500/50 shadow-md shadow-emerald-500/5"
                  : "bg-slate-900/30 border-slate-800/40 hover:border-slate-850 hover:bg-slate-900/50"
              }`}
            >
              {/* City Name & State */}
              <div className="space-y-0.5">
                <p className={`text-xs font-bold ${isActive ? "text-emerald-400" : "text-slate-200"}`}>
                  {city.name}
                </p>
                <span className="text-[9px] font-semibold text-slate-500 uppercase">
                  {city.state}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 shrink-0">
                <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${aqiInfo.bg} ${aqiInfo.color} ${aqiInfo.border}`}>
                  AQI {simAqi}
                </div>
                <ChevronRight className={`h-3.5 w-3.5 transition ${isActive ? "text-emerald-400 translate-x-0.5" : "text-slate-650"}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer statistics */}
      <div className="border-t border-slate-800/60 pt-3 flex items-center justify-between text-[9px] text-slate-500 font-semibold">
        <span className="flex items-center gap-1">
          <Activity className="h-3 w-3 text-emerald-500" /> Comparative Nodes: {cities.length}
        </span>
        <span>Simulated Broadcast: Live</span>
      </div>
    </div>
  );
}

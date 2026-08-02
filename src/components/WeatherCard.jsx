import React from 'react';
import { CloudRain, Sun, Compass, Thermometer, Droplets, ArrowUpRight, ShieldAlert } from 'lucide-react';

export default function WeatherCard({ weather }) {
  if (!weather) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-full flex items-center justify-center shimmer-bg">
        <span className="text-slate-500 text-sm">Processing weather stream...</span>
      </div>
    );
  }

  const { temp, feels_like, humidity, wind_speed, wind_deg, pressure, uvi, description, icon, cityName } = weather;

  // Custom warning based on thermal stress
  const getThermalAlert = () => {
    if (temp > 40) return { label: "Extreme Heatwave", color: "bg-red-500/10 text-red-400 border-red-500/30" };
    if (temp > 35) return { label: "High Thermal Stress", color: "bg-orange-500/10 text-orange-400 border-orange-500/30" };
    if (temp < 12) return { label: "Cold Wave Advisory", color: "bg-sky-500/10 text-sky-400 border-sky-500/30" };
    return null;
  };

  const thermalAlert = getThermalAlert();

  const getUVLevel = (val) => {
    if (val <= 2) return { label: "Low", color: "text-emerald-400" };
    if (val <= 5) return { label: "Moderate", color: "text-amber-400" };
    if (val <= 7) return { label: "High", color: "text-orange-400" };
    if (val <= 10) return { label: "Very High", color: "text-red-400" };
    return { label: "Extreme", color: "text-purple-400" };
  };

  const uvLevel = getUVLevel(uvi);

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between space-y-6 glass-panel-hover">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-bold text-slate-200">Meteorological Stream</h2>
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{cityName}</span>
      </div>

      {/* Main Temp display */}
      <div className="flex items-center justify-between py-2">
        <div className="space-y-1">
          <div className="flex items-baseline">
            <span className="text-5xl font-extrabold tracking-tighter text-white">{temp}</span>
            <span className="text-2xl font-bold text-emerald-400">°C</span>
          </div>
          <p className="text-xs text-slate-400">
            Feels like <span className="font-semibold text-slate-200">{feels_like}°C</span>
          </p>
          <p className="text-sm font-semibold capitalize text-slate-200 tracking-wide mt-1">
            {description}
          </p>
        </div>
        
        {/* Weather Icon Box */}
        <div className="relative bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-center shadow-lg">
          <img 
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`} 
            alt={description}
            className="h-16 w-16 filter drop-shadow-[0_4px_8px_rgba(16,185,129,0.2)]"
            onError={(e) => {
              // fallback if image fail
              e.target.style.display = 'none';
            }}
          />
          {/* Animated glow */}
          <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl filter blur-md"></div>
        </div>
      </div>

      {/* Thermal Alerts Banner */}
      {thermalAlert && (
        <div className={`flex items-center gap-2 border px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${thermalAlert.color}`}>
          <ShieldAlert className="h-4 w-4" />
          <span>{thermalAlert.label}</span>
        </div>
      )}

      {/* Grid of details */}
      <div className="grid grid-cols-2 gap-4 border-t border-slate-800/60 pt-4">
        {/* Humidity */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
            <Droplets className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Humidity</p>
            <p className="text-sm font-bold text-slate-200">{humidity}%</p>
          </div>
        </div>

        {/* UV Index */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <Sun className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">UV Index</p>
            <p className="text-sm font-bold text-slate-200">
              {uvi} <span className={`text-[10px] font-bold ${uvLevel.color}`}>({uvLevel.label})</span>
            </p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
            <Compass className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Wind Speed</p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-200">{wind_speed} m/s</span>
              <ArrowUpRight 
                className="h-3.5 w-3.5 text-slate-400 transition-transform duration-500"
                style={{ transform: `rotate(${wind_deg}deg)` }}
              />
            </div>
          </div>
        </div>

        {/* Barometric Pressure */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
          <div className="p-2 rounded-lg bg-slate-500/10 text-slate-400 shrink-0">
            <Thermometer className="h-4 w-4 rotate-45" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Pressure</p>
            <p className="text-sm font-bold text-slate-200">{pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
}

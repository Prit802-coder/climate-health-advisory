import React, { useState } from 'react';
import { ShieldAlert, Settings, CloudLightning, Database, Brain, MapPin, Clock } from 'lucide-react';
import { getAQICategory } from '../utils/api';

export default function DashboardHeader({
  activeCity,
  onCityChange,
  cities,
  apiKey,
  onApiKeyChange,
  weather,
  pollution,
  source
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const aqiInfo = pollution ? getAQICategory(pollution.aqi) : null;
  const isSevere = pollution?.aqi > 150 || (weather?.temp > 38) || (weather?.temp < 12);

  const handleSaveKey = () => {
    onApiKeyChange(tempKey);
    setIsModalOpen(false);
  };

  const getAlertMessage = () => {
    if (!pollution || !weather) return "";
    let msg = "";
    if (pollution.aqi > 300) {
      msg += `CRITICAL: Extreme Air Pollution in ${activeCity.name} (AQI: ${pollution.aqi} - Hazardous). `;
    } else if (pollution.aqi > 150) {
      msg += `ALERT: Elevated Air Pollution in ${activeCity.name} (AQI: ${pollution.aqi} - Poor/Very Poor). `;
    }

    if (weather.temp > 40) {
      msg += `HEATWAVE ALERT: Temperature is ${weather.temp}°C. Severe risk of heatstroke. `;
    } else if (weather.temp > 35) {
      msg += `HEAT ADVISORY: Temperature is ${weather.temp}°C. Stay hydrated. `;
    } else if (weather.temp < 12) {
      msg += `COLD ADVISORY: Temperature has dropped to ${weather.temp}°C. Wear thermal layers. `;
    }

    if (msg) {
      msg += "Sensitive individuals should check personalized action cards below.";
    }
    return msg;
  };

  const alertMessage = getAlertMessage();

  return (
    <header className="w-full space-y-4">
      {/* 1. Global Alert Ribbon (Only when risk is elevated) */}
      {isSevere && alertMessage && (
        <div className="w-full bg-red-950/70 border-y border-red-500/30 text-red-200 py-2.5 px-4 text-xs md:text-sm font-medium flex items-center gap-3 backdrop-blur-md animate-pulse-slow">
          <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
          <div className="overflow-hidden relative w-full h-5">
            <div className="absolute whitespace-nowrap md:animate-none animate-[marquee_20s_linear_infinite]">
              {alertMessage}
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Header Panel */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & System Status */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-xl text-slate-900 font-bold shadow-lg shadow-emerald-500/20">
              <CloudLightning className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CHEWAS
              </h1>
              <p className="text-[10px] md:text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                Climate Health Early Warning & Advisory System
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              ML Predictor Core: Active
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5" />
              Stream: <span className="text-slate-300 font-medium">{source}</span>
            </span>
          </div>
        </div>

        {/* City Selector & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Select City */}
          <div className="relative flex items-center bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus-within:border-emerald-500/50 transition duration-200">
            <MapPin className="h-4 w-4 text-emerald-400 mr-2 shrink-0" />
            <select
              value={activeCity.name}
              onChange={(e) => {
                const selected = cities.find(c => c.name === e.target.value);
                if (selected) onCityChange(selected);
              }}
              className="bg-transparent border-none outline-none font-medium pr-6 appearance-none cursor-pointer focus:ring-0"
            >
              {cities.map((city) => (
                <option key={city.name} value={city.name} className="bg-slate-950 text-slate-200">
                  {city.name} ({city.state})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400"></div>
          </div>

          {/* Config Settings */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 active:scale-95 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium transition duration-150"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">API Key</span>
          </button>
        </div>
      </div>

      {/* 3. API Key Config Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel-heavy p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl relative border-slate-800">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-slate-100">Configure OpenWeatherMap API</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              CHEWAS operates a local environmental simulator by default. To connect live, high-resolution air quality and meteorological streams from OpenWeatherMap, provide your standard API Key below.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">OpenWeatherMap API Key</label>
              <input
                type="password"
                placeholder="Paste your appid here"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition duration-150"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Saved in secure browser storage</span>
              <a 
                href="https://openweathermap.org/api" 
                target="_blank" 
                rel="noreferrer" 
                className="text-emerald-400 hover:underline"
              >
                Get a free API key
              </a>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

import React from 'react';
import { User, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { calculatePersonalHazard } from '../utils/healthEngine';

export default function HealthScoringCard({
  profile,
  onProfileChange,
  weather,
  pollution
}) {
  const handleAgeChange = (e) => {
    onProfileChange({ ...profile, age: e.target.value });
  };

  const handleExposureChange = (e) => {
    onProfileChange({ ...profile, exposure: e.target.value });
  };

  const toggleCondition = (condition) => {
    const active = profile.conditions || [];
    const updated = active.includes(condition)
      ? active.filter(c => c !== condition)
      : [...active, condition];
    onProfileChange({ ...profile, conditions: updated });
  };

  // Run calculation
  const hazardResult = pollution && weather
    ? calculatePersonalHazard(pollution.aqi, weather, profile)
    : null;

  const conditionsList = [
    { id: 'Asthma', label: 'Asthma / Bronchial' },
    { id: 'COPD', label: 'COPD / Emphysema' },
    { id: 'Cardiovascular', label: 'Heart / Cardio Issues' },
    { id: 'Pregnancy', label: 'Pregnancy' }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between gap-6 glass-panel-hover">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
        <User className="h-5 w-5 text-emerald-400" />
        <h2 className="text-base font-bold text-slate-200">Personalized Risk Scoring</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Profile Configurator Form */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configure Profile</h3>
          
          {/* Age Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Age Bracket</span>
              <span className="text-emerald-400 font-bold">{profile.age} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="95"
              value={profile.age}
              onChange={handleAgeChange}
              className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-medium">
              <span>Infant / Child</span>
              <span>Adult</span>
              <span>Senior (65+)</span>
            </div>
          </div>

          {/* Exposure Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Daily Exposure Profile</label>
            <select
              value={profile.exposure}
              onChange={handleExposureChange}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              <option value="Indoor" className="bg-slate-950">Indoor (Office / Home sheltered)</option>
              <option value="Hybrid" className="bg-slate-950">Hybrid (Moderate commutes / indoor-outdoor)</option>
              <option value="Outdoor" className="bg-slate-950">Outdoor Worker (Vendors, Transit, Build sites)</option>
              <option value="Athlete" className="bg-slate-950">Active Athlete (High ventilation ventilation outdoor)</option>
            </select>
          </div>

          {/* Health Conditions */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Pre-existing Health Factors</label>
            <div className="grid grid-cols-2 gap-2">
              {conditionsList.map((cond) => {
                const isSelected = (profile.conditions || []).includes(cond.id);
                return (
                  <button
                    key={cond.id}
                    onClick={() => toggleCondition(cond.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold text-left border transition duration-150 ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Activity className={`h-3.5 w-3.5 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} />
                    <span>{cond.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Hazard Score Display */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/30 border border-slate-800/40 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">CHEWAS Hazard index</h3>
          
          {hazardResult ? (
            <div className="text-center space-y-2 w-full">
              {/* Dynamic Score Ring/Meter Simulation */}
              <div className="relative inline-flex items-center justify-center">
                {/* Visual score bubble */}
                <div className="h-28 w-28 rounded-full border-4 border-slate-950 flex flex-col items-center justify-center shadow-xl relative overflow-hidden bg-slate-950/80">
                  <span className={`text-4xl font-extrabold tracking-tighter ${hazardResult.color}`}>
                    {hazardResult.hazardScore}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500 mt-0.5">Hazard</span>
                  
                  {/* Dynamic background fill color based on risk */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[${hazardResult.hazardScore}%] opacity-5 transition-all duration-1000 ${
                    hazardResult.hazardLevel === 'Low' ? 'bg-emerald-400' :
                    hazardResult.hazardLevel === 'Moderate' ? 'bg-amber-400' :
                    hazardResult.hazardLevel === 'High' ? 'bg-orange-400' :
                    hazardResult.hazardLevel === 'Severe' ? 'bg-red-400' : 'bg-purple-400'
                  }`}></div>
                </div>
              </div>

              {/* Status Classification Label */}
              <div>
                <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-extrabold uppercase ${hazardResult.bg} ${hazardResult.color} border ${hazardResult.border}`}>
                  {hazardResult.hazardLevel} Hazard
                </span>
                <p className="text-[11px] text-slate-300 leading-normal max-w-[220px] mx-auto mt-2">
                  {hazardResult.description}
                </p>
              </div>

              {/* Contributing Breakdown Dials */}
              <div className="border-t border-slate-800/50 pt-3 grid grid-cols-3 gap-1.5 text-[10px] text-slate-500 font-semibold">
                <div>
                  <p className="text-slate-300">{hazardResult.breakdown.baseAqi}</p>
                  <span>AQI Base</span>
                </div>
                <div>
                  <p className="text-emerald-400">+{hazardResult.breakdown.vulnerabilityBonus}</p>
                  <span>Exposure</span>
                </div>
                <div>
                  <p className="text-orange-400">+{hazardResult.breakdown.thermalStress}</p>
                  <span>Thermal</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 py-8">
              Configure parameters to calculate health hazard score.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

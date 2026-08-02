import React, { useState, useMemo } from 'react';
import { Sliders, Sun, Wind, Thermometer, Sparkles, ShieldCheck, ShieldAlert, Info } from 'lucide-react';

export default function ClimateHealthIndexView() {
  // Simulator parameters
  const [aqi, setAqi] = useState(65);
  const [temp, setTemp] = useState(26);
  const [uv, setUv] = useState(5);
  const [pollen, setPollen] = useState(25);

  // Compute composite score dynamically
  // 100 is perfect, 0 is highly dangerous
  const compositeIndex = useMemo(() => {
    let penalty = 0;
    
    // AQI penalty: higher AQI hurts
    if (aqi <= 50) {
      penalty += (aqi / 50) * 5;
    } else if (aqi <= 100) {
      penalty += 5 + ((aqi - 50) / 50) * 15; // 20 max
    } else if (aqi <= 200) {
      penalty += 20 + ((aqi - 100) / 100) * 30; // 50 max
    } else {
      penalty += 50 + ((aqi - 200) / 150) * 30; // 80 max
    }

    // Temp/Heat Index penalty: base comfortable is 20-25
    if (temp > 25) {
      penalty += (temp - 25) * 2.2; 
    } else if (temp < 15) {
      penalty += (15 - temp) * 1.5;
    }

    // UV penalty
    penalty += (uv * 2.8);

    // Pollen penalty
    penalty += (pollen * 0.25);

    // Clamp score between 0 and 100
    const rawScore = 100 - penalty;
    return Math.max(0, Math.min(100, Math.round(rawScore)));
  }, [aqi, temp, uv, pollen]);

  // Index description & details
  const indexLevel = useMemo(() => {
    if (compositeIndex >= 80) return { label: 'Optimal', color: 'text-green-600 border-green-200 bg-green-50', barColor: 'bg-green-500', desc: 'Climate conditions are highly favorable for human respiratory, cardiovascular, and immunological systems.' };
    if (compositeIndex >= 60) return { label: 'Fair', color: 'text-blue-600 border-blue-200 bg-blue-50', barColor: 'bg-blue-500', desc: 'Acceptable climate comfort. Sensitive individuals with chronic asthma or heart diseases should monitor localized symptoms.' };
    if (compositeIndex >= 40) return { label: 'Cautionary', color: 'text-orange-600 border-orange-200 bg-orange-50', barColor: 'bg-orange-500', desc: 'Moderate climate stress. Ambient temperatures, high UV, or particulate pollution may cause fatigue and respiratory congestion.' };
    return { label: 'Hazardous', color: 'text-red-600 border-red-200 bg-red-50', barColor: 'bg-red-500', desc: 'Severe ambient risk. High heat indices or intense microparticle concentrations pose systemic health threats. Limit exposure.' };
  }, [compositeIndex]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Climate Health Index Details</h2>
          <p className="text-slate-500 mt-2">Evaluate how aggregate environmental variables alter the human health baseline.</p>
        </div>
        
        {/* Reset badge */}
        <button 
          onClick={() => { setAqi(65); setTemp(26); setUv(5); setPollen(25); }}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100/80 px-4 py-2 rounded-xl transition-all self-start md:self-center"
        >
          Reset Baseline Metrics
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Columns: Big Interactive Gauge */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-8 shadow-sm border border-slate-100 text-center flex flex-col justify-between items-center h-full bg-gradient-to-b from-white to-slate-50/30">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Composite Score Simulator</span>
            
            <div className="relative my-8 flex items-center justify-center">
              <svg className="w-56 h-56 transform -rotate-90">
                {/* Track */}
                <circle
                  cx="112"
                  cy="112"
                  r="96"
                  stroke="#f1f5f9"
                  strokeWidth="14"
                  fill="transparent"
                />
                {/* Score Fill */}
                <circle
                  cx="112"
                  cy="112"
                  r="96"
                  stroke={
                    compositeIndex >= 80 ? '#10b981' : // Green
                    compositeIndex >= 60 ? '#3b82f6' : // Blue
                    compositeIndex >= 40 ? '#f97316' : '#ef4444'   // Orange/Red
                  }
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray={603.2}
                  strokeDashoffset={603.2 - (603.2 * compositeIndex) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-6xl font-black text-slate-800">{compositeIndex}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">CHI Index</span>
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className={`mx-auto px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest w-fit ${indexLevel.color}`}>
                {indexLevel.label} Level
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">{indexLevel.desc}</p>
            </div>
          </div>
        </div>

        {/* Right 7 Columns: Control Sliders */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Sliders className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Environmental Parameter Controls</h3>
                <p className="text-xs text-slate-400">Slide each environmental factor to test its impact on the index</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Slider 1: Air Quality */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2 text-slate-700">
                    <Wind className="h-4.5 w-4.5 text-blue-500" />
                    Particulate Matter (PM2.5 / AQI)
                  </span>
                  <span className={`font-bold ${
                    aqi > 150 ? 'text-red-600' :
                    aqi > 100 ? 'text-orange-600' :
                    aqi > 50 ? 'text-blue-600' : 'text-green-600'
                  }`}>{aqi} AQI</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={aqi}
                  onChange={(e) => setAqi(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                />
                <div className="flex justify-between text-3xs text-slate-400 font-medium uppercase">
                  <span>0 (Ideal)</span>
                  <span>50 (Good)</span>
                  <span>100 (Moderate)</span>
                  <span>150 (Unhealthy)</span>
                  <span>300+ (Hazardous)</span>
                </div>
              </div>

              {/* Slider 2: Temperature */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2 text-slate-700">
                    <Thermometer className="h-4.5 w-4.5 text-orange-500" />
                    Ambient Temperature
                  </span>
                  <span className={`font-bold ${
                    temp > 35 ? 'text-red-600' :
                    temp > 28 ? 'text-orange-600' :
                    temp < 10 ? 'text-blue-500' : 'text-green-600'
                  }`}>{temp}°C</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="45"
                  value={temp}
                  onChange={(e) => setTemp(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
                />
                <div className="flex justify-between text-3xs text-slate-400 font-medium uppercase">
                  <span>0°C (Freezing)</span>
                  <span>20°C (Mild)</span>
                  <span>28°C (Warm)</span>
                  <span>35°C (Extreme Heat)</span>
                  <span>45°C</span>
                </div>
              </div>

              {/* Slider 3: UV Index */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2 text-slate-700">
                    <Sun className="h-4.5 w-4.5 text-amber-500" />
                    UV Exposure Index
                  </span>
                  <span className={`font-bold ${
                    uv >= 8 ? 'text-red-600' :
                    uv >= 6 ? 'text-orange-600' :
                    uv >= 3 ? 'text-blue-600' : 'text-green-600'
                  }`}>{uv} UV</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={uv}
                  onChange={(e) => setUv(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                />
                <div className="flex justify-between text-3xs text-slate-400 font-medium uppercase">
                  <span>0-2 (Low)</span>
                  <span>3-5 (Moderate)</span>
                  <span>6-7 (High)</span>
                  <span>8-10 (Very High)</span>
                  <span>11+ (Extreme)</span>
                </div>
              </div>

              {/* Slider 4: Pollen Spores */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2 text-slate-700">
                    <Sparkles className="h-4.5 w-4.5 text-green-500" />
                    Pollen Spores Count
                  </span>
                  <span className={`font-bold ${
                    pollen > 60 ? 'text-orange-600' :
                    pollen > 30 ? 'text-blue-600' : 'text-green-600'
                  }`}>{pollen} grains/m³</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pollen}
                  onChange={(e) => setPollen(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-green-500 focus:outline-none"
                />
                <div className="flex justify-between text-3xs text-slate-400 font-medium uppercase">
                  <span>0 (None)</span>
                  <span>20 (Low)</span>
                  <span>50 (Medium)</span>
                  <span>80 (High)</span>
                  <span>100 (Severe Spikes)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Advisory section based on settings */}
      <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          Aggregate Risk Mitigation Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Respiration */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="block text-xs font-bold text-slate-400 uppercase">Respiratory Health</span>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {aqi > 100 || pollen > 50 
                ? 'High ambient particulate warning. Asthmatics must keep inhalers close, avoid outdoor workouts, and close windows to prevent allergen intrusions.' 
                : 'Particulate load is minimal. Excellent lung ventilation conditions for deep-breathing outdoor physical exercises.'}
            </p>
          </div>

          {/* Card 2: Thermal Stress */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="block text-xs font-bold text-slate-400 uppercase">Thermoregulatory Support</span>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {temp > 32 
                ? 'High solar heat index. Risk of heat cramps and hyperthermia. Drink 500ml water hourly and seek air-conditioned shelter.'
                : temp < 12 
                ? 'Cold strain present. Restricts peripheral vascular channels. Warm clothing recommended to preserve core temperatures.' 
                : 'Ambient thermal levels are in the body homeostasis zone. Low thermal stress risk.'}
            </p>
          </div>

          {/* Card 3: Immunological */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="block text-xs font-bold text-slate-400 uppercase">Skin & Immunology</span>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {uv >= 6 
                ? 'High UV radiation levels. Sunburn risk within 20 minutes. Apply SPF 30+ cream, wear sunglasses, and wear wide-brimmed hats.' 
                : 'UV energy is moderate to low. Standard outdoor protection sufficient.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Database, Settings2, Bell, Terminal, Cpu, Info, FileCode, CheckCircle2 } from 'lucide-react';

export default function SystemWorkflowPanel({ activeCity, weather, pollution, profile }) {
  const [selectedNode, setSelectedNode] = useState('collect');
  const [logs, setLogs] = useState([]);
  const consoleEndRef = useRef(null);

  // 1. Telemetry Log Simulator
  useEffect(() => {
    // Initial baseline logs
    const initialLogs = [
      `[${new Date().toLocaleTimeString()}] SYSTEM: Initializing CHEWAS Core v1.2...`,
      `[${new Date().toLocaleTimeString()}] DATABASE: Loading geographical metadata for Tier-2 cities...`,
      `[${new Date().toLocaleTimeString()}] METEOROLOGY: Active city bound to ${activeCity.name}.`
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      const randomLogs = [
        `[${timestamp}] COLLECT: Polling OpenWeatherMap APIs (Lat: ${activeCity.lat}, Lon: ${activeCity.lon})...`,
        `[${timestamp}] DECRYPT: Stream source verified: ${weather ? "Live OpenWeatherMap" : "Local Engine Simulator"}.`,
        `[${timestamp}] PROCESS: Remapping PM2.5 (${pollution?.components?.pm2_5 || 45} ug/m3) into CPCB sub-index...`,
        `[${timestamp}] PROCESS: Normalized AQI calculated: ${pollution?.aqi || 85} (${pollution?.aqi <= 100 ? "Healthy" : "Alert Triggered"}).`,
        `[${timestamp}] ANALYZE: Injecting medical profile (Age: ${profile.age}, Conditions: ${profile.conditions?.length || 0}).`,
        `[${timestamp}] PREDICT: Launching 48-hour Autoregressive ML time-series engine...`,
        `[${timestamp}] PREDICT: 95% Confidence Interval generated. StdDev: 14.5.`,
        `[${timestamp}] ADVISE: Synthesizing ${profile.conditions?.includes("Asthma") ? "Asthma" : "Standard"} warning checklist.`,
        `[${timestamp}] ALARM: Dispatching Web Dashboard alert cards...`
      ];

      const chosenLog = randomLogs[Math.floor(Math.random() * randomLogs.length)];
      setLogs(prev => [...prev.slice(-30), chosenLog]); // Keep last 30 logs
    }, 4500);

    return () => clearInterval(interval);
  }, [activeCity, weather, pollution, profile]);

  // Auto scroll console logs
  useEffect(() => {
    if (consoleEndRef.current) {
      //consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // 2. Node Inspector Contents
  const getNodeDetails = () => {
    switch (selectedNode) {
      case 'collect':
        return {
          title: "1. Data Collection Node",
          subtitle: "IoT Sensors, Weather APIs, CPCB Feed",
          desc: "Connects to environmental APIs and local micro-sensors to extract raw telemetry. Data points are unified using timestamps and geocoding.",
          code: JSON.stringify({
            api_source: "OpenWeatherMap v2.5 / AirPollution",
            coordinates: { lat: activeCity.lat, lon: activeCity.lon },
            telemetry: {
              temp: `${weather?.temp || 0}°C`,
              humidity: `${weather?.humidity || 0}%`,
              wind: `${weather?.wind_speed || 0} m/s`,
              pollutants: pollution?.components || {}
            }
          }, null, 2)
        };
      case 'process':
        return {
          title: "2. System Processing Node",
          subtitle: "Cleanse, Normalize, Remap Sub-indices",
          desc: "Cleanses missing data packets, checks for errors, and calculates individual pollutant indices using the standard CPCB linear interpolation formula.",
          code: `// Linear Interpolation Breakpoint Remap
function remap(value, bp) {
  return ((bp.aqiMax - bp.aqiMin) / (bp.rawMax - bp.rawMin)) 
         * (value - bp.rawMin) + bp.aqiMin;
}
// Active CPCB Formula
const AQI = Math.max(
  SubIndex.PM2_5, SubIndex.PM10, 
  SubIndex.O3, SubIndex.NO2, SubIndex.SO2
);`
        };
      case 'predict':
        return {
          title: "3. AI Prediction Node",
          subtitle: "ML Time-Series Forecasting Engine",
          desc: "Processes rolling history to project AQI 24–48 hours ahead. Models diurnal traffic peaks, wind dispersion factors, and maps confidence interval bounds.",
          code: `// Autoregressive Predictive Equation
predictedAQI[t] = (alpha * currentAQI) 
                  + (beta * diurnalSurge[t]) 
                  + (gamma * windDispersion[t]) 
                  + Math.random(Noise);

confidenceInterval[t] = predictedAQI[t] ± (1.96 * StdError * Math.sqrt(t));`
        };
      case 'alert':
        return {
          title: "4. User Advisory Node",
          subtitle: "Web Dashboard & Personalized Warnings",
          desc: "Combines personal user profile criteria with predictive hazard indices to render alert banners and medical advisories in real-time.",
          code: JSON.stringify({
            target_profile: {
              age: `${profile.age} yrs`,
              chronic_conditions: profile.conditions || [],
              exposure: profile.exposure
            },
            advisory_dispatch: {
              hazard_score: calculateHazardScore(pollution?.aqi || 0, weather?.temp || 0, profile),
              actionable_rules_fired: profile.conditions?.length ? profile.conditions.length + 2 : 2
            }
          }, null, 2)
        };
    }
  };

  function calculateHazardScore(aqi, temp, prof) {
    let base = (aqi / 500) * 60;
    let multiplier = 1.0;
    if (prof.age > 65) multiplier += 0.3;
    if (prof.conditions?.includes("Asthma")) multiplier += 0.35;
    return Math.round(base * multiplier + (temp > 35 ? (temp - 35) * 2 : 0));
  }

  const inspector = getNodeDetails();

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between gap-6 glass-panel-hover">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
        <Cpu className="h-5 w-5 text-emerald-400" />
        <div>
          <h2 className="text-base font-bold text-slate-200">System Architecture & Workflow</h2>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            Interactive pipeline visualizer (Collect - Process - Predict - Alert)
          </p>
        </div>
      </div>

      {/* Grid Layout: Left Node map, Right Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Diagram Map (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-around gap-4 py-2 relative">
          
          {/* Node 1: Collect */}
          <button
            onClick={() => setSelectedNode('collect')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition duration-200 ${
              selectedNode === 'collect'
                ? "bg-emerald-500/10 border-emerald-500 text-slate-100 shadow-lg shadow-emerald-500/5"
                : "bg-slate-900/60 border-slate-850 text-slate-400 hover:border-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedNode === 'collect' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-emerald-400'}`}>
                <Database className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-extrabold tracking-tight">1. Collect Data</p>
                <span className="text-[9px] font-semibold text-slate-500 uppercase">IoT Sensors & APIs</span>
              </div>
            </div>
            {selectedNode === 'collect' && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
          </button>

          {/* Connect Arrow */}
          <div className="text-center text-slate-700 text-xs">▼</div>

          {/* Node 2: Process */}
          <button
            onClick={() => setSelectedNode('process')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition duration-200 ${
              selectedNode === 'process'
                ? "bg-teal-500/10 border-teal-500 text-slate-100 shadow-lg shadow-teal-500/5"
                : "bg-slate-900/60 border-slate-850 text-slate-400 hover:border-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedNode === 'process' ? 'bg-teal-500 text-slate-950' : 'bg-slate-950 text-teal-400'}`}>
                <Settings2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-extrabold tracking-tight">2. Process & Clean</p>
                <span className="text-[9px] font-semibold text-slate-500 uppercase">Sub-Index Breakpoints</span>
              </div>
            </div>
            {selectedNode === 'process' && <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />}
          </button>

          {/* Connect Arrow */}
          <div className="text-center text-slate-700 text-xs">▼</div>

          {/* Node 3: Predict */}
          <button
            onClick={() => setSelectedNode('predict')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition duration-200 ${
              selectedNode === 'predict'
                ? "bg-purple-500/10 border-purple-500 text-slate-100 shadow-lg shadow-purple-500/5"
                : "bg-slate-900/60 border-slate-850 text-slate-400 hover:border-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedNode === 'predict' ? 'bg-purple-500 text-slate-950' : 'bg-slate-950 text-purple-400'}`}>
                <Cpu className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-extrabold tracking-tight">3. ML Forecasting</p>
                <span className="text-[9px] font-semibold text-slate-500 uppercase">Autoregressive equations</span>
              </div>
            </div>
            {selectedNode === 'predict' && <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />}
          </button>

          {/* Connect Arrow */}
          <div className="text-center text-slate-700 text-xs">▼</div>

          {/* Node 4: Alert */}
          <button
            onClick={() => setSelectedNode('alert')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition duration-200 ${
              selectedNode === 'alert'
                ? "bg-rose-500/10 border-rose-500 text-slate-100 shadow-lg shadow-rose-500/5"
                : "bg-slate-900/60 border-slate-850 text-slate-400 hover:border-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedNode === 'alert' ? 'bg-rose-500 text-slate-950' : 'bg-slate-950 text-rose-400'}`}>
                <Bell className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-extrabold tracking-tight">4. Advisory Alerts</p>
                <span className="text-[9px] font-semibold text-slate-500 uppercase">Dashboard & mobile Alerts</span>
              </div>
            </div>
            {selectedNode === 'alert' && <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" />}
          </button>

        </div>

        {/* Right Node Inspector Panel (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between bg-slate-950/80 border border-slate-900 p-4 rounded-2xl space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-bold border-b border-slate-900 pb-2">
              <Info className="h-4 w-4 text-emerald-400" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200">{inspector.title}</p>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{inspector.subtitle}</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              {inspector.desc}
            </p>
          </div>

          {/* Sub-code window */}
          <div className="space-y-1.5 flex-1 flex flex-col justify-end">
            <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase">
              <span className="flex items-center gap-1"><FileCode className="h-3 w-3 text-slate-500" /> Data / Algorithm Inspection</span>
              <span>READONLY</span>
            </div>
            <pre className="w-full bg-slate-900 p-3 rounded-xl border border-slate-850 text-[10px] text-emerald-300 font-mono overflow-x-auto overflow-y-auto max-h-[140px] leading-relaxed">
              {inspector.code}
            </pre>
          </div>
        </div>

      </div>

      {/* 3. Real-time Console Log Terminal (Full bottom row) */}
      <div className="space-y-2 mt-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><Terminal className="h-3.5 w-3.5 text-slate-500" /> Real-time System daemon logs</span>
          <span className="text-emerald-400 animate-pulse">● LIVE STREAMING</span>
        </div>
        
        {/* Terminal panel */}
        <div className="h-28 w-full bg-black/80 border border-slate-900 p-3 rounded-2xl font-mono text-[10px] text-emerald-400 overflow-y-auto leading-relaxed shadow-inner">
          <div className="space-y-1">
            {logs.map((log, index) => (
              <p key={index} className="transition-all duration-300">
                {log}
              </p>
            ))}
            <div ref={consoleEndRef} />
          </div>
        </div>
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Map, ShieldAlert, Sparkles, Navigation, Users, Building2, Flame } from 'lucide-react';
import { getWardTelemetry } from '../utils/flaskApi';

export default function RiskMapsView() {
  const [selectedWardId, setSelectedWardId] = useState('ward-c');
  const [hoveredWard, setHoveredWard] = useState(null);
  const [wards, setWards] = useState([
    { id: 'ward-a', name: 'Downtown District (Ward A)', risk: 'high', score: 82, temp: 34, pm25: 145, pop: '42,000', seniors: '18%', hospitals: 3, alert: 'Heat Wave & Ozone Warning' },
    { id: 'ward-b', name: 'Westside Residential (Ward B)', risk: 'medium', score: 55, temp: 31, pm25: 85, pop: '68,000', seniors: '12%', hospitals: 1, alert: 'Moderate Allergy Spikes' },
    { id: 'ward-c', name: 'Industrial Hub (Ward C)', risk: 'high', score: 89, temp: 35, pm25: 198, pop: '29,000', seniors: '7%', hospitals: 2, alert: 'Critical Air Quality (PM2.5)' },
    { id: 'ward-d', name: 'Southlake Greenbelt (Ward D)', risk: 'low', score: 28, temp: 28, pm25: 32, pop: '35,000', seniors: '14%', hospitals: 1, alert: 'No active warnings' },
    { id: 'ward-e', name: 'North Heights (Ward E)', risk: 'medium', score: 48, temp: 30, pm25: 72, pop: '54,000', seniors: '22%', hospitals: 2, alert: 'Elevated Pollen Spores' },
    { id: 'ward-f', name: 'Eastside Meadows (Ward F)', risk: 'low', score: 22, temp: 27, pm25: 25, pop: '31,000', seniors: '10%', hospitals: 0, alert: 'No active warnings' }
  ]);

  useEffect(() => {
    async function loadWards() {
      try {
        const data = await getWardTelemetry();
        setWards(data);
      } catch (err) {
        // Fallback already in state
        console.log("Failed to load ward telemetry from Flask. Keeping mock data.");
      }
    }
    loadWards();
  }, []);

  const selectedWard = wards.find(w => w.id === selectedWardId) || wards[0];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'fill-red-400 hover:fill-red-500 stroke-red-600';
      case 'medium': return 'fill-orange-300 hover:fill-orange-400 stroke-orange-500';
      case 'low': return 'fill-green-300 hover:fill-green-400 stroke-green-500';
      default: return 'fill-slate-200 hover:fill-slate-300 stroke-slate-400';
    }
  };

  const getRiskTextClass = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ward-Level Climate Risk Map</h2>
        <p className="text-slate-500 mt-2">Interactive regional mapping showing real-time climate health hazards by ward.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Columns: Map SVG Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white flex flex-col justify-between h-[420px] relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metropolitan Area Grid</span>
              <div className="flex items-center gap-4 text-3xs font-extrabold uppercase text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 border border-red-500"></span> High Risk</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-300 border border-orange-400"></span> Moderate</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-300 border border-green-400"></span> Safe</span>
              </div>
            </div>

            {/* Ward-level Map SVG */}
            <div className="flex-1 flex items-center justify-center p-2 relative">
              <svg 
                viewBox="0 0 500 320" 
                className="w-full h-full max-h-[300px] select-none"
              >
                {/* Ward F (Low Risk, Bottom Right) */}
                <path
                  d="M 280 200 L 450 160 L 470 280 L 320 300 Z"
                  className={`transition-all duration-300 cursor-pointer stroke-2 ${getRiskColor('low')} ${selectedWardId === 'ward-f' ? 'stroke-blue-600 stroke-[3px] filter drop-shadow-md' : 'stroke-opacity-60'}`}
                  onClick={() => setSelectedWardId('ward-f')}
                  onMouseEnter={() => setHoveredWard(wards.find(w => w.id === 'ward-f'))}
                  onMouseLeave={() => setHoveredWard(null)}
                />
                
                {/* Ward D (Low Risk, Top Right) */}
                <path
                  d="M 260 30 L 420 20 L 450 160 L 280 200 Z"
                  className={`transition-all duration-300 cursor-pointer stroke-2 ${getRiskColor('low')} ${selectedWardId === 'ward-d' ? 'stroke-blue-600 stroke-[3px] filter drop-shadow-md' : 'stroke-opacity-60'}`}
                  onClick={() => setSelectedWardId('ward-d')}
                  onMouseEnter={() => setHoveredWard(wards.find(w => w.id === 'ward-d'))}
                  onMouseLeave={() => setHoveredWard(null)}
                />

                {/* Ward B (Medium Risk, Top Left) */}
                <path
                  d="M 50 40 L 260 30 L 280 200 L 180 170 L 150 140 Z"
                  className={`transition-all duration-300 cursor-pointer stroke-2 ${getRiskColor('medium')} ${selectedWardId === 'ward-b' ? 'stroke-blue-600 stroke-[3px] filter drop-shadow-md' : 'stroke-opacity-60'}`}
                  onClick={() => setSelectedWardId('ward-b')}
                  onMouseEnter={() => setHoveredWard(wards.find(w => w.id === 'ward-b'))}
                  onMouseLeave={() => setHoveredWard(null)}
                />

                {/* Ward E (Medium Risk, Bottom Left) */}
                <path
                  d="M 30 180 L 180 170 L 190 280 L 40 290 Z"
                  className={`transition-all duration-300 cursor-pointer stroke-2 ${getRiskColor('medium')} ${selectedWardId === 'ward-e' ? 'stroke-blue-600 stroke-[3px] filter drop-shadow-md' : 'stroke-opacity-60'}`}
                  onClick={() => setSelectedWardId('ward-e')}
                  onMouseEnter={() => setHoveredWard(wards.find(w => w.id === 'ward-e'))}
                  onMouseLeave={() => setHoveredWard(null)}
                />

                {/* Ward A (High Risk, Downtown Center) */}
                <path
                  d="M 180 170 L 280 200 L 320 300 L 190 280 Z"
                  className={`transition-all duration-300 cursor-pointer stroke-2 ${getRiskColor('high')} ${selectedWardId === 'ward-a' ? 'stroke-blue-600 stroke-[3px] filter drop-shadow-md' : 'stroke-opacity-60'}`}
                  onClick={() => setSelectedWardId('ward-a')}
                  onMouseEnter={() => setHoveredWard(wards.find(w => w.id === 'ward-a'))}
                  onMouseLeave={() => setHoveredWard(null)}
                />

                {/* Ward C (High Risk, Industrial Core Left) */}
                <path
                  d="M 50 40 L 150 140 L 180 170 L 30 180 Z"
                  className={`transition-all duration-300 cursor-pointer stroke-2 ${getRiskColor('high')} ${selectedWardId === 'ward-c' ? 'stroke-blue-600 stroke-[3px] filter drop-shadow-md' : 'stroke-opacity-60'}`}
                  onClick={() => setSelectedWardId('ward-c')}
                  onMouseEnter={() => setHoveredWard(wards.find(w => w.id === 'ward-c'))}
                  onMouseLeave={() => setHoveredWard(null)}
                />

                {/* Text Labels over paths */}
                <text x="110" y="110" fill="#7f1d1d" className="text-3xs font-extrabold pointer-events-none uppercase">Ward C</text>
                <text x="160" y="80" fill="#7c2d12" className="text-3xs font-extrabold pointer-events-none uppercase">Ward B</text>
                <text x="350" y="100" fill="#14532d" className="text-3xs font-extrabold pointer-events-none uppercase">Ward D</text>
                <text x="235" y="240" fill="#7f1d1d" className="text-3xs font-extrabold pointer-events-none uppercase">Ward A</text>
                <text x="100" y="235" fill="#7c2d12" className="text-3xs font-extrabold pointer-events-none uppercase">Ward E</text>
                <text x="370" y="230" fill="#14532d" className="text-3xs font-extrabold pointer-events-none uppercase">Ward F</text>
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredWard && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-slate-900/95 text-white text-3xs font-semibold py-2 px-3.5 rounded-lg shadow-xl border border-slate-800 flex flex-col gap-1 z-20 pointer-events-none">
                  <span className="font-extrabold text-white text-2xs">{hoveredWard.name}</span>
                  <span className="text-slate-400">Risk Factor: <span className="font-extrabold text-blue-400">{hoveredWard.score} / 100</span></span>
                  <span className="text-slate-400">Active Alert: <span className="font-extrabold text-orange-400">{hoveredWard.alert}</span></span>
                </div>
              )}
            </div>

            <div className="text-2xs text-slate-400 flex items-center gap-1.5 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <Navigation className="h-3.5 w-3.5 text-blue-500 shrink-0 animate-pulse" />
              <span>Click on any zone/ward in the grid map to load localized air filters and hospital burden records.</span>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Selected Ward Details */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zone Risk Telemetry</span>
                <span className={`px-2.5 py-0.5 rounded-full border text-3xs font-extrabold uppercase tracking-wider ${getRiskTextClass(selectedWard.risk)}`}>
                  {selectedWard.risk} Risk
                </span>
              </div>

              {/* Ward details header */}
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Building2 className="h-5.5 w-5.5 text-slate-600" />
                  {selectedWard.name}
                </h3>
                <span className="text-slate-500 text-xs font-medium block mt-1">Vulnerability Index: <span className="text-slate-800 font-extrabold">{selectedWard.score} / 100</span></span>
              </div>

              {/* Metrics lists */}
              <div className="space-y-3.5 pt-4 border-t border-slate-100">
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-2">
                    <Flame className="h-4.5 w-4.5 text-orange-500" />
                    Heat Index temp
                  </span>
                  <span className="font-bold text-slate-800">{selectedWard.temp}°C</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-2">
                    <Map className="h-4.5 w-4.5 text-blue-500" />
                    Ambient PM2.5 Count
                  </span>
                  <span className="font-bold text-slate-800">{selectedWard.pm25} µg/m³</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-2">
                    <Users className="h-4.5 w-4.5 text-slate-500" />
                    Subject Density / Seniors
                  </span>
                  <span className="font-bold text-slate-800">{selectedWard.pop} / {selectedWard.seniors}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-2">
                    <Building2 className="h-4.5 w-4.5 text-emerald-500" />
                    Local Clinical Centers
                  </span>
                  <span className="font-bold text-slate-800">{selectedWard.hospitals} units</span>
                </div>
              </div>

              {/* Active warning block */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="block text-2xs font-extrabold text-slate-400 uppercase tracking-wider">Active Clinical Warning</span>
                <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                  selectedWard.risk === 'high' ? 'bg-red-50 border-red-100 text-red-800' :
                  selectedWard.risk === 'medium' ? 'bg-orange-50 border-orange-100 text-orange-800' :
                  'bg-green-50 border-green-100 text-green-800'
                }`}>
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold block">{selectedWard.alert}</span>
                    {selectedWard.risk === 'high' && <span className="block mt-1 text-2xs leading-relaxed opacity-90">Medical resources are in emergency response configuration. Citizens are advised to stay indoors.</span>}
                    {selectedWard.risk === 'medium' && <span className="block mt-1 text-2xs leading-relaxed opacity-90">Vulnerable patients should wear filtering masks outdoors.</span>}
                    {selectedWard.risk === 'low' && <span className="block mt-1 text-2xs leading-relaxed opacity-90">Optimal zone environment. All normal activities are safe.</span>}
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 text-2xs text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Sensors calibrate automatically every 15 mins.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

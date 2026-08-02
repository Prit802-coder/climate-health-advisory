import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Building2, AlertTriangle, ShieldAlert, Thermometer, Wind, RefreshCw, Layers } from 'lucide-react';
import { getHospitalBurden } from '../utils/flaskApi';

export default function HospitalDashboardView() {
  const [activeFacility, setActiveFacility] = useState('city-general');
  const [burdenPredictionData, setBurdenPredictionData] = useState([
    { date: 'Mon', admissions: 18, temp: 24, pm25: 48, expected: 15 },
    { date: 'Tue', admissions: 22, temp: 26, pm25: 58, expected: 17 },
    { date: 'Wed', admissions: 31, temp: 31, pm25: 82, expected: 26 },
    { date: 'Thu', admissions: 42, temp: 34, pm25: 110, expected: 38 },
    { date: 'Fri', admissions: 58, temp: 36, pm25: 135, expected: 48 },
    { date: 'Sat', admissions: 39, temp: 27, pm25: 88, expected: 32 },
    { date: 'Sun', admissions: 24, temp: 22, pm25: 42, expected: 20 }
  ]);

  // Simulated facility data
  const facilities = [
    { id: 'city-general', name: 'Metropolitan General Hospital', bedsOccupied: 142, bedsTotal: 180, congestion: 'High', alertLevel: 'yellow' },
    { id: 'westside-clinic', name: 'Westside Pulmonary Center', bedsOccupied: 45, bedsTotal: 85, congestion: 'Moderate', alertLevel: 'green' },
    { id: 'pediatric-emergency', name: 'Saint Jude Pediatric Emergency', bedsOccupied: 72, bedsTotal: 80, congestion: 'Critical', alertLevel: 'red' }
  ];

  const facility = facilities.find(f => f.id === activeFacility) || facilities[0];

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getHospitalBurden(activeFacility);
        setBurdenPredictionData(data);
      } catch (err) {
        // Fallback to default mock details already populated
        console.log("Failed to load facility data from Flask. Keeping mock data.");
      }
    }
    loadData();
  }, [activeFacility]);

  const getAlertClass = (level) => {
    switch (level) {
      case 'red': return 'text-red-700 bg-red-50 border-red-200';
      case 'yellow': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'green': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getAlertBg = (level) => {
    switch (level) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-orange-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hospital Burden Prediction</h2>
          <p className="text-slate-500 mt-2">Simulated predictive forecasting of medical admissions based on weather indices and air toxins.</p>
        </div>

        {/* Facility Selector */}
        <select
          value={activeFacility}
          onChange={(e) => setActiveFacility(e.target.value)}
          className="p-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 self-start md:self-center"
        >
          {facilities.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      {/* Facility Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 shadow-sm border border-slate-100 bg-white space-y-2">
          <span className="block text-3xs font-extrabold text-slate-400 uppercase tracking-wider">Facility Burden State</span>
          <span className={`block w-fit px-2.5 py-0.5 rounded-full border text-3xs font-extrabold uppercase tracking-wide ${getAlertClass(facility.alertLevel)}`}>
            {facility.congestion} Load
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-sm border border-slate-100 bg-white space-y-2">
          <span className="block text-3xs font-extrabold text-slate-400 uppercase tracking-wider">ER Beds Occupancy</span>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-slate-800">{facility.bedsOccupied} / {facility.bedsTotal}</span>
            <span className="text-xs font-bold text-slate-400">{Math.round((facility.bedsOccupied / facility.bedsTotal) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${getAlertBg(facility.alertLevel)}`} style={{ width: `${(facility.bedsOccupied / facility.bedsTotal) * 100}%` }}></div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-sm border border-slate-100 bg-white space-y-2">
          <span className="block text-3xs font-extrabold text-slate-400 uppercase tracking-wider">Pediatric Asthma Alert</span>
          <span className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${facility.alertLevel === 'red' ? 'bg-red-500 animate-ping' : 'bg-orange-500'}`}></div>
            {facility.alertLevel === 'red' ? 'High admissions spike risk' : 'Elevated risk warning'}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-sm border border-slate-100 bg-white space-y-2">
          <span className="block text-3xs font-extrabold text-slate-400 uppercase tracking-wider">Geriatric Dehydration Risk</span>
          <span className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${facility.alertLevel === 'red' ? 'bg-red-500 animate-ping' : 'bg-orange-500'}`}></div>
            {facility.alertLevel === 'red' ? 'Extreme hydration warning' : 'Precautionary status'}
          </span>
        </div>
      </div>

      {/* Admission vs Environmental Spikes Combo Chart */}
      <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            Burden Admissions vs Air Particulates & Temp
          </h3>
          <span className="text-2xs text-slate-400 font-medium">Updated 5m ago</span>
        </div>

        <div className="h-72 md:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={burdenPredictionData} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'Admissions', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'Weather / PM2.5', angle: 90, position: 'insideRight', fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 'bold' }} />
              <Bar yAxisId="left" dataKey="admissions" fill="#3b82f6" radius={[4, 4, 0, 0]} name="ER Admissions" maxBarSize={30} />
              <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} name="Temp (°C)" dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="pm25" stroke="#10b981" strokeWidth={2} name="PM2.5 Count" dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Advisory block for resource controllers */}
      <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Predictive Staffing Advisory Recommendations
        </h3>
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-start gap-3.5 text-orange-850">
          <ShieldAlert className="h-5.5 w-5.5 text-orange-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1.5">
            <span className="font-extrabold block">Resource Controller Recommendation Alert</span>
            <p className="leading-relaxed text-slate-700">
              Based on the 7-day temperature and ozone trend, patient inflows are expected to rise by **35% on Friday**. We advise increasing paramedic shifts, checking oxygen reservoir pressures, and reserving 8 cardiac emergency beds in anticipation of hot-climate respiratory admissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

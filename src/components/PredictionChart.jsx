import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BrainCircuit, LineChart, ShieldCheck } from 'lucide-react';

export default function PredictionChart({ forecastData }) {
  const [chartType, setChartType] = useState('aqi'); // 'aqi' or 'hazard'

  if (!forecastData || forecastData.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-[380px] flex items-center justify-center shimmer-bg">
        <span className="text-slate-500 text-sm">Synthesizing time-series prediction models...</span>
      </div>
    );
  }

  // Filter or process tick intervals for readability (e.g., show every 6th label on X-axis)
  const formatXAxis = (tickItem, index) => {
    // Show only every 6th label
    if (index % 6 === 0) {
      // Split "Today 09:00 AM" to "Today 9 AM" or "09:00 AM"
      return tickItem.replace(" AM", "a").replace(" PM", "p").replace("00:00", "12");
    }
    return "";
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950/95 border border-slate-800 p-3 rounded-xl shadow-2xl space-y-1.5 text-xs text-slate-300">
          <p className="font-bold text-slate-100 border-b border-slate-800/80 pb-1 flex items-center justify-between gap-6">
            <span>{data.time}</span>
            <span className="text-[10px] text-slate-500 font-semibold">{data.dateStr}</span>
          </p>
          
          {chartType === 'aqi' ? (
            <div className="space-y-1">
              <p className="flex justify-between items-center gap-4">
                <span>Predicted AQI:</span>
                <span className="font-extrabold text-emerald-400">{data.aqi}</span>
              </p>
              <p className="flex justify-between items-center text-[10px] text-slate-500">
                <span>95% CI Range:</span>
                <span className="font-bold text-slate-400">{data.aqiLower} – {data.aqiUpper}</span>
              </p>
              <p className="text-[10px] text-slate-400 capitalize mt-1 italic">
                Weather: {data.description} ({data.temp}°C, {data.humidity}% RH)
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="flex justify-between items-center gap-4">
                <span>Hazard Score:</span>
                <span className="font-extrabold text-purple-400">{data.healthHazard} / 100</span>
              </p>
              <p className="flex justify-between items-center text-[10px] text-slate-500">
                <span>Risk Level:</span>
                <span className="font-bold text-slate-400 uppercase tracking-wider">{data.hazardLevel}</span>
              </p>
              <p className="flex justify-between items-center gap-4 text-[10px] text-slate-400">
                <span>Correlated AQI:</span>
                <span className="font-bold text-slate-300">{data.aqi}</span>
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between space-y-4 glass-panel-hover">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-slate-200">AI-Powered Forecasting Core</h2>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Time-series Predictive modeling (48h Horizon)
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 self-start sm:self-center">
          <button
            onClick={() => setChartType('aqi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
              chartType === 'aqi'
                ? "bg-slate-900 border border-slate-800 text-emerald-400 shadow-md"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <LineChart className="h-3.5 w-3.5" />
            <span>AQI Forecast</span>
          </button>
          <button
            onClick={() => setChartType('hazard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
              chartType === 'hazard'
                ? "bg-slate-900 border border-slate-800 text-purple-400 shadow-md"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Health Hazard</span>
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-[260px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'aqi' ? (
            <AreaChart
              data={forecastData}
              margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
            >
              <defs>
                {/* AQI Line Gradient */}
                <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                {/* Confidence Interval Gradient */}
                <linearGradient id="colorCi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.06}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.12)" />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis} 
                stroke="#64748b" 
                fontSize={10}
                fontWeight="semibold"
                dy={8}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                fontWeight="semibold"
                domain={[0, 450]} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference Lines for Standard Breakpoints */}
              <ReferenceLine y={100} stroke="rgba(245, 158, 11, 0.15)" strokeDasharray="3 3" />
              <ReferenceLine y={200} stroke="rgba(249, 115, 22, 0.2)" strokeDasharray="3 3" />
              <ReferenceLine y={300} stroke="rgba(239, 68, 68, 0.25)" strokeDasharray="3 3" />

              {/* Confidence Interval Shaded Area */}
              <Area 
                type="monotone" 
                dataKey="aqiUpper" 
                stroke="transparent" 
                fill="url(#colorCi)" 
                fillId="colorCi"
              />
              <Area 
                type="monotone" 
                dataKey="aqiLower" 
                stroke="transparent" 
                fill="#0b0f19" // masks base of graph
                fillOpacity={0.9}
              />
              
              {/* Shaded Area between bounds is achieved by Area charting the upper, and mapping lower to cover */}
              {/* Let's draw the main line Area */}
              <Area
                type="monotone"
                dataKey="aqi"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAqi)"
              />
            </AreaChart>
          ) : (
            <AreaChart
              data={forecastData}
              margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorHazard" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.12)" />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis} 
                stroke="#64748b" 
                fontSize={10} 
                fontWeight="semibold"
                dy={8}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                fontWeight="semibold"
                domain={[0, 100]} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Alert thresholds for health score */}
              <ReferenceLine y={35} stroke="rgba(249, 115, 22, 0.2)" strokeDasharray="3 3" />
              <ReferenceLine y={55} stroke="rgba(239, 68, 68, 0.25)" strokeDasharray="3 3" />
              <ReferenceLine y={75} stroke="rgba(168, 85, 247, 0.3)" strokeDasharray="3 3" />

              <Area
                type="monotone"
                dataKey="healthHazard"
                stroke="#a855f7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHazard)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-800/40">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded bg-emerald-500"></span> Predicted Trend
          </span>
          {chartType === 'aqi' && (
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded bg-teal-500/25"></span> 95% Confidence Band
            </span>
          )}
        </div>
        <span>Model Refresh Rate: 60 min intervals</span>
      </div>
    </div>
  );
}

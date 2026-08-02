import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sun, CloudRain, Cloud, CloudLightning, Snowflake, CloudFog, Sunrise, Sunset, Heart, Calendar } from 'lucide-react';

export default function ForecastView() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Mock 7-day forecast data with weather and health indices
  const forecastData = [
    { day: 'Mon', index: 82, temp: 24, aqi: 48, uv: 4, allergen: 'Low', condition: 'sunny', desc: 'Mild temperatures and clean air.' },
    { day: 'Tue', index: 76, temp: 26, aqi: 58, uv: 6, allergen: 'Medium', condition: 'sunny', desc: 'Warm day with rising pollen.' },
    { day: 'Wed', index: 59, temp: 31, aqi: 82, uv: 8, allergen: 'High', condition: 'sunrise', desc: 'High thermal heat loading and allergen spikes.' },
    { day: 'Thu', index: 44, temp: 34, aqi: 110, uv: 9, allergen: 'High', condition: 'cloudy', desc: 'Ozone accumulation and high particulate matter.' },
    { day: 'Fri', index: 38, temp: 36, aqi: 135, uv: 10, allergen: 'Very High', condition: 'thunderstorm', desc: 'Severe heat index combined with thunder-induced asthma risk.' },
    { day: 'Sat', index: 65, temp: 27, aqi: 88, uv: 5, allergen: 'Medium', condition: 'rainy', desc: 'Showers washing out airborne particulate matter.' },
    { day: 'Sun', index: 88, temp: 22, aqi: 42, uv: 4, allergen: 'Low', condition: 'sunset', desc: 'Cool breeze and excellent air purification post-rain.' }
  ];

  const selectedDay = forecastData[selectedDayIndex];

  // Helper to render weather icons
  const getWeatherIcon = (condition, className = "h-6 w-6") => {
    switch (condition) {
      case 'sunny': return <Sun className={`${className} text-amber-500`} />;
      case 'rainy': return <CloudRain className={`${className} text-blue-500`} />;
      case 'cloudy': return <Cloud className={`${className} text-slate-400`} />;
      case 'thunderstorm': return <CloudLightning className={`${className} text-orange-500`} />;
      case 'snow': return <Snowflake className={`${className} text-sky-400`} />;
      case 'fog': return <CloudFog className={`${className} text-slate-400`} />;
      case 'sunrise': return <Sunrise className={`${className} text-amber-500`} />;
      case 'sunset': return <Sunset className={`${className} text-orange-400`} />;
      default: return <Sun className={`${className} text-amber-500`} />;
    }
  };

  const getIndexColor = (val) => {
    if (val >= 80) return 'text-green-600';
    if (val >= 60) return 'text-blue-600';
    if (val >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getIndexBg = (val) => {
    if (val >= 80) return 'bg-green-500';
    if (val >= 60) return 'bg-blue-500';
    if (val >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">7-Day Climate Health Forecast</h2>
        <p className="text-slate-500 mt-2">Check the upcoming climate-health risk trends to plan travel and sports activities safely.</p>
      </div>

      {/* Recharts Chart Panel */}
      <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Weekly Climate Health Index Trend
        </h3>
        
        <div className="h-64 md:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="index" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIndex)" name="Health Index" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Day cards & Day details panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Day selection list */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
          {forecastData.map((d, index) => {
            const isSelected = selectedDayIndex === index;
            return (
              <button
                key={d.day}
                onClick={() => setSelectedDayIndex(index)}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected 
                    ? 'border-blue-500 bg-white ring-2 ring-blue-500/20 shadow-md transform -translate-y-1' 
                    : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <div>
                    <span className="block text-sm font-bold text-slate-800">{d.day}day</span>
                    <span className="block text-2xs text-slate-400 mt-0.5">{d.temp}°C / {d.aqi} AQI</span>
                  </div>
                  {getWeatherIcon(d.condition, "h-7 w-7")}
                </div>

                <div className="mt-6 flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-400">Health Index</span>
                    <span className={`text-2xl font-black ${getIndexColor(d.index)}`}>{d.index}</span>
                  </div>
                  <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${getIndexBg(d.index)}`} style={{ width: `${d.index}%` }}></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Day Detail panel */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Advisory Details</span>
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {selectedDay.day}day Forecast
                </span>
              </div>

              {/* Forecast state summary */}
              <div className="flex items-center gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl animate-float-slow">
                  {getWeatherIcon(selectedDay.condition, "h-10 w-10")}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 capitalize">{selectedDay.condition} Conditions</h4>
                  <span className={`text-2xl font-black ${getIndexColor(selectedDay.index)}`}>{selectedDay.index} <span className="text-xs font-bold text-slate-400">CHI Score</span></span>
                </div>
              </div>

              {/* Metric specifications */}
              <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-slate-100">
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  <span className="block text-3xs font-extrabold text-slate-400 uppercase">Est Temperature</span>
                  <span className="text-sm font-bold text-slate-700 mt-0.5">{selectedDay.temp}°C</span>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  <span className="block text-3xs font-extrabold text-slate-400 uppercase">Particulates (AQI)</span>
                  <span className="text-sm font-bold text-slate-700 mt-0.5">{selectedDay.aqi}</span>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  <span className="block text-3xs font-extrabold text-slate-400 uppercase">UV radiation</span>
                  <span className="text-sm font-bold text-slate-700 mt-0.5">{selectedDay.uv} / 12</span>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  <span className="block text-3xs font-extrabold text-slate-400 uppercase">Aeroallergens</span>
                  <span className="text-sm font-bold text-slate-700 mt-0.5">{selectedDay.allergen}</span>
                </div>
              </div>

              {/* Bio-impact note */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="block text-xs font-bold text-slate-400 uppercase">Impact Assessment</span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{selectedDay.desc}</p>
              </div>
            </div>

            {/* Bottom advice link */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 bg-blue-50/30 p-3 rounded-xl text-blue-800">
              <Heart className="h-4.5 w-4.5 text-blue-600 fill-blue-600/10 shrink-0" />
              <span className="text-2xs font-semibold leading-relaxed">Ensure you adjust your daily routines when the CHI score drops below 60.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

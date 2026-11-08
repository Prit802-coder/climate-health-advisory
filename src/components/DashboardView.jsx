import React, { useEffect, useState, useMemo } from "react";
import {
  getWeather,
  getHourlyForecast,
  getRiskAssessment
} from "../services/api";
import { Shield, Activity, Calendar, Clock, AlertTriangle, CheckCircle2, User, Briefcase, Plus, Heart } from 'lucide-react';

export default function DashboardView({ weatherData, currentCity, currentUser }) {

 const [healthData, setHealthData] = useState(null);
 const [weatherLoading, setWeatherLoading] = useState(false);
 const [weatherError, setWeatherError] = useState('');

 const [hourlyForecast, setHourlyForecast] = useState([]);
const [forecastLoading, setForecastLoading] = useState(false);
const [forecastError, setForecastError] = useState('');
const [riskCalculation, setRiskCalculation] = useState({
  score: 0,
  level: 'Calculating',
  color: 'text-slate-500 bg-slate-50 border-slate-200',
  ring: 'border-slate-300',
  modifiers: []
});
const [riskLoading, setRiskLoading] = useState(false);
const [riskError, setRiskError] = useState('');

  useEffect(() => {
  if (!currentCity) return;

  setWeatherLoading(true);
  setWeatherError('');

  getWeather(currentCity)
    .then((data) => {
      setHealthData(data);
    })
    .catch((error) => {
      console.error('Weather API error:', error);
      setWeatherError('Unable to load live weather data.');
      setHealthData(null);
    })
    .finally(() => {
      setWeatherLoading(false);
    });
}, [currentCity]);

useEffect(() => {
  if (!currentCity) return;

  setForecastLoading(true);
  setForecastError('');

  getHourlyForecast(currentCity)
    .then((data) => {
      setHourlyForecast(Array.isArray(data) ? data : []);
    })
    .catch((error) => {
      console.error('Hourly forecast API error:', error);
      setForecastError('Unable to load forecast data.');
      setHourlyForecast([]);
    })
    .finally(() => {
      setForecastLoading(false);
    });
}, [currentCity]);

  // Personalized Risk Profile State
  const [profile, setProfile] = useState({
    age: currentUser?.age || 32,
    occupation: currentUser?.occupation || 'indoor', // 'indoor' or 'outdoor'
    conditions: {
      asthma: Boolean(currentUser?.conditions?.asthma),
      cardiovascular: Boolean(currentUser?.conditions?.cardiovascular),
      allergies: currentUser?.conditions?.allergies !== undefined ? Boolean(currentUser.conditions.allergies) : true,
      copd: Boolean(currentUser?.conditions?.copd)
    }
  });

  // Sync profile when logged in user changes
  useEffect(() => {
    if (currentUser) {
      setProfile(p => ({
        ...p,
        age: currentUser.age || p.age,
        occupation: currentUser.occupation || p.occupation,
        conditions: {
          asthma: Boolean(currentUser.conditions?.asthma),
          cardiovascular: Boolean(currentUser.conditions?.cardiovascular),
          allergies: Boolean(currentUser.conditions?.allergies),
          copd: Boolean(currentUser.conditions?.copd)
        }
      }));
    }
  }, [currentUser]);

  // Planned Activity State
  const [plannerActivity, setPlannerActivity] = useState('jogging');
  const [plannerTime, setPlannerTime] = useState('');
  const [plannerDuration, setPlannerDuration] = useState('60');

  // Trigger values from weatherData or defaults
  const aqi = healthData?.aqi ?? weatherData?.aqi ?? 68;
  const temp = healthData?.temperature ?? weatherData?.temperature ?? 24;
  const uv = healthData?.uv ?? weatherData?.uv ?? 4;
  const humidity = healthData?.humidity ?? weatherData?.humidity ?? 62;
  const wind = healthData?.wind_speed ?? weatherData?.wind_speed ?? 0;
  const condition = healthData?.condition ?? weatherData?.condition ?? "Clear";

  // 1. Personalized Risk Calculation
  // Personalized Risk Assessment from FastAPI
useEffect(() => {
  let isActive = true;

  const calculateRisk = async () => {
    setRiskLoading(true);
    setRiskError('');

    try {
      const profileData = {
        age: Number(profile.age),
        occupation: profile.occupation,
        conditions: profile.conditions
      };

      const environmentalData = {
        aqi: Number(aqi),
        temp: Number(temp),
        uv: Number(uv),
        humidity: Number(humidity),
        pollen: Number(healthData?.pollen ?? 0)
      };

      const result = await getRiskAssessment(
        profileData,
        environmentalData
      );

      if (isActive) {
        setRiskCalculation(result);
      }
    } catch (error) {
      console.error('Risk Assessment API error:', error);

      if (isActive) {
        setRiskError('Unable to calculate risk. Please check backend connection.');
      }
    } finally {
      if (isActive) {
        setRiskLoading(false);
      }
    }
  };

  calculateRisk();

  return () => {
    isActive = false;
  };
}, [profile, aqi, temp, uv, humidity, healthData]);

  // Hourly slots for Safe Time Planner
 // Upcoming 3-hour forecast slots from the backend
const hourlySlots = useMemo(() => {
  const now = new Date();

  return hourlyForecast
    .map((item) => {
      // OpenWeather forecast timestamps are UTC
      const forecastDate = new Date(
        `${item.datetime.replace(' ', 'T')}Z`
      );

      return {
        value: forecastDate.toISOString(),
        time: forecastDate.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        label: forecastDate.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
        temp: item.temp,
        aqi: aqi,
        uv: uv,
        wind: item.wind_speed,
        condition: item.condition,
        humidity: item.humidity,
        rainProbability: item.rain_probability,
      };
    })
    .filter((slot) => new Date(slot.value) >= now)
    .slice(0, 6);
}, [hourlyForecast, aqi, uv]);

// Automatically select the first available forecast slot
useEffect(() => {
  if (hourlySlots.length > 0) {
    setPlannerTime((previous) =>
      hourlySlots.some((slot) => slot.value === previous)
        ? previous
        : hourlySlots[0].value
    );
  }
}, [hourlySlots]);

  // Helper to evaluate health risk of a specific slot
  const getSlotSafety = (slot) => {
    let penalty = 0;
    
    // Add weather factors
    penalty += (slot.aqi / 2.5);
    penalty += (slot.temp > 27 ? (slot.temp - 27) * 4 : 0);
    penalty += (slot.uv * 5);

    // Apply profile weight
    if (profile.conditions.asthma && slot.aqi > 60) penalty += 25;
    if (profile.conditions.allergies && slot.temp > 25) penalty += 10;
    if (profile.occupation === 'outdoor') penalty += 10;
    if (profile.age > 65) penalty += 15;

    if (penalty > 65) return { status: 'Critical', color: 'bg-red-500', text: 'Avoid outdoors', desc: 'High pollutant & thermal loading.' };
    if (penalty > 40) return { status: 'Caution', color: 'bg-orange-400', text: 'Caution advised', desc: 'Moderate risk. Wear protection/mask.' };
    return { status: 'Safe', color: 'bg-green-500', text: 'Highly safe', desc: 'Excellent time for activities.' };
  };

  const handleConditionChange = (cond) => {
    setProfile(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [cond]: !prev.conditions[cond]
      }
    }));
  };

  // Planned Activity Advice
  const plannerAdvice = useMemo(() => {
  const activeSlot =
    hourlySlots.find((slot) => slot.value === plannerTime) ||
    hourlySlots[0] || {
      time: '--:--',
      label: 'Waiting for forecast',
      temp: temp,
      aqi: aqi,
      uv: uv,
      wind: wind,
      condition: condition,
    };

  const safety = getSlotSafety(activeSlot);

  let activityNote = '';

  if (plannerActivity === 'jogging') {
    activityNote = safety.status === 'Safe'
      ? 'Conditions appear favorable for outdoor activity. Stay hydrated.'
      : 'Environmental conditions may increase breathing strain. Consider indoor cardio.';
  } else if (plannerActivity === 'outdoor_work') {
    activityNote = safety.status === 'Safe'
      ? 'Conditions appear favorable for outdoor work. Stay hydrated.'
      : 'Take regular breaks in the shade and stay hydrated.';
  } else {
    activityNote = safety.status === 'Safe'
      ? 'Conditions appear favorable for light travel.'
      : 'Consider limiting unnecessary outdoor exposure.';
  }

  return {
    safety,
    note: activityNote,
    slot: activeSlot,
  };
}, [plannerTime, plannerActivity, profile, hourlySlots, aqi, uv, temp, wind, condition]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro section */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Personalized Dashboard</h2>
        <p className="text-slate-500 mt-2">Adjust your biological risk parameters to evaluate real-time climate impacts in {currentCity}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Configurator and Planner */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card 1: Risk Assessment Profile */}
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">1. Bio-Risk Profile Configurator</h3>
                <p className="text-xs text-slate-400">Biological vulnerabilities that affect environment susceptibility</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Form: Demographics */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex justify-between">
                    <span>Age of Subject</span>
                    <span className="text-blue-600 font-bold">{profile.age} years</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="90"
                    value={profile.age}
                    onChange={(e) => setProfile(p => ({ ...p, age: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-2xs text-slate-400 mt-1">
                    <span>Child (1-12)</span>
                    <span>Adult</span>
                    <span>Senior (65+)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Exposure Environment</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setProfile(p => ({ ...p, occupation: 'indoor' }))}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                        profile.occupation === 'indoor'
                          ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-semibold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Briefcase className="h-4 w-4" />
                      Indoor Desk
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile(p => ({ ...p, occupation: 'outdoor' }))}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                        profile.occupation === 'outdoor'
                          ? 'border-orange-500 bg-orange-50/50 text-orange-600 font-semibold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Activity className="h-4 w-4" />
                      Field Work
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Form: Health Conditions */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pre-Existing Conditions</label>
                <p className="text-2xs text-slate-400 mb-3">Check all that apply. Multiple selections aggregate vulnerability factors.</p>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { key: 'asthma', name: 'Asthma / Bronchial Hyperresponsiveness' },
                    { key: 'cardiovascular', name: 'Cardiovascular / Heart Disease' },
                    { key: 'allergies', name: 'Seasonal Allergies (Pollen/Spores)' },
                    { key: 'copd', name: 'COPD (Pulmonary Insufficiency)' }
                  ].map((cond) => (
                    <label
                      key={cond.key}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                        profile.conditions[cond.key]
                          ? 'border-blue-200 bg-blue-50/20 text-blue-800'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={profile.conditions[cond.key]}
                        onChange={() => handleConditionChange(cond.key)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4.5 w-4.5"
                      />
                      <span className="text-xs font-medium">{cond.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Safe Time Activity Planner */}
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">2. Safe Time Planner</h3>
                <p className="text-xs text-slate-400">Match your activities with the safest environmental windows</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Settings Form */}
              <div className="space-y-4 md:col-span-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Planned Activity</label>
                  <select
                    value={plannerActivity}
                    onChange={(e) => setPlannerActivity(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="jogging">Cardio Run / Jogging</option>
                    <option value="outdoor_work">Physical Outdoor Labor</option>
                    <option value="commute">Commute / Walk / Cycling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Target Time</label>
                  <select
                    value={plannerTime}
                    onChange={(e) => setPlannerTime(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {hourlySlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label} - {slot.time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Duration</label>
                  <select
                    value={plannerDuration}
                    onChange={(e) => setPlannerDuration(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="120">2 Hours</option>
                    <option value="240">4+ Hours</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Assessment Outcome */}
              <div className="md:col-span-2 bg-slate-50/70 border border-slate-100 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                  <span className="text-xs font-bold text-slate-500 uppercase">Assessment Outcome</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase tracking-wide flex items-center gap-1 ${
                    plannerAdvice.safety.status === 'Safe' ? 'bg-green-100 text-green-700' :
                    plannerAdvice.safety.status === 'Caution' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {plannerAdvice.safety.status === 'Safe' && <CheckCircle2 className="h-3 w-3" />}
                    {plannerAdvice.safety.status === 'Caution' && <AlertTriangle className="h-3 w-3" />}
                    {plannerAdvice.safety.status === 'Critical' && <AlertTriangle className="h-3 w-3 text-red-600" />}
                    {plannerAdvice.safety.text}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    {plannerActivity.replace('_', ' ').toUpperCase()} at {plannerAdvice.slot.time} ({plannerAdvice.slot.label})
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{plannerAdvice.note}</p>
                  <p className="text-2xs text-slate-400 italic mt-1">{plannerAdvice.safety.desc}</p>
                  <p className="text-xs text-slate-500 text-center">
                    Forecast condition: {plannerAdvice.slot.condition || 'Unavailable'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-white rounded-lg p-3 border border-slate-100">
                  <div className="text-center">
                    <span className="block text-2xs text-slate-400 font-medium">Temp</span>
                    <span className="text-xs font-bold text-slate-800">{plannerAdvice.slot.temp}°C</span>
                  </div>
                  <div className="text-center border-x border-slate-100">
                    <span className="block text-2xs text-slate-400 font-medium">Current AQI</span>
                    <span className="text-xs font-bold text-slate-800">{plannerAdvice.slot.aqi}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xs text-slate-400 font-medium">Current UV</span>
                    <span className="text-xs font-bold text-slate-800">{plannerAdvice.slot.uv} / 10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Slider Timeline */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">24-Hour Climate Risk Track</span>
              <div className="grid grid-cols-6 gap-2">
                {hourlySlots.map((s) => {
                  const evalRes = getSlotSafety(s);
                 const isSelected = plannerTime === s.value;
                  return (
                    <button
                      key={s.time}
                      onClick={() => setPlannerTime(s.time)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-white ring-2 ring-blue-500/20' 
                          : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block text-2xs font-extrabold text-slate-700">{s.time}</span>
                      <span className="block text-3xs text-slate-400 mt-0.5">{s.temp}°C</span>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
                        <div className={`h-full ${evalRes.color}`} style={{ width: '100%' }}></div>
                      </div>
                      <span className="block text-3xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">{evalRes.status}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Health Risk Assessment Metrics Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full bg-gradient-to-b from-white to-slate-50/50">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio-Risk Report Card</span>
              </div>

              {/* Ring Score Metric */}
              <div className="flex flex-col items-center justify-center my-6">
                <div className="relative flex items-center justify-center">
                  {/* Outer circle track */}
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      stroke="#f1f5f9"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      stroke={
                       riskCalculation?.score ?? 0
                      }
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={389.5}
                      strokeDashoffset={389.5 - (389.5 * riskCalculation.score) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-slate-800">{riskCalculation.score}</span>
                    <span className="text-2xs font-extrabold text-slate-400 tracking-widest uppercase">Score</span>
                  </div>
                </div>

                <div className={`mt-4 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${riskCalculation.color}`}>
                  <div className={`w-2 h-2 rounded-full ${
                    riskCalculation.score > 70 ? 'bg-red-500' :
                    riskCalculation.score > 45 ? 'bg-orange-500' : 'bg-green-500'
                  }`} />
                  {riskCalculation.level} Vulnerability
                </div>
              </div>

              {/* Aggregated vulnerability details */}
              <div className="space-y-3.5 pt-4 border-t border-slate-100">
                <span className="block text-2xs font-bold text-slate-400 uppercase tracking-wider">Active Risk Multipliers</span>
                {(riskCalculation?.modifiers || []).length > 0 ? (
                  <div className="space-y-2">
                    {(riskCalculation?.modifiers || []).map((mod, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span className="p-0.5 rounded-full bg-orange-100 text-orange-600 mt-0.5">
                          <AlertTriangle className="h-3 w-3" />
                        </span>
                        <span className="text-xs font-semibold text-slate-700 leading-snug">{mod}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 text-green-600">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    <span className="text-xs font-semibold">No active multipliers. Health profile represents optimal threshold tolerance.</span>
                  </div>
              )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 bg-blue-50/30 p-4.5 rounded-xl border border-blue-50 text-slate-700 text-xs leading-relaxed space-y-2">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase">
                <Heart className="h-4.5 w-4.5 fill-blue-600/10 text-blue-600" />
                Medical Disclaimer
              </div>
              <p className="text-2xs text-slate-500 leading-relaxed">
                ClimaCare AI predictions are mathematical correlations based on historical epidemiological data. They do not constitute diagnostic medical advice. Consult local physicians for medical regimens.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

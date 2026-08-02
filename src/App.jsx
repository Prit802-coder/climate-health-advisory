import { getWeather } from "./api/weather";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sun, Wind, Thermometer, Sparkles, Search, Menu, X, Shield, Clock, Calendar, 
  Map, Brain, AlertCircle, Building2, HelpCircle, Heart, ChevronRight, LogIn, UserPlus
} from 'lucide-react';

// Subcomponents / Views
import DashboardView from './components/DashboardView';
import ClimateHealthIndexView from './components/ClimateHealthIndexView';
import ForecastView from './components/ForecastView';
import RiskMapsView from './components/RiskMapsView';
import AIAssistantView from './components/AIAssistantView';
import CitizenReportsView from './components/CitizenReportsView';
import HospitalDashboardView from './components/HospitalDashboardView';
import AboutView from './components/AboutView';

// High-quality Weather backgrounds (Unsplash)
const WEATHER_HERO_IMAGES = {
  sunny: 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?auto=format&fit=crop&w=1600&q=80',
  rainy: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1600&q=80',
  cloudy: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1600&q=80',
  thunderstorm: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=1600&q=80',
  snow: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1600&q=80',
  fog: 'https://images.unsplash.com/photo-1494007485290-ce668e189d9a?auto=format&fit=crop&w=1600&q=80',
  sunrise: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80',
  sunset: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=1600&q=80'
};

// Mock cities telemetry database
const CITY_DATABASE = {
  'New Delhi': { temp: 34, aqi: 165, uv: 8, allergen: 'High', healthIndex: 42, condition: 'sunny', desc: 'Extreme smog and heat waves present. Outward exposure should be minimized.' },
  'Chicago': { temp: 18, aqi: 42, uv: 2, allergen: 'Low', healthIndex: 92, condition: 'cloudy', desc: 'Mild temperatures and clean air. Excellent baseline safety indicators.' },
  'London': { temp: 15, aqi: 35, uv: 1, allergen: 'Low', healthIndex: 88, condition: 'rainy', desc: 'Brisk, moist conditions. High allergy protection.' },
  'Tokyo': { temp: 26, aqi: 55, uv: 6, allergen: 'Medium', healthIndex: 78, condition: 'sunrise', desc: 'Moderate pollen levels. Safe for outdoor commute.' },
  'Sydney': { temp: 22, aqi: 28, uv: 4, allergen: 'Low', healthIndex: 94, condition: 'sunny', desc: 'Optimal ocean breeze with minimal particulate pollutants.' },
  'Paris': { temp: 20, aqi: 62, uv: 3, allergen: 'Medium', healthIndex: 81, condition: 'sunset', desc: 'Fair condition. Mild ozone levels.' },

  'Ahmedabad': {
    temp: 32,
    aqi: 70,
    uv: 8,
    allergen: 'Medium',
    healthIndex: 75,
    condition: 'sunny',
    desc: 'High temperature conditions. Stay hydrated and avoid long exposure.'}
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Choose random weather condition on startup
  const [weatherCondition, setWeatherCondition] = useState('sunny');
  useEffect(() => {
    const keys = Object.keys(WEATHER_HERO_IMAGES);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setWeatherCondition(randomKey);
  }, []);

  // Selected City details
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCityName, setCurrentCityName] = useState('New Delhi');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentCityData = useMemo(() => {
    return CITY_DATABASE[currentCityName] || CITY_DATABASE['New Delhi'];
  }, [currentCityName]);

  // Suggestions search list
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    return Object.keys(CITY_DATABASE).filter(c => 
      c.toLowerCase().includes(searchQuery.toLowerCase()) && c.toLowerCase() !== currentCityName.toLowerCase()
    );
  }, [searchQuery, currentCityName]);

 const handleSelectCity = async (city) => {
  setLoading(true);

  try {
    const data = await getWeather(city);

    console.log(data);

    setWeatherData(data);
    setCurrentCityName(data.city);

    setSearchQuery("");
    setShowSuggestions(false);
  } catch (err) {
    console.error(err);
    alert("City not found");
  } finally {
    setLoading(false);
  }
};
  // Weather Icon renderer helper
  const getWeatherIcon = (cond) => {
    switch (cond) {
      case 'sunny': return <Sun className="h-6 w-6 text-amber-500 animate-spin-slow" />;
      case 'cloudy': return <Sun className="h-6 w-6 text-slate-400" />;
      case 'rainy': return <Wind className="h-6 w-6 text-blue-400" />;
      default: return <Sparkles className="h-6 w-6 text-amber-400" />;
    }
  };

  // Index Color indicator
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

  // Navbar list
  const NAV_ITEMS = [
    { name: 'Home', icon: <Sun className="h-4.5 w-4.5" /> },
    { name: 'Dashboard', icon: <Clock className="h-4.5 w-4.5" /> },
    { name: 'Climate Health Index', icon: <Shield className="h-4.5 w-4.5" /> },
    { name: 'Forecast', icon: <Calendar className="h-4.5 w-4.5" /> },
    { name: 'Risk Maps', icon: <Map className="h-4.5 w-4.5" /> },
    { name: 'AI Assistant', icon: <Brain className="h-4.5 w-4.5" /> },
    { name: 'Citizen Reports', icon: <AlertCircle className="h-4.5 w-4.5" /> },
    { name: 'Hospital Dashboard', icon: <Building2 className="h-4.5 w-4.5" /> },
    { name: 'About', icon: <HelpCircle className="h-4.5 w-4.5" /> }
  ];

  return (
    <div className="relative min-h-screen pb-16 bg-slate-50/50 text-slate-800 flex flex-col font-sans overflow-x-hidden">
      
      {/* Background Glowing Blobs for Premium Glassmorphism Look */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none animate-glow-1"></div>
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-green-400/5 rounded-full blur-[120px] pointer-events-none animate-glow-2"></div>
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-orange-400/5 rounded-full blur-[90px] pointer-events-none animate-glow-3"></div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setActiveTab('Home')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-emerald-500 to-orange-400 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="block font-black text-base text-slate-900 tracking-tight">ClimaCare AI</span>
              <span className="block text-3xs font-extrabold text-slate-400 tracking-widest uppercase">Health Advisory</span>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.name}
                onClick={() => { setActiveTab(item.name); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === item.name
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>

          {/* Login / Auth Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all">
              <LogIn className="h-4.5 w-4.5" />
              Log In
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm">
              <UserPlus className="h-4.5 w-4.5" />
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-lg px-4 pt-2.5 pb-6 space-y-2 shadow-lg animate-slide-in">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.name}
                onClick={() => { setActiveTab(item.name); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === item.name
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              <button className="flex items-center justify-center gap-2 py-3 border border-slate-250 text-slate-700 font-bold text-xs rounded-xl">
                <LogIn className="h-4.5 w-4.5" /> Log In
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white font-bold text-xs rounded-xl">
                <UserPlus className="h-4.5 w-4.5" /> Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'Home' ? (
          <div className="space-y-12 pb-12">
            
            {/* FULL-WIDTH HERO SECTION */}
            <div className="relative w-full h-[380px] md:h-[460px] flex items-center justify-center text-center overflow-hidden shadow-md">
              
              {/* Background Weather Image */}
              <img 
                src={WEATHER_HERO_IMAGES[weatherCondition] || WEATHER_HERO_IMAGES.sunny}
                alt="Weather background"
                className="absolute inset-0 w-full h-full object-cover transform scale-102 filter blur-2xs transition-all duration-1000"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/80"></div>
              
              {/* Overlay Particles for weather effects */}
              {weatherCondition === 'rainy' && (
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="w-full h-full animate-rain-drop bg-[linear-gradient(transparent,rgba(255,255,255,0.4))] bg-[length:1.5px_40px]"></div>
                </div>
              )}
              {weatherCondition === 'snow' && (
                <div className="absolute inset-0 pointer-events-none opacity-30">
                  <div className="w-full h-full animate-snow-flake bg-radial-gradient"></div>
                </div>
              )}

              {/* Centered Hero Content */}
              <div className="relative max-w-4xl mx-auto px-4 z-10 space-y-6 flex flex-col items-center">
                <span className="text-3xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  ClimaCare Early Warning System Active
                </span>
                
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-2xl">
                  Personalized Advisory for Climate-Health Risks
                </h1>
                
                <p className="text-slate-200 text-xs md:text-sm font-medium max-w-lg leading-relaxed">
                  Enter your city to evaluate localized AQI particulate levels, heat stresses, UV indexes, and predicted cardiac pressures.
                </p>

                {/* ACCUWEATHER-STYLE CENTERED SEARCH BAR */}
                <div className="relative w-full max-w-md mt-4">
                  <div className="flex items-center bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-250/50 p-1">
                    <div className="pl-3.5 text-slate-400 shrink-0">
                      <Search className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search city (e.g. New Delhi, London, Tokyo)..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-full p-3.5 bg-transparent border-none text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0"
                    />
                    <button 
                      onClick={() => searchQuery && handleSelectCity(searchQuery)}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
                    >
                      Search
                    </button>
                  </div>

                  {/* Suggestions List Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute top-[105%] left-0 w-full bg-white rounded-2xl border border-slate-100 shadow-2xl z-30 overflow-hidden py-1.5 animate-fade-in">
                      {filteredSuggestions.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleSelectCity(item)}
                          className="w-full text-left px-5 py-3 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-between"
                        >
                          <span>{item}</span>
                          <ChevronRight className="h-4.5 w-4.5 text-slate-350" />
                        </button>
                      ))}
                    </div>
                  )}
                  {showSuggestions && searchQuery && filteredSuggestions.length === 0 && !CITY_DATABASE[searchQuery] && (
                    <div className="absolute top-[105%] left-0 w-full bg-white rounded-2xl border border-slate-150 shadow-2xl z-30 p-4 text-center text-xs font-medium text-slate-400">
                      No results for "{searchQuery}". Try Ahmedabad, Delhi, Mumbai, London, or Tokyo.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* BELOW HERO: 3 PREMIUM CARDS GRID */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Card 1: Climate Health Index (0-100) */}
                <div 
                  onClick={() => setActiveTab('Climate Health Index')}
                  className="glass-card rounded-2xl p-6 shadow-md border border-slate-200/40 bg-white glass-card-hover cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="block text-3xs font-extrabold text-slate-400 uppercase tracking-widest">Climate Health Index</span>
                      <h3 className="text-lg font-black text-slate-800 mt-0.5">{currentCityName} baseline</h3>
                    </div>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <Shield className="h-5.5 w-5.5" />
                    </div>
                  </div>

                  {/* Circular visual Dial representation */}
                  <div className="flex items-center gap-5 my-5">
                    <div className="relative flex items-center justify-center">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                        <circle 
                          cx="40" 
                          cy="40" 
                          r="32" 
                          stroke={
                            currentCityData.healthIndex >= 80 ? '#10b981' :
                            currentCityData.healthIndex >= 60 ? '#3b82f6' :
                            currentCityData.healthIndex >= 40 ? '#f97316' : '#ef4444'
                          } 
                          strokeWidth="6" 
                          fill="transparent" 
                          strokeDasharray={201.1} 
                          strokeDashoffset={201.1 - (201.1 * currentCityData.healthIndex) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xl font-black text-slate-800">{currentCityData.healthIndex}</span>
                    </div>

                    <div className="space-y-1">
                      <span className={`text-sm font-extrabold ${getIndexColor(currentCityData.healthIndex)}`}>
                        {currentCityData.healthIndex >= 80 ? 'Optimal Safety' :
                         currentCityData.healthIndex >= 60 ? 'Fair Status' :
                         currentCityData.healthIndex >= 40 ? 'Moderate Alert' : 'Hazardous Inflow'}
                      </span>
                      <p className="text-3xs text-slate-400 font-semibold leading-relaxed line-clamp-2">
                        {currentCityData.desc}
                      </p>
                    </div>
                  </div>

                  <span className="text-3xs font-bold text-blue-600 flex items-center gap-1 mt-1 group">
                    Detailed index breakdown <ChevronRight className="h-3 w-3" />
                  </span>
                </div>

                {/* Card 2: AI Health Advisory Summary */}
                <div 
                  onClick={() => setActiveTab('AI Assistant')}
                  className="glass-card rounded-2xl p-6 shadow-md border border-slate-200/40 bg-white glass-card-hover cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="block text-3xs font-extrabold text-slate-400 uppercase tracking-widest">AI Health Advisory</span>
                      <h3 className="text-lg font-black text-slate-800 mt-0.5">Clinical Climate Alert</h3>
                    </div>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Brain className="h-5.5 w-5.5" />
                    </div>
                  </div>

                  <div className="my-4 bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-3xs text-slate-650 leading-relaxed space-y-1.5">
                    <span className="font-extrabold text-slate-700 block uppercase tracking-wider">AI Medical Directive:</span>
                    <p className="line-clamp-3">
                      {currentCityData.healthIndex < 60 
                        ? 'Particulate PM2.5 threshold warnings active. Citizens with cardiac histories are directed to stay indoors, activate filtration systems, and avoid early morning jogs.' 
                        : 'Ambient weather conditions are highly stable. Favorable for open air commute, light athletic practices, and deep ventilation exercises.'}
                    </p>
                  </div>

                  <span className="text-3xs font-bold text-emerald-600 flex items-center gap-1 group">
                    Open Clinical Chat Companion <ChevronRight className="h-3 w-3" />
                  </span>
                </div>

                {/* Card 3: 7-Day Climate Health Forecast Preview */}
                <div 
                  onClick={() => setActiveTab('Forecast')}
                  className="glass-card rounded-2xl p-6 shadow-md border border-slate-200/40 bg-white glass-card-hover cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="block text-3xs font-extrabold text-slate-400 uppercase tracking-widest">7-Day Climate Forecast</span>
                      <h3 className="text-lg font-black text-slate-800 mt-0.5">Weekly safety track</h3>
                    </div>
                    <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">
                      <Calendar className="h-5.5 w-5.5" />
                    </div>
                  </div>

                  {/* Spark bar representation of next 5 days */}
                  <div className="grid grid-cols-5 gap-1.5 my-6">
                    {[
                      { d: 'M', v: 82, cond: 'sunny' },
                      { d: 'T', v: 76, cond: 'sunny' },
                      { d: 'W', v: 59, cond: 'sunrise' },
                      { d: 'T', v: 44, cond: 'cloudy' },
                      { d: 'F', v: 38, cond: 'thunderstorm' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <span className="text-3xs font-bold text-slate-400">{item.d}</span>
                        <div className="w-1.5 h-10 bg-slate-100 rounded-full flex items-end">
                          <div className={`w-full rounded-full ${getIndexBg(item.v)}`} style={{ height: `${item.v}%` }}></div>
                        </div>
                        <span className={`text-3xs font-black ${getIndexColor(item.v)}`}>{item.v}</span>
                      </div>
                    ))}
                  </div>

                  <span className="text-3xs font-bold text-orange-600 flex items-center gap-1 mt-1 group">
                    Inspect weekly weather charts <ChevronRight className="h-3 w-3" />
                  </span>
                </div>

              </div>
            </div>

            {/* Quick Overview Metrics Row */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6">
              <div className="glass-card rounded-2xl p-5 shadow-sm border border-slate-100 bg-white grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Thermometer className="h-5.5 w-5.5 animate-pulse" />
                  </div>
                  <div>
                    <span className="block text-3xs font-extrabold text-slate-400 uppercase tracking-widest">Ambient Temp</span>
                    <span className="text-base font-black text-slate-800">{currentCityData.temp}°C</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l border-slate-100 pl-4 md:pl-6">
                  <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                    <Wind className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="block text-3xs font-extrabold text-slate-400 uppercase tracking-widest">Ambient AQI</span>
                    <span className="text-base font-black text-slate-800">{currentCityData.aqi} AQI</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l border-slate-100 pl-4 md:pl-6">
                  <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
                    <Sun className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="block text-3xs font-extrabold text-slate-400 uppercase tracking-widest">UV radiation</span>
                    <span className="text-base font-black text-slate-800">{currentCityData.uv} / 12</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l border-slate-100 pl-4 md:pl-6">
                  <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl">
                    <Sparkles className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="block text-3xs font-extrabold text-slate-400 uppercase tracking-widest">Allergens</span>
                    <span className="text-base font-black text-slate-800">{currentCityData.allergen}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
              <div className="text-center space-y-2 mb-8">
                <span className="text-3xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit mx-auto">Features Grid</span>
                <h2 className="text-2xl font-black text-slate-800">Explore Main Modules</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Personal Risk Config', desc: 'Biological vulnerability inputs for custom safety scores.', tab: 'Dashboard', icon: <UserPlus className="h-5 w-5 text-blue-600" /> },
                  { title: 'Ward-Level Risk Maps', desc: 'Interactive geographic visualization by metropolitan zone.', tab: 'Risk Maps', icon: <Map className="h-5 w-5 text-green-600" /> },
                  { title: 'Hospital Burden Stats', desc: 'Predictive admissions based on weather pollutants.', tab: 'Hospital Dashboard', icon: <Building2 className="h-5 w-5 text-orange-500" /> },
                  { title: 'Citizen Symptom Feed', desc: 'Intake form and reporting stream for local anomalies.', tab: 'Citizen Reports', icon: <AlertCircle className="h-5 w-5 text-red-500" /> }
                ].map((f, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveTab(f.tab)}
                    className="p-5 rounded-2xl border border-slate-100 bg-white shadow-xs hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl w-fit mb-4">
                        {f.icon}
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-800">{f.title}</h4>
                      <p className="text-3xs text-slate-400 font-semibold leading-relaxed mt-1.5">{f.desc}</p>
                    </div>
                    <span className="text-3xs font-extrabold text-blue-600 flex items-center gap-0.5 mt-4 group-hover:translate-x-1 transition-transform">
                      Launch Module <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-200/40 bg-white/90 backdrop-blur-md shadow-sm">
              {activeTab === 'Dashboard' && (
  <DashboardView 
    weatherData={weatherData} 
    currentCity={currentCityName} 
  />
)}

{activeTab === 'Climate Health Index' && (
  <ClimateHealthIndexView />
)}

{activeTab === 'Forecast' && (
  <ForecastView />
)}

{activeTab === 'Risk Maps' && (
  <RiskMapsView />
)}

{activeTab === 'AI Assistant' && (
  <AIAssistantView 
    weatherData={currentCityData} 
    currentCity={currentCityName} 
  />
)}

{activeTab === 'Citizen Reports' && (
  <CitizenReportsView />
)}

{activeTab === 'Hospital Dashboard' && (
  <HospitalDashboardView />
)}

{activeTab === 'About' && (
  <AboutView />
)}
            </div>
          </div>
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/60 backdrop-blur-md py-6 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] font-semibold text-slate-500 gap-4">
          <p>© 2026 ClimaCare AI early warning healthcare matrix. All rights reserved.</p>
          <div className="flex items-center justify-center gap-5">
            <span className="flex items-center gap-1.5 text-blue-600"><Wind className="h-3.5 w-3.5" /> Sensor Stream v1.2</span>
            <span className="flex items-center gap-1.5 text-emerald-600"><Heart className="h-3.5 w-3.5" /> Epidemiological engine</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

import React from 'react';
import { Heart, Activity, AlertTriangle, ShieldCheck, HelpCircle, Globe, Sun, Wind } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center space-y-3.5">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full w-fit mx-auto">
          Scientific Foundation
        </span>
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Climate Change & Human Health</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
          Understanding the physiological stressors caused by environmental shifts and how predictive software helps build community resilience.
        </p>
      </div>

      {/* Grid: Health Impacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Heat stress */}
        <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white space-y-3">
          <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl w-fit">
            <Sun className="h-5.5 w-5.5" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Thermal Cardiovascular Load</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Severe heatwaves trigger intensive skin vasodilation, diverting blood volume to the extremities. This increases heart rate and cardiac workload, causing orthostatic fainting, severe cramps, and life-threatening heatstroke in elderly or diabetic subjects.
          </p>
        </div>

        {/* Card 2: AQI particulates */}
        <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white space-y-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit">
            <Wind className="h-5.5 w-5.5" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Pulmonary Microparticle Ingress</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fine PM2.5 particles bypass the nasal ciliated filter and penetrate deep into pulmonary alveoli. They trigger inflammatory cytokine cascades, aggravating chronic bronchitis, asthma, and entering pulmonary capillaries to trigger vascular plaques.
          </p>
        </div>

        {/* Card 3: Allergen extension */}
        <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white space-y-3">
          <div className="p-2.5 bg-green-50 text-green-600 rounded-xl w-fit">
            <Globe className="h-5.5 w-5.5" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Allergen Cycle Extension</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Rising global temperatures and elevated atmospheric CO2 concentrations accelerate plant growth, prolonging pollen seasons. This spikes ambient spores, triggering acute allergic rhinitis and asthma flareups.
          </p>
        </div>

        {/* Card 4: Vector expansion */}
        <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white space-y-3">
          <div className="p-2.5 bg-red-50 text-red-600 rounded-xl w-fit">
            <AlertTriangle className="h-5.5 w-5.5" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Vector-Borne Disease Shifts</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Warming average temperatures and altered rainfall distributions expand the geographical range of disease vectors like mosquitoes, increasing regional exposures to malaria, dengue fever, and Lyme disease.
          </p>
        </div>

      </div>

      {/* Info banner about ClimaCare AI */}
      <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          How ClimaCare AI Works
        </h3>
        <p className="text-xs text-slate-650 leading-relaxed">
          ClimaCare AI integrates environmental sensor arrays, local meteorological predictions, and hospital admissions metrics. By cross-referencing this telemetry with your personalized health vulnerability profile, our software evaluates real-time clinical risks and recommends daily behavioral updates.
        </p>
        
        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center font-bold">
          <div>
            <span className="block text-xl text-blue-600">Real-Time</span>
            <span className="block text-3xs text-slate-400 uppercase mt-0.5">AQI & Weather Inputs</span>
          </div>
          <div className="border-x border-slate-200">
            <span className="block text-xl text-green-600">Personalized</span>
            <span className="block text-3xs text-slate-400 uppercase mt-0.5">Bio-Risk Profiling</span>
          </div>
          <div>
            <span className="block text-xl text-orange-500">Predictive</span>
            <span className="block text-3xs text-slate-400 uppercase mt-0.5">ER Inflow Planning</span>
          </div>
        </div>
      </div>
    </div>
  );
}

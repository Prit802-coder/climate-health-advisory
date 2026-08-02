import React, { useState } from 'react';
import { ShieldCheck, MessageSquare, AlertOctagon, Heart, Droplet, UserMinus, Sparkles } from 'lucide-react';
import { generateActionableAdvice, calculatePersonalHazard } from '../utils/healthEngine';

export default function ActionableAdvice({ weather, pollution, profile }) {
  const [completedSteps, setCompletedSteps] = useState({});

  if (!weather || !pollution) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-full flex items-center justify-center shimmer-bg">
        <span className="text-slate-500 text-sm">Drafting clinical advisories...</span>
      </div>
    );
  }

  const hazardResult = calculatePersonalHazard(pollution.aqi, weather, profile);
  const advices = generateActionableAdvice(pollution.aqi, weather, profile, hazardResult.hazardScore);

  const toggleStep = (index) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getIcon = (category) => {
    switch (category) {
      case 'Medical': return <Heart className="h-4 w-4 text-rose-400 shrink-0" />;
      case 'Hydration': return <Droplet className="h-4 w-4 text-sky-400 shrink-0" />;
      case 'Activity': return <UserMinus className="h-4 w-4 text-amber-400 shrink-0" />;
      default: return <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between space-y-5 glass-panel-hover">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-bold text-slate-200">Actionable Advisories</h2>
        </div>
        <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
          Personalized
        </span>
      </div>

      {/* Advisory Checklist */}
      <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1.5 scrollbar-thin">
        {advices.length > 0 ? (
          advices.map((adv, idx) => {
            const isCompleted = !!completedSteps[idx];
            const isHigh = adv.priority === 'high';
            const isMedium = adv.priority === 'medium';
            
            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`flex gap-3.5 p-3.5 rounded-2xl border transition duration-150 cursor-pointer select-none ${
                  isCompleted
                    ? "bg-slate-900/20 border-slate-800/50 opacity-40 line-through"
                    : isHigh
                    ? "bg-red-500/5 border-red-500/20 hover:bg-red-500/10"
                    : isMedium
                    ? "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10"
                    : "bg-slate-900/40 border-slate-800/50 hover:bg-slate-850/50"
                }`}
              >
                {/* Custom Checkbox */}
                <div className="pt-0.5 shrink-0">
                  <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-slate-950"
                      : isHigh
                      ? "border-red-500/40 text-transparent"
                      : "border-slate-700 text-transparent"
                  }`}>
                    {isCompleted && (
                      <svg className="h-3.5 w-3.5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Advice Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {adv.category}
                    </span>
                    <span className="text-slate-500 text-[9px]">•</span>
                    <span className={`text-[9px] uppercase font-extrabold ${
                      isHigh ? "text-red-400" : isMedium ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {adv.priority} Priority
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {adv.text}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center space-y-2">
            <ShieldCheck className="h-10 w-10 text-emerald-500/60" />
            <p className="text-xs">No adverse climate or pollution triggers active. You are fully protected.</p>
          </div>
        )}
      </div>

      {/* Progress Indicators */}
      <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
        <span>Completed Precautions: {Object.values(completedSteps).filter(Boolean).length} / {advices.length}</span>
        <span>Advisory Engine v1.2</span>
      </div>
    </div>
  );
}

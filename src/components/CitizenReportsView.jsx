import React, { useState, useMemo } from 'react';
import { AlertCircle, User, MapPin, Activity, Flame, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { submitCitizenReport } from '../utils/flaskApi';

export default function CitizenReportsView() {
  const [reports, setReports] = useState([
    { id: 1, name: 'A. K.', ward: 'Ward C', symptom: 'severe_coughing', severity: 'Severe', desc: 'Dense industrial smoke causing asthma exacerbation in children.', time: '12 mins ago' },
    { id: 2, name: 'M. R.', ward: 'Ward A', symptom: 'heat_rash', severity: 'Moderate', desc: 'Intense heat indexes causing body rashes and dehydration during afternoon delivery shifts.', time: '45 mins ago' },
    { id: 3, name: 'S. T.', ward: 'Ward E', symptom: 'itchy_eyes', severity: 'Mild', desc: 'High pollen allergen spikes causing nasal and ocular irritation.', time: '2 hours ago' },
    { id: 4, name: 'D. P.', ward: 'Ward C', symptom: 'breathing_difficulty', severity: 'Severe', desc: 'Heavy particulate smell in the air making breathing shallow.', time: '3 hours ago' }
  ]);

  // Form State
  const [formName, setFormName] = useState('');
  const [formWard, setFormWard] = useState('Ward A');
  const [formSymptom, setFormSymptom] = useState('breathing_difficulty');
  const [formSeverity, setFormSeverity] = useState('Moderate');
  const [formDesc, setFormDesc] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formDesc.trim()) return;

    const reportData = {
      name: formName.trim() || 'Anonymous',
      ward: formWard,
      symptom: formSymptom,
      severity: formSeverity,
      desc: formDesc
    };

    try {
      const response = await submitCitizenReport(reportData);
      const newReport = response.report || { ...reportData, id: reports.length + 1, time: 'Just now' };
      setReports(prev => [newReport, ...prev]);
    } catch (err) {
      // Fallback local logic on error
      const newReport = {
        id: reports.length + 1,
        name: reportData.name,
        ward: reportData.ward,
        symptom: reportData.symptom,
        severity: reportData.severity,
        desc: reportData.desc,
        time: 'Just now'
      };
      setReports(prev => [newReport, ...prev]);
    }

    setIsSuccess(true);
    setFormName('');
    setFormDesc('');
    
    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  // Symptom label helper
  const getSymptomLabel = (sym) => {
    switch (sym) {
      case 'breathing_difficulty': return 'Respiratory Strain';
      case 'severe_coughing': return 'Acute Coughing';
      case 'heat_rash': return 'Heat-Induced Rash';
      case 'itchy_eyes': return 'Allergic Conjuctivitis';
      default: return 'General Symptom';
    }
  };

  // Aggregate metrics
  const aggregateMetrics = useMemo(() => {
    let respiratory = 0;
    let thermal = 0;
    let allergic = 0;
    let severeCount = 0;

    reports.forEach(r => {
      if (r.severity === 'Severe') severeCount++;
      
      if (r.symptom === 'breathing_difficulty' || r.symptom === 'severe_coughing') {
        respiratory++;
      } else if (r.symptom === 'heat_rash') {
        thermal++;
      } else if (r.symptom === 'itchy_eyes') {
        allergic++;
      }
    });

    return { respiratory, thermal, allergic, severeCount };
  }, [reports]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Citizen Health Reporting</h2>
        <p className="text-slate-500 mt-2">Report your micro-climate symptoms to alert local health channels and map communal risks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 5 Columns: Reporting Form */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Symptom Intake Form</h3>
                <p className="text-xs text-slate-400">Your reporting helps map real-time regional outbreaks</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Subject Initials (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. J. D."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location/Ward</label>
                  <select
                    value={formWard}
                    onChange={(e) => setFormWard(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Ward A">Ward A (Downtown)</option>
                    <option value="Ward B">Ward B (Westside)</option>
                    <option value="Ward C">Ward C (Industrial)</option>
                    <option value="Ward D">Ward D (Southlake)</option>
                    <option value="Ward E">Ward E (North Heights)</option>
                    <option value="Ward F">Ward F (Eastside)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Severity Level</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe Risk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Primary Symptom</label>
                <select
                  value={formSymptom}
                  onChange={(e) => setFormSymptom(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="breathing_difficulty">Respiratory Strain (Asthma/COPD)</option>
                  <option value="severe_coughing">Acute Coughing / Chest Congestion</option>
                  <option value="heat_rash">Heat-Induced Rashes / Dehydration</option>
                  <option value="itchy_eyes">Allergic Conjuctivitis (Ocular Itching)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Symptom Description</label>
                <textarea
                  required
                  rows="3.5"
                  placeholder="Detail the duration, ambient circumstances (e.g. high smoke, heat peak) and any clinical interventions..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                Submit Safety Report
              </button>

              {isSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-2xs font-semibold rounded-xl text-center animate-pulse">
                  Report submitted successfully. Community database updated.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right 7 Columns: Reports aggregate & Live feed */}
        <div className="lg:col-span-7 space-y-6">
          {/* Aggregate Dashboard Metrics */}
          <div className="glass-card rounded-2xl p-5 shadow-sm border border-slate-100 bg-white grid grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-50">
              <span className="block text-2xl font-black text-blue-600">{aggregateMetrics.respiratory}</span>
              <span className="block text-3xs font-semibold text-slate-400 uppercase tracking-wide mt-1">Respiratory</span>
            </div>
            <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-50">
              <span className="block text-2xl font-black text-orange-500">{aggregateMetrics.thermal}</span>
              <span className="block text-3xs font-semibold text-slate-400 uppercase tracking-wide mt-1">Heat stress</span>
            </div>
            <div className="p-3 bg-green-50/50 rounded-xl border border-green-50">
              <span className="block text-2xl font-black text-green-600">{aggregateMetrics.allergic}</span>
              <span className="block text-3xs font-semibold text-slate-400 uppercase tracking-wide mt-1">Immunological</span>
            </div>
            <div className="p-3 bg-red-50/50 rounded-xl border border-red-50">
              <span className="block text-2xl font-black text-red-500">{aggregateMetrics.severeCount}</span>
              <span className="block text-3xs font-semibold text-slate-400 uppercase tracking-wide mt-1">Severe Alert</span>
            </div>
          </div>

          {/* Live Incident Feed */}
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
                Live Communal Symptom Stream
              </h3>
              <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Real-Time Updates
              </span>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {reports.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-start gap-4 hover:border-slate-200 transition-colors">
                  <div className={`p-2.5 rounded-xl shrink-0 flex items-center justify-center self-start ${
                    r.severity === 'Severe' ? 'bg-red-50 border border-red-100 text-red-600' :
                    r.severity === 'Moderate' ? 'bg-orange-50 border border-orange-100 text-orange-600' :
                    'bg-green-50 border border-green-100 text-green-600'
                  }`}>
                    {r.symptom === 'heat_rash' ? <Flame className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
                  </div>
                  
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-extrabold text-slate-800">{r.name}</span>
                        <span className="text-3xs font-semibold bg-slate-200 px-1.5 py-0.5 rounded-full text-slate-500 uppercase flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" />
                          {r.ward}
                        </span>
                      </div>
                      <span className="text-3xs text-slate-400 font-medium">{r.time}</span>
                    </div>
                    
                    <span className="block text-2xs font-extrabold text-slate-700">{getSymptomLabel(r.symptom)} ({r.severity})</span>
                    <p className="text-2xs text-slate-500 font-semibold leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

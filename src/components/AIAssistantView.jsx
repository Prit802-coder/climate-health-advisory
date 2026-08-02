import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Brain, User, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { queryAIChat } from '../utils/flaskApi';

export default function AIAssistantView({ weatherData, currentCity }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello! I am your ClimaCare AI Health Assistant. Currently evaluating environmental telemetry for ${currentCity}. How can I assist you with clinical climate-safety advice today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Suggested Prompts
  const suggestedPrompts = [
    { text: 'How do I manage asthma in high humidity?', query: 'How do I manage asthma in high humidity?' },
    { text: 'Is it safe to run outdoors today?', query: `Given the current weather in ${currentCity}, is it safe to run outdoors?` },
    { text: 'Early signs of heat exhaustion?', query: 'What are the early signs of heat exhaustion and how do I prevent it?' },
    { text: 'How does AQI impact heart disease?', query: 'How does poor air quality (AQI) affect patients with pre-existing cardiovascular diseases?' }
  ];

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const simulateAIResponse = async (userQuery) => {
    setIsTyping(true);

    try {
      // Attempt to query the Flask backend
      const response = await queryAIChat(userQuery, { weatherData, currentCity });
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 2,
          sender: 'ai',
          text: response.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    } catch (err) {
      // Fallback to local simulated mock response on failure
      setTimeout(() => {
        let aiText = '';
        const queryLower = userQuery.toLowerCase();

        if (queryLower.includes('asthma') || queryLower.includes('humidity')) {
          aiText = `High ambient humidity combined with elevated temperatures creates heavy, particulate-laden air that can cause airway constriction. Here are immediate clinical guidelines:
          
• **Maintain Inhaler Access**: Keep rescue bronchodilators on hand at all times.
• **Air Filtration**: Run air-conditioning in dehumidify mode to keep indoor humidity below 50%.
• **Trigger Mitigation**: Pollen count is currently elevated. Avoid early morning outdoors, when pollen counts peak.
• **Symptom Monitoring**: Watch for minor chest tightness or increased coughing, which indicates early hyperreactivity. Seek cool indoor environments immediately.`;
        } else if (queryLower.includes('run') || queryLower.includes('exercise') || queryLower.includes('safe')) {
          const aqi = weatherData?.aqi || 68;
          const temp = weatherData?.temp || 24;
          
          if (aqi > 100 || temp > 30) {
            aiText = `Based on current telemetry in **${currentCity}** (Temp: ${temp}°C, AQI: ${aqi}), high-intensity outdoor exercises are **Not Recommended**:
            
• **Ventilatory Strain**: Elevated PM2.5 counts trigger deep pulmonary alveolar inflammation during aerobic respiration.
• **Thermal Dehydration**: High temperature causes peripheral vasodilation, increasing cardiac load.
• **Alternative**: We advise shifting cardiovascular sessions indoors today or scheduling them post-sunset when the ozone level dissipates.`;
          } else {
            aiText = `Current environmental conditions in **${currentCity}** (Temp: ${temp}°C, AQI: ${aqi}) are **Favorable** for outdoor physical training:
            
• **Optimal AQI**: Microparticle loading is within healthy physiological margins.
• **Thermoregulation**: Ambient air is within normal homeostatic zones.
• **Advice**: Stay hydrated and apply SPF 30+ cream if exercising under direct sun exposure.`;
          }
        } else if (queryLower.includes('heat') || queryLower.includes('exhaustion') || queryLower.includes('prevent')) {
          aiText = `Heat exhaustion is a critical clinical condition that occurs when the body overproduces thermal energy and cannot cool itself. 
          
**Early Indicator Symptoms:**
1. Profuse, cold sweating with clammy skin.
2. Orthostatic dizziness, lightheadedness, or sudden headache.
3. Rapid, thready pulse rate.
4. Mild muscular cramps or nausea.

**Immediate Preventive Protocols:**
• **Hydration**: Consume 250ml electrolyte/saline solutions every 20-30 minutes. Plain water alone may lead to hyponatremia.
• **Shade Recovery**: Move the subject to a shaded, well-ventilated or air-conditioned area immediately.
• **Cooling**: Apply cold compresses or wet towels to major pulse junctions (neck, armpits, groin).`;
        } else if (queryLower.includes('heart') || queryLower.includes('aqi') || queryLower.includes('cardio')) {
          aiText = `Fine particulate matter (PM2.5) enters the pulmonary vascular bed, crossing directly into the bloodstream to cause immediate vascular wall irritation:
          
• **Inflammation & Plaque**: Systemic inflammation can cause atherosclerotic plaques to rupture, triggering cardiac events.
• **Increased Pressure**: Particulates trigger autonomic nervous responses, increasing heart rate and blood pressure.
• **Cardiac Care Guidance**: 
    - Restrict outdoor physical excursions when the AQI exceeds 100.
    - Ensure regular intake of prescribed anti-hypertensive and cardioprotective medication.
    - Install HEPA air purifiers in living quarters.`;
        } else {
          aiText = `Thank you for your inquiry about climate-health conditions in **${currentCity}**. Based on active monitoring:
          
• **Precautionary Stance**: The aggregate Climate Health Index is currently at ${weatherData?.healthIndex || 72} (Fair).
• **General Advice**: Focus on regular hydration, check localized AQI indicators prior to commuting, and consider wearing light face filters if traveling through highly congested industrial wards.

Let me know if you would like me to detail specific rules for respiratory, cardiovascular, or pediatric health groups.`;
        }

        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 2,
            sender: 'ai',
            text: aiText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    simulateAIResponse(textToSend);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Health Assistant</h2>
        <p className="text-slate-500 mt-2">Consult our medical-climate intelligence engine for personalized health guidance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px] items-stretch">
        
        {/* Left 4 Columns: Suggested Prompts & Config */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 bg-white flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinical Chat Assistant</span>
              </div>
              
              <div className="space-y-3.5">
                <span className="block text-2xs font-bold text-slate-400 uppercase tracking-wider">Suggested Questions</span>
                <div className="space-y-2">
                  {suggestedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p.query)}
                      className="w-full text-left p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all text-xs font-semibold text-slate-700 flex items-center justify-between group"
                    >
                      <span className="line-clamp-2 pr-2">{p.text}</span>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-2.5 text-orange-800">
              <AlertCircle className="h-4.5 w-4.5 text-orange-600 shrink-0 mt-0.5" />
              <div className="text-2xs leading-relaxed">
                <span className="font-bold block">Medical Precaution</span>
                ClimaCare AI does not diagnose clinical diseases. In case of acute respiratory distress, severe headaches, or heat strokes, contact emergency medical facilities immediately.
              </div>
            </div>
          </div>
        </div>

        {/* Right 8 Columns: Live Chat Console */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-2xl shadow-sm border border-slate-100 bg-white h-full flex flex-col overflow-hidden">
            {/* Console Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-55/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center animate-pulse">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-800">ClimaCare Health Advisory Bot</span>
                  <span className="block text-3xs font-semibold text-green-500">SYSTEM TELEMETRY: ONLINE</span>
                </div>
              </div>
              
              <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-full">
                AI Agent v1.4
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m) => {
                const isAI = m.sender === 'ai';
                return (
                  <div key={m.id} className={`flex gap-3.5 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                    <div className={`w-8.5 h-8.5 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                      isAI ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {isAI ? <Brain className="h-4.5 w-4.5" /> : <User className="h-4 w-4" />}
                    </div>
                    
                    <div className="space-y-1">
                      <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-line shadow-2xs border ${
                        isAI 
                          ? 'bg-blue-50/30 border-blue-50/50 text-slate-700' 
                          : 'bg-blue-600 border-blue-600 text-white'
                      }`}>
                        {m.text}
                      </div>
                      <span className={`block text-3xs text-slate-400 ${isAI ? 'text-left' : 'text-right'}`}>{m.timestamp}</span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-3.5 mr-auto max-w-[80%] items-center">
                  <div className="w-8.5 h-8.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Brain className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex gap-1 bg-slate-50 border border-slate-100 p-3 px-4.5 rounded-2xl">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/40">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-3 items-center"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type environmental health queries (e.g. asthma management, AQI risks)..."
                  className="flex-1 p-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

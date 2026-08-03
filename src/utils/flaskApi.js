/**
 * API Service for connecting ClimaCare AI React frontend to a Flask backend.
 * By default, this points to http://localhost:5000/api.
 * It will gracefully fall back to local mock data if the Flask backend is offline.
 */

const FLASK_API_BASE = import.meta.env.VITE_FLASK_API_URL || 'https://climate-health-backend-8xgk.onrender.com/api';

// Helper to check if Flask backend is available
async function request(endpoint, options = {}) {
  const url = `${FLASK_API_BASE}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText} (${response.status})`);
    }
    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`Flask backend endpoint ${endpoint} unreachable. Using fallback mock data. Reason:`, err.message);
    throw err; // Caller handles fallback
  }
}

/**
 * 1. Personalized Risk Assessment API
 * POST /api/risk-assessment
 */
export async function getRiskAssessment(profileData, environmentalData) {
  try {
    return await request('/risk-assessment', {
      method: 'POST',
      body: JSON.stringify({ profile: profileData, environment: environmentalData }),
    });
  } catch (err) {
    // Return simulated calculations if Flask is down
    let baseScore = 20;
    const aqi = environmentalData?.aqi || 68;
    const temp = environmentalData?.temp || 24;
    const uv = environmentalData?.uv || 4;

    baseScore += (aqi / 3);
    baseScore += Math.max(0, (temp - 22) * 1.5);
    baseScore += (uv * 3);

    if (profileData.age < 12) baseScore += 12;
    else if (profileData.age > 65) baseScore += 20;

    if (profileData.occupation === 'outdoor') baseScore += 15;
    if (profileData.conditions?.asthma) baseScore += 25;
    if (profileData.conditions?.cardiovascular) baseScore += 25;

    const score = Math.min(100, Math.round(baseScore));
    return {
      score,
      level: score > 70 ? 'Extreme' : score > 45 ? 'Moderate' : 'Low',
      modifiers: profileData.occupation === 'outdoor' ? ['High exposure (outdoor job)'] : ['Standard exposure risk'],
      source: 'Mock Fallback Engine'
    };
  }
}

/**
 * 2. Hospital Burden Prediction API
 * GET /api/hospital-burden?facilityId=city-general
 */
export async function getHospitalBurden(facilityId) {
  try {
    return await request(`/hospital-burden?facilityId=${facilityId}`);
  } catch (err) {
    // Return mock Recharts data
    return [
      { date: 'Mon', admissions: 18, temp: 24, pm25: 48, expected: 15 },
      { date: 'Tue', admissions: 22, temp: 26, pm25: 58, expected: 17 },
      { date: 'Wed', admissions: 31, temp: 31, pm25: 82, expected: 26 },
      { date: 'Thu', admissions: 42, temp: 34, pm25: 110, expected: 38 },
      { date: 'Fri', admissions: 58, temp: 36, pm25: 135, expected: 48 },
      { date: 'Sat', admissions: 39, temp: 27, pm25: 88, expected: 32 },
      { date: 'Sun', admissions: 24, temp: 22, pm25: 42, expected: 20 }
    ];
  }
}

/**
 * 3. AI Health Assistant Chat API
 * POST /api/chat
 */
export async function queryAIChat(message, context = {}) {
  try {
    return await request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  } catch (err) {
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      reply: `[Fallback Mock AI] Thank you for querying about climate-health risks. We received your message: "${message}". Connect your Flask backend to get actual AI-driven diagnostic summaries.`,
      timestamp: new Date().toLocaleTimeString()
    };
  }
}

/**
 * 4. Citizen Health Report Submission API
 * POST /api/citizen-reports
 */
export async function submitCitizenReport(reportData) {
  try {
    return await request('/citizen-reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  } catch (err) {
    // Fallback success response
    return {
      success: true,
      report: {
        ...reportData,
        id: Math.random().toString(36).substr(2, 9),
        time: 'Just now'
      }
    };
  }
}

/**
 * 5. Ward-Level Telemetry Risk API
 * GET /api/ward-telemetry
 */
export async function getWardTelemetry() {
  try {
    return await request('/ward-telemetry');
  } catch (err) {
    // Return ward fallback details
    return [
      { id: 'ward-a', name: 'Downtown District (Ward A)', risk: 'high', score: 82, temp: 34, pm25: 145, pop: '42,000', seniors: '18%', hospitals: 3, alert: 'Heat Wave & Ozone Warning' },
      { id: 'ward-b', name: 'Westside Residential (Ward B)', risk: 'medium', score: 55, temp: 31, pm25: 85, pop: '68,000', seniors: '12%', hospitals: 1, alert: 'Moderate Allergy Spikes' },
      { id: 'ward-c', name: 'Industrial Hub (Ward C)', risk: 'high', score: 89, temp: 35, pm25: 198, pop: '29,000', seniors: '7%', hospitals: 2, alert: 'Critical Air Quality (PM2.5)' },
      { id: 'ward-d', name: 'Southlake Greenbelt (Ward D)', risk: 'low', score: 28, temp: 28, pm25: 32, pop: '35,000', seniors: '14%', hospitals: 1, alert: 'No active warnings' },
      { id: 'ward-e', name: 'North Heights (Ward E)', risk: 'medium', score: 48, temp: 30, pm25: 72, pop: '54,000', seniors: '22%', hospitals: 2, alert: 'Elevated Pollen Spores' },
      { id: 'ward-f', name: 'Eastside Meadows (Ward F)', risk: 'low', score: 22, temp: 27, pm25: 25, pop: '31,000', seniors: '10%', hospitals: 0, alert: 'No active warnings' }
    ];
  }
}

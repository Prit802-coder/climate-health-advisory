/**
 * API Service for connecting ClimaCare AI React frontend to the FastAPI backend.
 * Points to http://localhost:5000/api (or VITE_FLASK_API_URL).
 * Gracefully falls back to local simulation data if backend is offline.
 */

const FASTAPI_BASE = import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${FASTAPI_BASE}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  const token = localStorage.getItem('clima_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `API error: ${response.statusText} (${response.status})`);
    }
    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`FastAPI backend endpoint ${endpoint} unreachable. Using fallback engine. Reason:`, err.message);
    throw err;
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
    if (profileData.conditions?.allergies) baseScore += 10;
    if (profileData.conditions?.copd) baseScore += 30;

    const score = Math.min(100, Math.round(baseScore));
    return {
      score,
      level: score > 70 ? 'Extreme' : score > 45 ? 'Moderate' : 'Low',
      color: score > 70 ? 'text-red-700 bg-red-50 border-red-200' : score > 45 ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-green-600 bg-green-50 border-green-200',
      ring: score > 70 ? 'border-red-500' : score > 45 ? 'border-orange-500' : 'border-green-500',
      modifiers: profileData.occupation === 'outdoor' ? ['High exposure (outdoor job)'] : ['Standard exposure risk'],
      source: 'Mock Fallback Engine'
    };
  }
}

/**
 * 2. Hospital Burden Prediction API
 * GET /api/hospital-burden?facilityId=city-general
 */
export async function getHospitalBurden(facilityId = 'city-general') {
  return await request(
    `/hospital-burden?facilityId=${encodeURIComponent(facilityId)}`
  );
}

export async function getHospitalFacilities() {
  return await request('/hospital/facilities');
}
/**
 * 3. AI Health Assistant Chat API
 * POST /api/chat
 */

export async function queryAIChat(message, context = {}) {
  return await request('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });
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

export async function getCitizenReports() {
  return await request('/citizen-reports');
}

/**
 * 5. Ward-Level Telemetry Risk API
 * GET /api/ward-telemetry
 */
export async function getWardTelemetry() {
  return await request('/ward-telemetry');
}

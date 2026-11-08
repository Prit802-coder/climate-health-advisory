import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});

// Interceptor to inject JWT Bearer token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("clima_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// 1. Weather & AQI
export const getWeather = async (city) => {
  const response = await API.get(`/weather?city=${encodeURIComponent(city)}`);
  return response.data;
};

export const getForecast = async (city) => {
  const response = await API.get(`/forecast?city=${encodeURIComponent(city)}`);
  return response.data;
};

export const getHourlyForecast = async (city) => {
  const response = await API.get(
    `/forecast/hourly?city=${encodeURIComponent(city)}`
  );
  return response.data;
};

export const getAirQuality = async (city) => {
  const response = await API.get(`/air-quality?city=${encodeURIComponent(city)}`);
  return response.data;
};

// 2. Climate Health Index & Risk
export const getHealthIndex = async (city) => {
  const response = await API.get(`/health-index?city=${encodeURIComponent(city)}`);
  return response.data;
};

export const calculateCustomHealthIndex = async (payload) => {
  const response = await API.post("/health-index/calculate", payload);
  return response.data;
};

export const getRiskAssessment = async (profileData, environmentalData) => {
  const response = await API.post("/risk-assessment", {
    profile: profileData,
    environment: environmentalData,
  });
  return response.data;
};

// 3. Wards
export const getWardTelemetry = async () => {
  const response = await API.get("/ward-telemetry");
  return response.data;
};

// 4. Citizen Reports
export const getCitizenReports = async () => {
  const response = await API.get("/citizen-reports");
  return response.data;
};

export const submitCitizenReport = async (reportData) => {
  const response = await API.post("/citizen-reports", reportData);
  return response.data;
};

// 5. Hospital Burden
export const getHospitalBurden = async (facilityId = "city-general") => {
  const response = await API.get(`/hospital-burden?facilityId=${encodeURIComponent(facilityId)}`);
  return response.data;
};

export const getHospitalFacilities = async () => {
  const response = await API.get("/hospital/facilities");
  return response.data;
};

// 6. AI Assistant Chat
export const queryAIChat = async (message, context = {}) => {
  const response = await API.post("/chat", { message, context });
  return response.data;
};

// 7. Authentication & Profile
export const loginUser = async (email, password) => {
  const response = await API.post("/api/auth/login", { email, password });
  if (response.data.access_token) {
    localStorage.setItem("clima_auth_token", response.data.access_token);
    localStorage.setItem("clima_user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post("/api/auth/register", userData);
  if (response.data.access_token) {
    localStorage.setItem("clima_auth_token", response.data.access_token);
    localStorage.setItem("clima_user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await API.get("/api/auth/me");
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("clima_auth_token");
  localStorage.removeItem("clima_user");
};

export default API;

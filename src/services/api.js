import axios from "axios";

const API = axios.create({
  baseURL: "https://climate-health-backend-2-31iq.onrender.com",
});

export const getWeather = async (city) => {
  const response = await API.get(`/weather?city=${encodeURIComponent(city)}`);
  return response.data;
};
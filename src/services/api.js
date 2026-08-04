import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getWeather = async (city) => {
  const response = await API.get(`/weather?city=${encodeURIComponent(city)}`);
  return response.data;
};
import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const getWeather = async (city) => {
    const response = await API.get(`/weather?city=${encodeURIComponent(city)}`);
    return response.data;
};
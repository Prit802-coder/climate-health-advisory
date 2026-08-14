import axios from "axios";

const API_URL = "https://climate-health-backend-2-31iq.onrender.com/api";

export const getWeather = async (city) => {
  const url = `${API_URL}/weather?city=${encodeURIComponent(city)}`;

  console.log("Calling:", url);

  const response = await axios.get(url);
  return response.data;
};
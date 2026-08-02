// CPCB (Indian Air Quality Standard) Brekpoints for AQI sub-index calculations
const BREAKPOINTS = {
  pm2_5: [
    { rawMin: 0, rawMax: 30, aqiMin: 0, aqiMax: 50 },
    { rawMin: 30, rawMax: 60, aqiMin: 51, aqiMax: 100 },
    { rawMin: 60, rawMax: 90, aqiMin: 101, aqiMax: 200 },
    { rawMin: 90, rawMax: 120, aqiMin: 201, aqiMax: 300 },
    { rawMin: 120, rawMax: 250, aqiMin: 301, aqiMax: 400 },
    { rawMin: 250, rawMax: 500, aqiMin: 401, aqiMax: 500 }
  ],
  pm10: [
    { rawMin: 0, rawMax: 50, aqiMin: 0, aqiMax: 50 },
    { rawMin: 50, rawMax: 100, aqiMin: 51, aqiMax: 100 },
    { rawMin: 100, rawMax: 250, aqiMin: 101, aqiMax: 200 },
    { rawMin: 250, rawMax: 350, aqiMin: 201, aqiMax: 300 },
    { rawMin: 350, rawMax: 430, aqiMin: 301, aqiMax: 400 },
    { rawMin: 430, rawMax: 500, aqiMin: 401, aqiMax: 500 }
  ],
  o3: [
    { rawMin: 0, rawMax: 50, aqiMin: 0, aqiMax: 50 },
    { rawMin: 50, rawMax: 100, aqiMin: 51, aqiMax: 100 },
    { rawMin: 100, rawMax: 168, aqiMin: 101, aqiMax: 200 },
    { rawMin: 168, rawMax: 208, aqiMin: 201, aqiMax: 300 },
    { rawMin: 208, rawMax: 748, aqiMin: 301, aqiMax: 400 },
    { rawMin: 748, rawMax: 1000, aqiMin: 401, aqiMax: 500 }
  ],
  no2: [
    { rawMin: 0, rawMax: 40, aqiMin: 0, aqiMax: 50 },
    { rawMin: 40, rawMax: 80, aqiMin: 51, aqiMax: 100 },
    { rawMin: 80, rawMax: 180, aqiMin: 101, aqiMax: 200 },
    { rawMin: 180, rawMax: 280, aqiMin: 201, aqiMax: 300 },
    { rawMin: 280, rawMax: 400, aqiMin: 301, aqiMax: 400 },
    { rawMin: 400, rawMax: 1000, aqiMin: 401, aqiMax: 500 }
  ],
  so2: [
    { rawMin: 0, rawMax: 40, aqiMin: 0, aqiMax: 50 },
    { rawMin: 40, rawMax: 80, aqiMin: 51, aqiMax: 100 },
    { rawMin: 80, rawMax: 380, aqiMin: 101, aqiMax: 200 },
    { rawMin: 380, rawMax: 800, aqiMin: 201, aqiMax: 300 },
    { rawMin: 800, rawMax: 1600, aqiMin: 301, aqiMax: 400 },
    { rawMin: 1600, rawMax: 2000, aqiMin: 401, aqiMax: 500 }
  ],
  co: [
    { rawMin: 0, rawMax: 1.0, aqiMin: 0, aqiMax: 50 },
    { rawMin: 1.0, rawMax: 2.0, aqiMin: 51, aqiMax: 100 },
    { rawMin: 2.0, rawMax: 10, aqiMin: 101, aqiMax: 200 },
    { rawMin: 10, rawMax: 17, aqiMin: 201, aqiMax: 300 },
    { rawMin: 17, rawMax: 34, aqiMin: 301, aqiMax: 400 },
    { rawMin: 34, rawMax: 100, aqiMin: 401, aqiMax: 500 }
  ]
};

// Interpolation logic
function calculateSubIndex(value, breakpoints) {
  if (value === undefined || value === null) return 0;
  for (let i = 0; i < breakpoints.length; i++) {
    const bp = breakpoints[i];
    if (value >= bp.rawMin && value <= bp.rawMax) {
      return Math.round(
        ((bp.aqiMax - bp.aqiMin) / (bp.rawMax - bp.rawMin)) * (value - bp.rawMin) + bp.aqiMin
      );
    }
  }
  const last = breakpoints[breakpoints.length - 1];
  return Math.round(last.aqiMax);
}

// Convert pollutant concentrations (in ug/m3, except CO in mg/m3) into a single 0-500 CPCB AQI
export function calculateIndianAQI(components) {
  // OpenWeatherMap returns CO in ug/m3, convert to mg/m3 by dividing by 1000
  const coMg = (components.co || 0) / 1000;
  
  const subIndices = {
    pm2_5: calculateSubIndex(components.pm2_5 || components.pm25, BREAKPOINTS.pm2_5),
    pm10: calculateSubIndex(components.pm10, BREAKPOINTS.pm10),
    o3: calculateSubIndex(components.o3, BREAKPOINTS.o3),
    no2: calculateSubIndex(components.no2, BREAKPOINTS.no2),
    so2: calculateSubIndex(components.so2, BREAKPOINTS.so2),
    co: calculateSubIndex(coMg, BREAKPOINTS.co)
  };

  const aqi = Math.max(...Object.values(subIndices));
  
  return {
    aqi,
    subIndices
  };
}

// Map 0-500 AQI to human-readable label and color style
export function getAQICategory(aqi) {
  if (aqi <= 50) return { label: "Good", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", hazardLevel: "Low" };
  if (aqi <= 100) return { label: "Satisfactory", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/30", hazardLevel: "Minor" };
  if (aqi <= 200) return { label: "Moderate", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", hazardLevel: "Moderate" };
  if (aqi <= 300) return { label: "Poor", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", hazardLevel: "High" };
  if (aqi <= 400) return { label: "Very Poor", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", hazardLevel: "Severe" };
  return { label: "Hazardous", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", hazardLevel: "Extreme" };
}

// Generate realistic simulated data based on city specific climatology and diurnal patterns
export function generateMockWeatherData(city, date = new Date()) {
  const hour = date.getHours();
  
  // Base parameters customized by city
  let baseTemp = 28;
  let baseHumidity = 60;
  let baseWind = 3.5;
  let pressure = 1008;
  let weatherDesc = "Clear Sky";
  let weatherIcon = "01d";
  
  switch (city.name) {
    case "Patna":
      baseTemp = 24; baseHumidity = 75; baseWind = 2.0; weatherDesc = "Haze"; weatherIcon = "50d";
      break;
    case "Bhopal":
      baseTemp = 28; baseHumidity = 55; baseWind = 3.0; weatherDesc = "Few Clouds"; weatherIcon = "02d";
      break;
    case "Lucknow":
      baseTemp = 26; baseHumidity = 58; baseWind = 2.8; weatherDesc = "Scattered Clouds"; weatherIcon = "03d";
      break;
    case "Indore":
      baseTemp = 27; baseHumidity = 50; baseWind = 3.4; weatherDesc = "Clear Sky"; weatherIcon = "01d";
      break;
    case "Surat":
      baseTemp = 31; baseHumidity = 80; baseWind = 4.2; weatherDesc = "Mist"; weatherIcon = "50d";
      break;
    case "Visakhapatnam":
      baseTemp = 30; baseHumidity = 82; baseWind = 5.5; weatherDesc = "Light Rain"; weatherIcon = "10d";
      break;
    case "Jaipur":
      baseTemp = 36; baseHumidity = 30; baseWind = 4.8; weatherDesc = "Dusty / Haze"; weatherIcon = "50d";
      break;
    case "Nagpur":
      baseTemp = 38; baseHumidity = 35; baseWind = 3.2; weatherDesc = "Hot Clear Sky"; weatherIcon = "01d";
      break;
    case "Coimbatore":
      baseTemp = 27; baseHumidity = 65; baseWind = 6.0; weatherDesc = "Breezy / Overcast"; weatherIcon = "04d";
      break;
    case "Guwahati":
      baseTemp = 25; baseHumidity = 85; baseWind = 1.5; weatherDesc = "Foggy"; weatherIcon = "50d";
      break;
  }

  // Add hourly variation
  const tempCycle = Math.sin(((hour - 6) / 24) * 2 * Math.PI); // Peak temp around 2-3 PM
  const temp = Math.round(baseTemp + tempCycle * 5);
  const humidity = Math.round(baseHumidity - tempCycle * 15);
  const windSpeed = Math.round((baseWind + Math.random() * 2) * 10) / 10;
  const windDeg = Math.round(Math.random() * 360);
  
  // UV Index simulation
  let uvi = 0;
  if (hour >= 6 && hour <= 18) {
    uvi = Math.round(Math.sin(((hour - 6) / 12) * Math.PI) * (city.name === "Jaipur" || city.name === "Nagpur" ? 11 : 8));
  }

  return {
    temp,
    feels_like: Math.round(temp + (humidity > 70 ? 2 : -1)),
    humidity,
    wind_speed: windSpeed,
    wind_deg: windDeg,
    pressure: pressure + Math.round(tempCycle * 3),
    uvi,
    description: weatherDesc,
    icon: weatherIcon,
    cityName: city.name
  };
}

export function generateMockPollutionData(city, weather, date = new Date()) {
  const hour = date.getHours();
  
  // Custom baseline pollutants by city (ug/m3)
  let basePM25 = 35;
  let basePM10 = 70;
  let baseO3 = 30;
  let baseNO2 = 25;
  let baseSO2 = 5;
  let baseCO = 400; // ug/m3

  switch (city.name) {
    case "Patna":
      basePM25 = 145; basePM10 = 220; baseO3 = 20; baseNO2 = 45; baseSO2 = 8; baseCO = 1200;
      break;
    case "Bhopal":
      basePM25 = 45; basePM10 = 85; baseO3 = 35; baseNO2 = 20; baseSO2 = 4; baseCO = 500;
      break;
    case "Lucknow":
      basePM25 = 95; basePM10 = 195; baseO3 = 28; baseNO2 = 38; baseSO2 = 6; baseCO = 900;
      break;
    case "Indore":
      basePM25 = 32; basePM10 = 65; baseO3 = 45; baseNO2 = 18; baseSO2 = 3; baseCO = 380;
      break;
    case "Surat":
      basePM25 = 55; basePM10 = 110; baseO3 = 25; baseNO2 = 35; baseSO2 = 22; baseCO = 650;
      break;
    case "Visakhapatnam":
      basePM25 = 28; basePM10 = 62; baseO3 = 30; baseNO2 = 22; baseSO2 = 14; baseCO = 420;
      break;
    case "Jaipur":
      basePM25 = 62; basePM10 = 175; baseO3 = 42; baseNO2 = 25; baseSO2 = 5; baseCO = 550;
      break;
    case "Nagpur":
      basePM25 = 48; basePM10 = 90; baseO3 = 55; baseNO2 = 22; baseSO2 = 7; baseCO = 480;
      break;
    case "Coimbatore":
      basePM25 = 22; basePM10 = 45; baseO3 = 26; baseNO2 = 12; baseSO2 = 2; baseCO = 310;
      break;
    case "Guwahati":
      basePM25 = 85; basePM10 = 130; baseO3 = 18; baseNO2 = 28; baseSO2 = 5; baseCO = 780;
      break;
  }

  // Diurnal cycle for traffic peaks (8-10 AM, 6-9 PM)
  const trafficPeak = 
    Math.exp(-Math.pow((hour - 9) / 2, 2)) * 1.6 + // Morning peak
    Math.exp(-Math.pow((hour - 20) / 2.5, 2)) * 1.8; // Evening peak
  const diurnalMultiplier = 0.7 + trafficPeak;

  // Ozone peak cycle (highest at 2-4 PM under high solar radiation)
  const ozoneMultiplier = hour >= 10 && hour <= 18 
    ? 0.5 + Math.sin(((hour - 10) / 8) * Math.PI) * 1.5 
    : 0.3;

  // Weather influences:
  // 1. High wind disperses particulates
  const windDispersion = Math.max(0.5, 1.5 - (weather.wind_speed / 7));
  // 2. High humidity traps particulates, but reduces Ozone formation
  const humidityTrapPM = 0.8 + (weather.humidity / 100) * 0.4;
  const humidityO3Reduction = Math.max(0.4, 1.2 - (weather.humidity / 100));

  // Compute final values
  const pm2_5 = Math.round(basePM25 * diurnalMultiplier * windDispersion * humidityTrapPM);
  const pm10 = Math.round(basePM10 * (diurnalMultiplier * 0.9 + 0.1) * windDispersion * humidityTrapPM);
  const o3 = Math.round(baseO3 * ozoneMultiplier * humidityO3Reduction * (weather.temp > 35 ? 1.3 : 1.0));
  const no2 = Math.round(baseNO2 * diurnalMultiplier * windDispersion);
  const so2 = Math.round(baseSO2 * (0.8 + Math.random() * 0.4));
  const co = Math.round(baseCO * diurnalMultiplier * windDispersion);

  const rawComponents = { pm2_5, pm10, o3, no2, so2, co };
  const { aqi, subIndices } = calculateIndianAQI(rawComponents);

  return {
    aqi,
    components: rawComponents,
    subIndices,
    dt: Math.floor(date.getTime() / 1000)
  };
}

// Master function to fetch weather + air pollution.
// If API key is provided, tries to query OpenWeatherMap. Falls back to mock data on error/empty key.
export async function fetchClimateHealthData(city, apiKey = "") {
  // Simulate network delay for mock responsiveness
  await new Promise(resolve => setTimeout(resolve, 600));

  if (!apiKey || apiKey.trim() === "") {
    const weather = generateMockWeatherData(city);
    const pollution = generateMockPollutionData(city, weather);
    return {
      weather,
      pollution,
      source: "Climate-Engine Simulator (No API Key)"
    };
  }

  try {
    // OpenWeatherMap endpoint calls
    // Step 1: Fetch current weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) throw new Error(`Weather API returned status: ${weatherResponse.status}`);
    const weatherRaw = await weatherResponse.json();

    // Step 2: Fetch air pollution
    const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}`;
    const pollutionResponse = await fetch(pollutionUrl);
    if (!pollutionResponse.ok) throw new Error(`Pollution API returned status: ${pollutionResponse.status}`);
    const pollutionRaw = await pollutionResponse.json();

    const weather = {
      temp: Math.round(weatherRaw.main.temp),
      feels_like: Math.round(weatherRaw.main.feels_like),
      humidity: weatherRaw.main.humidity,
      wind_speed: weatherRaw.wind.speed,
      wind_deg: weatherRaw.wind.deg,
      pressure: weatherRaw.main.pressure,
      uvi: 0, // UV Index requires a separate call in 2.5 or One Call, we fallback to simulated UV based on sun state
      description: weatherRaw.weather[0].description,
      icon: weatherRaw.weather[0].icon,
      cityName: weatherRaw.name
    };

    // Calculate simulated UV index for current hour since it is not in default weather payload
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 18) {
      weather.uvi = Math.round(Math.sin(((hour - 6) / 12) * Math.PI) * (city.name === "Jaipur" || city.name === "Nagpur" ? 10 : 7));
    }

    const owmComponents = pollutionRaw.list[0].components;
    // Remap OWM keys to our format
    const components = {
      pm2_5: owmComponents.pm2_5,
      pm10: owmComponents.pm10,
      o3: owmComponents.o3,
      no2: owmComponents.no2,
      so2: owmComponents.so2,
      co: owmComponents.co
    };

    const { aqi, subIndices } = calculateIndianAQI(components);

    return {
      weather,
      pollution: {
        aqi,
        components,
        subIndices,
        dt: pollutionRaw.list[0].dt
      },
      source: "OpenWeatherMap Live Stream"
    };

  } catch (error) {
    console.warn("API Error, falling back to simulator:", error.message);
    const weather = generateMockWeatherData(city);
    const pollution = generateMockPollutionData(city, weather);
    return {
      weather,
      pollution,
      source: `Simulator (API Error: ${error.message})`
    };
  }
}

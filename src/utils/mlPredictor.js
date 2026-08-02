import { generateMockWeatherData, generateMockPollutionData } from './api';
import { calculatePersonalHazard } from './healthEngine';

// Generates a 48 hour time-series forecast using an autoregressive mathematical simulation.
// Models diurnal traffic surges, weather correlations, and error propagation (widening confidence intervals).
export function generateMLForecast(city, currentWeather, currentPollution, userProfile = null) {
  const forecast = [];
  const startDt = new Date();
  
  // Keep track of rolling simulation values to model autoregressive behavior (memory)
  let rollingAQI = currentPollution.aqi;
  
  for (let i = 1; i <= 48; i++) {
    const targetDate = new Date(startDt.getTime() + i * 60 * 60 * 1000);
    const hour = targetDate.getHours();
    
    // 1. Get baseline weather and pollution for this target hour
    const hourlyWeather = generateMockWeatherData(city, targetDate);
    const hourlyPollution = generateMockPollutionData(city, hourlyWeather, targetDate);
    
    // 2. Autoregressive blend: Future AQI is a blend of the baseline target hour and the rolling forecasted state
    // Weight of history decays over time (error propagation)
    const historyWeight = Math.max(0.1, 0.7 - (i * 0.012)); 
    let predictedAQI = (rollingAQI * historyWeight) + (hourlyPollution.aqi * (1 - historyWeight));
    
    // Add small random noise to simulate chaotic atmospheric variables
    const noise = (Math.random() - 0.5) * 8;
    predictedAQI = Math.max(10, Math.min(500, predictedAQI + noise));
    
    // Save state for next step
    rollingAQI = predictedAQI;

    // Round for clean numbers
    const finalAQI = Math.round(predictedAQI);
    
    // 3. Error propagation bounds (95% Confidence Interval)
    // The margin of error grows wider over time as uncertainty increases
    const errorMargin = 8 + (i * 0.95);
    const aqiLower = Math.max(0, Math.round(finalAQI - errorMargin));
    const aqiUpper = Math.min(500, Math.round(finalAQI + errorMargin));

    // 4. Calculate predicted health hazard score for this hour
    // Uses the user profile if active, or a default baseline profile
    const profile = userProfile || { age: 30, conditions: [], exposure: "Indoor" };
    const hazardInfo = calculatePersonalHazard(finalAQI, hourlyWeather, profile);

    // Format time display
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeString = targetDate.toLocaleTimeString([], options);
    const dayPrefix = i <= 24 ? "Today" : "Tomorrow";
    
    forecast.push({
      hourIndex: i,
      timestamp: targetDate.getTime(),
      time: `${dayPrefix} ${timeString}`,
      dateStr: targetDate.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      aqi: finalAQI,
      aqiLower,
      aqiUpper,
      temp: hourlyWeather.temp,
      humidity: hourlyWeather.humidity,
      windSpeed: hourlyWeather.wind_speed,
      uvi: hourlyWeather.uvi,
      healthHazard: hazardInfo.hazardScore,
      hazardLevel: hazardInfo.hazardLevel,
      description: hourlyWeather.description
    });
  }
  
  return forecast;
}

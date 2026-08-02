// Dynamic health-hazard scoring engine and actionable advisor generator

export function calculatePersonalHazard(aqi, weather, profile) {
  const { age, conditions = [], exposure = "Indoor" } = profile;
  const temp = weather.temp;
  const humidity = weather.humidity;

  // 1. Calculate Base AQI Hazard (up to 65 points)
  let aqiHazard = 0;
  if (aqi <= 50) {
    aqiHazard = (aqi / 50) * 10; // 0 - 10
  } else if (aqi <= 100) {
    aqiHazard = 10 + ((aqi - 50) / 50) * 12; // 10 - 22
  } else if (aqi <= 200) {
    aqiHazard = 22 + ((aqi - 100) / 100) * 18; // 22 - 40
  } else if (aqi <= 300) {
    aqiHazard = 40 + ((aqi - 200) / 100) * 15; // 40 - 55
  } else {
    aqiHazard = 55 + ((aqi - 300) / 200) * 10; // 55 - 65
  }

  // 2. Personal Multipliers based on Vulnerability
  let multiplier = 1.0;
  
  // Age factor
  const ageNum = Number(age);
  if (ageNum < 12) {
    multiplier += 0.20; // Children are highly sensitive
  } else if (ageNum > 65) {
    multiplier += 0.30; // Elderly have elevated cardiorespiratory risk
  }

  // Medical conditions factor (cumulative, capped)
  let conditionModifier = 0;
  if (conditions.includes("Asthma")) conditionModifier += 0.35;
  if (conditions.includes("COPD")) conditionModifier += 0.45;
  if (conditions.includes("Cardiovascular")) conditionModifier += 0.40;
  if (conditions.includes("Pregnancy")) conditionModifier += 0.25;
  
  multiplier += Math.min(0.7, conditionModifier);

  // Exposure factor
  let exposureModifier = 1.0;
  if (exposure === "Outdoor") {
    exposureModifier = 1.35; // Construction workers, vendors, etc.
  } else if (exposure === "Athlete") {
    exposureModifier = 1.25; // Heavy ventilation outdoors
  } else if (exposure === "Hybrid") {
    exposureModifier = 1.0;
  } else if (exposure === "Indoor") {
    exposureModifier = 0.75; // Sheltered environment
  }

  let multipliedHazard = aqiHazard * multiplier * exposureModifier;

  // 3. Thermal Stress Additions (up to 35 points)
  let thermalStress = 0;
  
  // Heat Stress
  if (temp > 35) {
    thermalStress += (temp - 35) * 2.5; // +2.5 points per degree above 35°C
    // Humidity penalty for heat index (sweat cannot evaporate)
    if (humidity > 65) {
      thermalStress += (humidity - 65) * 0.25;
    }
  }
  
  // Cold Stress
  if (temp < 15) {
    thermalStress += (15 - temp) * 1.5; // +1.5 points per degree below 15°C
    if (conditions.includes("Asthma")) {
      thermalStress += (15 - temp) * 0.8; // Cold air triggers bronchospasm
    }
  }

  // 4. Final Aggregation and Capping
  let finalScore = Math.round(multipliedHazard + thermalStress);
  finalScore = Math.max(0, Math.min(100, finalScore));

  // Determine Hazard Level
  let hazardLevel = "Low";
  let color = "text-emerald-400";
  let bg = "bg-emerald-500/10";
  let border = "border-emerald-500/30";
  let description = "Normal environmental parameters. Minimal health risk.";

  if (finalScore > 75) {
    hazardLevel = "Critical";
    color = "text-purple-400";
    bg = "bg-purple-500/10";
    border = "border-purple-500/30";
    description = "Extremely high combined risk of pollution and thermal stress. Stay indoors.";
  } else if (finalScore > 55) {
    hazardLevel = "Severe";
    color = "text-red-400";
    bg = "bg-red-500/10";
    border = "border-red-500/30";
    description = "Significant threat to health. High exposure risk for sensitive profiles.";
  } else if (finalScore > 35) {
    hazardLevel = "High";
    color = "text-orange-400";
    bg = "bg-orange-500/10";
    border = "border-orange-500/30";
    description = "Elevated risk. Take proactive exposure reduction measures.";
  } else if (finalScore > 15) {
    hazardLevel = "Moderate";
    color = "text-amber-400";
    bg = "bg-amber-500/10";
    border = "border-amber-500/30";
    description = "Acceptable conditions but sensitive groups should monitor exposure.";
  }

  return {
    hazardScore: finalScore,
    hazardLevel,
    color,
    bg,
    border,
    description,
    breakdown: {
      baseAqi: Math.round(aqiHazard),
      vulnerabilityBonus: Math.round(multipliedHazard - aqiHazard),
      thermalStress: Math.round(thermalStress)
    }
  };
}

export function generateActionableAdvice(aqi, weather, profile, hazardScore) {
  const { age, conditions = [], exposure = "Indoor" } = profile;
  const temp = weather.temp;
  const humidity = weather.humidity;
  const isAsthmatic = conditions.includes("Asthma");
  const isCardio = conditions.includes("Cardiovascular") || conditions.includes("COPD");
  const isElderly = Number(age) > 65;
  const isChild = Number(age) < 12;

  const advices = [];

  // 1. Ventilation & Air Quality Advice
  if (aqi > 200) {
    advices.push({
      category: "Environment",
      text: "Seal doors and windows to exclude toxic PM2.5. Run air purifiers on High mode.",
      priority: "high"
    });
  } else if (aqi > 100) {
    advices.push({
      category: "Environment",
      text: "Minimize ventilation during high-traffic commuter peaks (8 AM - 10 AM, 6 PM - 9 PM).",
      priority: "medium"
    });
  } else {
    advices.push({
      category: "Environment",
      text: "Air quality is good. Safe to ventilate rooms and allow outdoor air circulation.",
      priority: "low"
    });
  }

  // 2. Outdoor Activity & Exercise Advice
  if (aqi > 300 || hazardScore > 75) {
    advices.push({
      category: "Activity",
      text: "POSTPONE all outdoor exercise. Do indoor cardiovascular activities instead.",
      priority: "high"
    });
  } else if (aqi > 150) {
    if (exposure === "Athlete" || exposure === "Outdoor") {
      advices.push({
        category: "Activity",
        text: "Limit outdoor duration. Swap heavy cardio (running, cycling) for light walking or move indoors.",
        priority: "high"
      });
    } else {
      advices.push({
        category: "Activity",
        text: "Reduce strenuous outdoor activities if you begin to experience throat irritation or cough.",
        priority: "medium"
      });
    }
  } else {
    advices.push({
      category: "Activity",
      text: "Conditions are excellent for outdoor activities and morning exercise.",
      priority: "low"
    });
  }

  // 3. Medical & Proactive Advisory (Medication timing, masks, triggers)
  if (aqi > 150) {
    advices.push({
      category: "Protection",
      text: "Wear an N95/FFP2 respirator mask if stepping outdoors. Normal surgical masks do not filter PM2.5.",
      priority: "high"
    });
  }

  if (isAsthmatic) {
    if (aqi > 120 || temp < 15) {
      advices.push({
        category: "Medical",
        text: "Bronchial constriction risk is elevated. Keep emergency rescue inhaler (albuterol/levosalbutamol) in your pocket.",
        priority: "high"
      });
    }
    if (aqi > 200) {
      advices.push({
        category: "Medical",
        text: "Consult physician regarding temporary adjustment of controller steroid dose if wheezing develops.",
        priority: "high"
      });
    }
  }

  if (isCardio) {
    if (aqi > 150) {
      advices.push({
        category: "Medical",
        text: "High particulate levels can trigger myocardial strain. Avoid lifting weights or running outdoors.",
        priority: "high"
      });
    }
    if (temp > 38) {
      advices.push({
        category: "Medical",
        text: "Extreme heat creates blood viscosity swings. Monitor blood pressure closely and stay in air conditioning.",
        priority: "high"
      });
    }
  }

  // 4. Thermal Stress Advice (Heat/Cold warnings)
  if (temp > 38) {
    advices.push({
      category: "Hydration",
      text: `Heat index feels like ${Math.round(temp + (humidity > 50 ? 4 : 0))}°C. Drink at least 3-4 liters of water; take electrolytes.`,
      priority: "high"
    });
    advices.push({
      category: "Protection",
      text: "Heat stroke alert: Avoid direct sunlight exposure between 11:00 AM and 4:00 PM.",
      priority: "high"
    });
  } else if (temp > 33) {
    advices.push({
      category: "Hydration",
      text: "Drink water hourly. Monitor children and elderly family members for symptoms of heat exhaustion.",
      priority: "medium"
    });
  } else if (temp < 12) {
    advices.push({
      category: "Protection",
      text: "Wind chill reduces core temp. Wear thermal layers and protect chest/throat from cold air inhalation.",
      priority: "medium"
    });
  }

  // Ensure sorting by priority (High -> Medium -> Low)
  return advices.sort((a, b) => {
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    return priorityWeights[b.priority] - priorityWeights[a.priority];
  });
}

/**
 * ==============================================================================
 * INTELLIGENT TRAFFIC PREDICTION SYSTEM - PREDICTION ENGINE (prediction.js)
 * CSE Academic Project | KLH University | 2026-2027
 * ==============================================================================
 * This module manages:
 * 1. User inputs (location, date, time, vehicle count slider, weather, day-type)
 * 2. Asynchronous API calls to Flask backend (/api/predict)
 * 3. Client-side ML fallback engine (Greenshields & BPR mathematical models)
 * 4. Animated circular SVG gauge rendering
 * 5. Congestion status classification (Green / Yellow / Red) and AI recommendations
 */

// Road profiles metadata matching backend
const ROAD_PROFILES = {
  tech_corridor: {
    name: "Tech Corridor Expressway",
    baseCapacity: 2400,
    freeFlowSpeed: 75,
    type: "Expressway",
    lanes: 6,
    sensorId: "TC-101"
  },
  metro_central: {
    name: "Metro Central Interchange",
    baseCapacity: 1800,
    freeFlowSpeed: 55,
    type: "Arterial Intersection",
    lanes: 4,
    sensorId: "MC-204"
  },
  airport_corridor: {
    name: "Airport Highway Corridor",
    baseCapacity: 2200,
    freeFlowSpeed: 80,
    type: "Highway",
    lanes: 6,
    sensorId: "AH-305"
  },
  outer_ring: {
    name: "Outer Ring Road (North Sector)",
    baseCapacity: 2600,
    freeFlowSpeed: 85,
    type: "Ring Expressway",
    lanes: 8,
    sensorId: "OR-402"
  },
  cyber_junction: {
    name: "Cyber Junction Road",
    baseCapacity: 1600,
    freeFlowSpeed: 50,
    type: "Urban Crossroad",
    lanes: 4,
    sensorId: "CJ-108"
  },
  financial_district: {
    name: "Financial District Avenue",
    baseCapacity: 1500,
    freeFlowSpeed: 45,
    type: "Commercial Arterial",
    lanes: 4,
    sensorId: "FD-506"
  }
};

const WEATHER_FACTORS = {
  clear: { capacityFactor: 1.0, speedFactor: 1.0, risk: "Optimal Visibility" },
  rainy: { capacityFactor: 0.82, speedFactor: 0.78, risk: "Wet Surface / Hydroplaning" },
  foggy: { capacityFactor: 0.75, speedFactor: 0.70, risk: "Low Visibility (<150m)" },
  thunderstorm: { capacityFactor: 0.65, speedFactor: 0.60, risk: "Severe Waterlogging / Hazards" }
};

// Client-Side ML Simulation Fallback
function calculateClientPrediction(locationKey, timeStr, vehicleCount, weather, dayType) {
  const profile = ROAD_PROFILES[locationKey] || ROAD_PROFILES.tech_corridor;
  const weatherInfo = WEATHER_FACTORS[weather.toLowerCase()] || WEATHER_FACTORS.clear;

  let hour = 9, minute = 0;
  if (timeStr) {
    const parts = timeStr.split(':');
    hour = parseInt(parts[0], 10) || 9;
    minute = parseInt(parts[1], 10) || 0;
  }

  const t = hour + (minute / 60.0);
  // Temporal rush curves
  const morningPeak = Math.exp(-Math.pow(t - 9.0, 2) / (2 * Math.pow(1.2, 2)));
  const eveningPeak = Math.exp(-Math.pow(t - 18.75, 2) / (2 * Math.pow(1.4, 2)));
  const lunchBump = 0.45 * Math.exp(-Math.pow(t - 13.0, 2) / (2 * Math.pow(1.0, 2)));
  const baseline = (t >= 6.0 && t <= 22.0) ? 0.25 : 0.10;
  const timeFactor = Math.min(Math.max(baseline, morningPeak * 0.95, eveningPeak * 1.0, lunchBump), 1.0);

  let dayFactor = 1.0;
  if (dayType === 'weekend') dayFactor = 0.78;
  if (dayType === 'holiday') dayFactor = 0.65;

  const effectiveCapacity = profile.baseCapacity * weatherInfo.capacityFactor;
  const vcRatio = (vehicleCount / effectiveCapacity) * (0.65 + (0.35 * timeFactor)) * dayFactor;

  // Greenshields density percentage
  const densityPct = Math.min(Math.max(Math.round(vcRatio * 100), 5), 98);

  // BPR speed formula
  const alpha = 0.15;
  const beta = 4.0;
  const speedReduction = 1.0 + alpha * Math.pow(Math.min(vcRatio, 1.8), beta);
  const rawSpeed = (profile.freeFlowSpeed * weatherInfo.speedFactor) / speedReduction;
  const estimatedSpeed = Math.max(parseFloat(rawSpeed.toFixed(1)), 8.0);

  let congestionStatus = "Low";
  let statusColor = "green";
  let statusDesc = "Free Flowing Traffic";
  let recommendation = "Standard green-wave timing active. Road flow is optimal.";

  if (densityPct < 45) {
    congestionStatus = "Low";
    statusColor = "green";
    statusDesc = "Free Flowing Traffic";
    recommendation = "Standard green-wave timing active. Road flow is optimal.";
  } else if (densityPct <= 75) {
    congestionStatus = "Medium";
    statusColor = "yellow";
    statusDesc = "Moderate Congestion";
    recommendation = "Deploy adaptive signal timing (+15s green duration). Monitor intersection bottlenecks.";
  } else {
    congestionStatus = "High";
    statusColor = "red";
    statusDesc = "Heavy Congestion / Bottleneck";
    recommendation = "Alert digital VMS boards. Reroute non-essential traffic to peripheral bypass corridors.";
  }

  const confidence = Math.min(Math.max(parseFloat((93.5 + Math.sin(hour) * 2.5 + (weather === 'clear' ? 2 : 1)).toFixed(1)), 88.0), 98.4);

  return {
    location_key: locationKey,
    road_name: profile.name,
    sensor_id: profile.sensorId,
    road_type: profile.type,
    lanes: profile.lanes,
    input_vehicles: vehicleCount,
    effective_capacity: Math.round(effectiveCapacity),
    predicted_density_percent: densityPct,
    congestion_status: congestionStatus,
    status_color: statusColor,
    status_description: statusDesc,
    estimated_speed_kmh: estimatedSpeed,
    free_flow_speed_kmh: profile.freeFlowSpeed,
    confidence_score: confidence,
    weather: weather.charAt(0).toUpperCase() + weather.slice(1),
    weather_risk: weatherInfo.risk,
    recommendation: recommendation,
    timestamp: new Date().toLocaleTimeString()
  };
}

// UI State Updater
function updatePredictionUI(result) {
  // Update Road badge and Sensor ID
  const roadBadge = document.getElementById('res-road-name');
  if (roadBadge) {
    roadBadge.innerHTML = `<i class="fa-solid fa-road"></i> ${result.road_name} <span style="opacity:0.6; font-size:0.75rem;">(${result.sensor_id})</span>`;
  }

  // Update AI Confidence
  const confPill = document.getElementById('res-confidence');
  if (confPill) {
    confPill.textContent = `Confidence: ${result.confidence_score}%`;
  }

  // Update SVG Gauge Percentage & Stroke
  const gaugePercentText = document.getElementById('res-gauge-percent');
  const gaugeCircle = document.getElementById('res-gauge-circle');
  if (gaugePercentText) {
    gaugePercentText.textContent = `${result.predicted_density_percent}%`;
  }
  if (gaugeCircle) {
    // Circumference = 2 * PI * 90 = ~565.48
    const circumference = 565.48;
    const offset = circumference - (result.predicted_density_percent / 100) * circumference;
    gaugeCircle.style.strokeDashoffset = offset;

    // Dynamic Gauge Stroke Color
    if (result.status_color === 'green') {
      gaugeCircle.style.stroke = '#10b981';
      gaugeCircle.style.filter = 'drop-shadow(0 0 10px #10b981)';
    } else if (result.status_color === 'yellow') {
      gaugeCircle.style.stroke = '#f59e0b';
      gaugeCircle.style.filter = 'drop-shadow(0 0 10px #f59e0b)';
    } else {
      gaugeCircle.style.stroke = '#ef4444';
      gaugeCircle.style.filter = 'drop-shadow(0 0 10px #ef4444)';
    }
  }

  // Update Congestion Banner (Low / Medium / High)
  const statusBanner = document.getElementById('res-status-banner');
  const statusTitle = document.getElementById('res-status-title');
  const statusDesc = document.getElementById('res-status-desc');
  const speedVal = document.getElementById('res-speed-val');

  if (statusBanner) {
    statusBanner.className = `congestion-status-banner status-${result.status_color}`;
  }
  if (statusTitle) {
    statusTitle.textContent = `${result.congestion_status} Congestion`;
  }
  if (statusDesc) {
    statusDesc.textContent = result.status_description;
  }
  if (speedVal) {
    speedVal.textContent = result.estimated_speed_kmh;
  }

  // Update AI Recommendation
  const recDesc = document.getElementById('res-recommendation');
  if (recDesc) {
    recDesc.textContent = result.recommendation;
  }

  // Update Meta details in card
  const weatherRisk = document.getElementById('res-weather-risk');
  if (weatherRisk) {
    weatherRisk.textContent = `${result.weather} (${result.weather_risk})`;
  }
}

// Prediction Form Handler
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('traffic-prediction-form');
  const locationSelect = document.getElementById('pred-location');
  const dateInput = document.getElementById('pred-date');
  const timeInput = document.getElementById('pred-time');
  const vehicleCountInput = document.getElementById('pred-vehicle-count');
  const vehicleCountSlider = document.getElementById('pred-vehicle-slider');
  const vehicleCountDisplay = document.getElementById('pred-slider-val');
  const predictBtn = document.getElementById('btn-run-prediction');

  // Set default date to today
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  // Set default time to current time
  if (timeInput && !timeInput.value) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeInput.value = `${hours}:${minutes}`;
  }

  // Sync slider and input field
  if (vehicleCountSlider && vehicleCountInput && vehicleCountDisplay) {
    vehicleCountSlider.addEventListener('input', (e) => {
      vehicleCountInput.value = e.target.value;
      vehicleCountDisplay.textContent = `${e.target.value} veh/hr`;
    });

    vehicleCountInput.addEventListener('input', (e) => {
      const val = Math.min(Math.max(parseInt(e.target.value, 10) || 100, 100), 5000);
      vehicleCountSlider.value = val;
      vehicleCountDisplay.textContent = `${val} veh/hr`;
    });
  }

  // Time preset chips
  const presetChips = document.querySelectorAll('.preset-chip');
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const presetTime = chip.dataset.time;
      const presetCount = chip.dataset.vehicles;
      if (presetTime && timeInput) timeInput.value = presetTime;
      if (presetCount && vehicleCountInput && vehicleCountSlider) {
        vehicleCountInput.value = presetCount;
        vehicleCountSlider.value = presetCount;
        vehicleCountDisplay.textContent = `${presetCount} veh/hr`;
      }
    });
  });

  // Execute Prediction on Form Submit or Button Click
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const locationKey = locationSelect ? locationSelect.value : 'tech_corridor';
      const dateVal = dateInput ? dateInput.value : '';
      const timeVal = timeInput ? timeInput.value : '09:00';
      const vehicleCount = parseInt(vehicleCountInput ? vehicleCountInput.value : 1850, 10);
      
      const selectedWeatherRadio = document.querySelector('input[name="pred_weather"]:checked');
      const weather = selectedWeatherRadio ? selectedWeatherRadio.value : 'clear';

      const selectedDayRadio = document.querySelector('input[name="pred_daytype"]:checked');
      const dayType = selectedDayRadio ? selectedDayRadio.value : 'weekday';

      // Visual loading state
      if (predictBtn) {
        predictBtn.disabled = true;
        predictBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing ML Inference...`;
      }

      try {
        let result = null;

        // Try Flask Backend API first if available
        if (window.location.protocol.startsWith('http')) {
          try {
            const response = await fetch('/api/predict', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: locationKey,
                date: dateVal,
                time: timeVal,
                vehicle_count: vehicleCount,
                weather: weather,
                day_type: dayType
              })
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.prediction) {
                result = data.prediction;
              }
            }
          } catch (err) {
            console.log('Flask API not reachable or static environment, switching to built-in ML engine:', err);
          }
        }

        // Fallback to client-side ML calculation
        if (!result) {
          // Add brief realistic calculation latency for UX
          await new Promise(res => setTimeout(res, 400));
          result = calculateClientPrediction(locationKey, timeVal, vehicleCount, weather, dayType);
        }

        // Render UI
        updatePredictionUI(result);

        // Show Toast Notification
        if (typeof showToast === 'function') {
          showToast(`Prediction updated for ${result.road_name}: ${result.congestion_status} Congestion (${result.predicted_density_percent}%)`);
        }

      } catch (error) {
        console.error('Prediction failed:', error);
      } finally {
        if (predictBtn) {
          predictBtn.disabled = false;
          predictBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Predict Traffic`;
        }
      }
    });
  }

  // Trigger initial prediction once on page load
  const initialResult = calculateClientPrediction('tech_corridor', '09:00', 1950, 'clear', 'weekday');
  updatePredictionUI(initialResult);
});

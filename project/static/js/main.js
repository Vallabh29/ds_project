/**
 * ==============================================================================
 * INTELLIGENT TRAFFIC PREDICTION SYSTEM - MAIN CONTROLLER (main.js)
 * CSE Academic Project | KLH University | 2026-2027
 * Faculty Guide: DR. N. SUNANDA
 * Team: TAMMISETTI VALLABH RAI, PILLI SHIVA KUMAR, YATA VIGNESHWAR REDDY
 * ==============================================================================
 */

// Road monitoring baseline dataset
let liveRoadsData = [
  {
    id: "tech_corridor",
    name: "Tech Corridor Expressway",
    sensorId: "TC-101",
    type: "Expressway (6 Lanes)",
    vehicles: 2150,
    density: 84,
    speed: 36.4,
    status: "High",
    color: "red",
    roadStatus: "Heavy Gridlock Warning"
  },
  {
    id: "metro_central",
    name: "Metro Central Interchange",
    sensorId: "MC-204",
    type: "Arterial Intersection (4 Lanes)",
    vehicles: 1540,
    density: 76,
    speed: 28.2,
    status: "Medium",
    color: "yellow",
    roadStatus: "Moderate Delay"
  },
  {
    id: "airport_corridor",
    name: "Airport Highway Corridor",
    sensorId: "AH-305",
    type: "Highway (6 Lanes)",
    vehicles: 1120,
    density: 46,
    speed: 68.5,
    status: "Low",
    color: "green",
    roadStatus: "Normal Flow"
  },
  {
    id: "outer_ring",
    name: "Outer Ring Road (North Sector)",
    sensorId: "OR-402",
    type: "Ring Expressway (8 Lanes)",
    vehicles: 1680,
    density: 62,
    speed: 64.0,
    status: "Medium",
    color: "yellow",
    roadStatus: "Moderate Delay"
  },
  {
    id: "cyber_junction",
    name: "Cyber Junction Road",
    sensorId: "CJ-108",
    type: "Urban Crossroad (4 Lanes)",
    vehicles: 1420,
    density: 79,
    speed: 24.8,
    status: "High",
    color: "red",
    roadStatus: "Heavy Congestion"
  },
  {
    id: "financial_district",
    name: "Financial District Avenue",
    sensorId: "FD-506",
    type: "Commercial Arterial (4 Lanes)",
    vehicles: 890,
    density: 42,
    speed: 41.0,
    status: "Low",
    color: "green",
    roadStatus: "Normal Flow"
  }
];

// Live counter animation
function animateCounter(element, target, duration = 1200, isFloat = false, suffix = '') {
  if (!element) return;
  const start = 0;
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic formula
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = start + (target - start) * easeProgress;

    if (isFloat) {
      element.textContent = currentVal.toFixed(1) + suffix;
    } else {
      element.textContent = Math.floor(currentVal).toLocaleString() + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      element.textContent = (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix;
    }
  }

  requestAnimationFrame(updateCount);
}

// Render Road Monitoring Cards
function renderMonitoringCards() {
  const container = document.getElementById('monitoring-cards-container');
  if (!container) return;

  container.innerHTML = liveRoadsData.map(road => {
    let badgeClass = 'badge-low';
    let fillClass = 'low';
    if (road.status === 'Medium') {
      badgeClass = 'badge-medium';
      fillClass = 'medium';
    } else if (road.status === 'High') {
      badgeClass = 'badge-high';
      fillClass = 'high';
    }

    return `
      <div class="monitor-card" data-road-id="${road.id}">
        <div class="monitor-card-header">
          <div>
            <div class="road-name">${road.name}</div>
            <div class="road-type-sub">${road.type}</div>
          </div>
          <span class="sensor-tag">${road.sensorId}</span>
        </div>

        <div class="monitor-stat-row">
          <div class="m-stat">
            <h6>Inflow Rate</h6>
            <p id="road-veh-${road.id}">${road.vehicles.toLocaleString()} <span style="font-size:0.75rem; color:#94a3b8;">veh/hr</span></p>
          </div>
          <div class="m-stat">
            <h6>Avg Velocity</h6>
            <p id="road-spd-${road.id}">${road.speed} <span style="font-size:0.75rem; color:#94a3b8;">km/h</span></p>
          </div>
        </div>

        <div class="density-bar-wrap">
          <div class="density-labels">
            <span style="color:#94a3b8; font-size:0.75rem;">Traffic Density</span>
            <span id="road-den-${road.id}" style="font-weight:700; color:#ffffff; font-size:0.78rem;">${road.density}%</span>
          </div>
          <div class="density-track">
            <div class="density-fill ${fillClass}" id="road-bar-${road.id}" style="width: ${road.density}%;"></div>
          </div>
        </div>

        <div class="monitor-footer">
          <span class="road-status-badge ${badgeClass}" id="road-status-${road.id}">
            <span class="pulse-dot"></span> ${road.status} (${road.roadStatus})
          </span>
          <button class="btn-cam-inspect" onclick="openCCTVModal('${road.id}')">
            <i class="fa-solid fa-video"></i> Radar Feed
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Update Monitoring Telemetry
function updateLiveTelemetry(spikeMode = false) {
  let totalVehicles = 0;
  let totalDensity = 0;
  let totalSpeed = 0;

  liveRoadsData = liveRoadsData.map(road => {
    let delta = (Math.random() * 120 - 55);
    if (spikeMode) delta += 280;

    let newVeh = Math.max(Math.round(road.vehicles + delta), 400);
    // Recalculate density
    let baseCap = road.name.includes("8 Lanes") ? 2600 : road.name.includes("6 Lanes") ? 2200 : 1600;
    let newDensity = Math.min(Math.max(Math.round((newVeh / baseCap) * 100), 12), 98);

    // Recalculate speed using BPR inverse curve
    let rawSpeed = (road.name.includes("Expressway") ? 80 : 55) / (1 + 0.15 * Math.pow(newDensity / 50, 2.5));
    let newSpeed = Math.max(parseFloat(rawSpeed.toFixed(1)), 8.5);

    let status = "Low";
    let color = "green";
    let roadStatus = "Normal Flow";

    if (newDensity > 78) {
      status = "High";
      color = "red";
      roadStatus = "Heavy Congestion";
    } else if (newDensity >= 50) {
      status = "Medium";
      color = "yellow";
      roadStatus = "Moderate Delay";
    }

    totalVehicles += newVeh;
    totalDensity += newDensity;
    totalSpeed += newSpeed;

    return {
      ...road,
      vehicles: newVeh,
      density: newDensity,
      speed: newSpeed,
      status: status,
      color: color,
      roadStatus: roadStatus
    };
  });

  // Re-render road cards
  renderMonitoringCards();

  // Re-compute dashboard global KPI averages
  const avgDensity = Math.round(totalDensity / liveRoadsData.length);
  const avgSpeed = parseFloat((totalSpeed / liveRoadsData.length).toFixed(1));

  const totalVehEl = document.getElementById('kpi-total-vehicles');
  const densityEl = document.getElementById('kpi-current-density');
  const speedEl = document.getElementById('kpi-avg-speed');
  const congBadgeEl = document.getElementById('kpi-congestion-badge');

  if (totalVehEl) totalVehEl.textContent = totalVehicles.toLocaleString();
  if (densityEl) densityEl.textContent = `${avgDensity}%`;
  if (speedEl) speedEl.textContent = `${avgSpeed} km/h`;

  if (congBadgeEl) {
    if (avgDensity > 75) {
      congBadgeEl.className = "kpi-number text-gradient";
      congBadgeEl.style.color = "#ef4444";
      congBadgeEl.textContent = "High";
    } else if (avgDensity >= 50) {
      congBadgeEl.className = "kpi-number text-gradient";
      congBadgeEl.style.color = "#f59e0b";
      congBadgeEl.textContent = "Medium";
    } else {
      congBadgeEl.className = "kpi-number text-gradient";
      congBadgeEl.style.color = "#10b981";
      congBadgeEl.textContent = "Low";
    }
  }
}

// CCTV / Radar Sensor Modal Logic
function openCCTVModal(roadId) {
  const road = liveRoadsData.find(r => r.id === roadId) || liveRoadsData[0];
  const modal = document.getElementById('cctv-modal');
  const title = document.getElementById('cctv-modal-road-title');
  const sensorText = document.getElementById('cctv-sensor-id');
  const hudVeh = document.getElementById('cctv-hud-veh');
  const hudSpeed = document.getElementById('cctv-hud-speed');
  const hudDensity = document.getElementById('cctv-hud-density');

  if (title) title.textContent = road.name;
  if (sensorText) sensorText.textContent = `SENSOR FEED: ${road.sensorId} | STATUS: STREAMING`;
  if (hudVeh) hudVeh.textContent = `${road.vehicles} veh/hr`;
  if (hudSpeed) hudSpeed.textContent = `${road.speed} km/h`;
  if (hudDensity) hudDensity.textContent = `${road.density}%`;

  if (modal) modal.classList.add('active');
}

function closeCCTVModal() {
  const modal = document.getElementById('cctv-modal');
  if (modal) modal.classList.remove('active');
}

// Project Report / Viva Modal
function openReportModal() {
  const modal = document.getElementById('report-modal');
  if (modal) modal.classList.add('active');
}

function closeReportModal() {
  const modal = document.getElementById('report-modal');
  if (modal) modal.classList.remove('active');
}

// Toast Alert System
function showToast(message, icon = 'fa-info-circle') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${icon}" style="color:var(--accent-cyan);"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Clock display in navbar
  const clockElement = document.getElementById('live-nav-clock');
  function updateClock() {
    if (clockElement) {
      const now = new Date();
      clockElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 2. Sticky Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    if (navbar) {
      if (scrollPos > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTop) {
      if (scrollPos > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Scrollspy active link detection
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navLinksList = document.querySelector('.nav-links');
  if (mobileToggle && navLinksList) {
    mobileToggle.addEventListener('click', () => {
      navLinksList.classList.toggle('active');
    });

    // Close mobile menu on clicking any link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('active');
      });
    });
  }

  // 4. Initial KPI Animated Counters
  animateCounter(document.getElementById('kpi-total-vehicles'), 14820);
  animateCounter(document.getElementById('kpi-current-density'), 68, 1200, false, '%');
  animateCounter(document.getElementById('kpi-avg-speed'), 42.5, 1200, true, ' km/h');

  // 5. Initial Render of Simulated Monitoring Cards
  renderMonitoringCards();

  // 6. Monitoring Controls Handlers
  const btnSimFlux = document.getElementById('btn-sim-flux');
  const btnSimSpike = document.getElementById('btn-sim-spike');
  const btnResetFlux = document.getElementById('btn-reset-flux');

  if (btnSimFlux) {
    btnSimFlux.addEventListener('click', () => {
      updateLiveTelemetry(false);
      showToast('Simulated real-time sensor fluctuation updated.', 'fa-arrows-rotate');
    });
  }

  if (btnSimSpike) {
    btnSimSpike.addEventListener('click', () => {
      updateLiveTelemetry(true);
      showToast('Peak-hour rush traffic surge simulated (+280 vehicles/hr)!', 'fa-triangle-exclamation');
    });
  }

  if (btnResetFlux) {
    btnResetFlux.addEventListener('click', () => {
      renderMonitoringCards();
      showToast('Sensors re-calibrated to baseline flow parameters.', 'fa-check');
    });
  }

  // 7. Modal overlay click to dismiss
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // 8. ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCCTVModal();
      closeReportModal();
    }
  });

  // Auto-simulation interval: subtle live update every 12 seconds
  setInterval(() => {
    updateLiveTelemetry(false);
  }, 12000);
});

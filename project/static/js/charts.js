/**
 * ==============================================================================
 * INTELLIGENT TRAFFIC PREDICTION SYSTEM - DATA VISUALIZATION (charts.js)
 * CSE Academic Project | KLH University | 2026-2027
 * ==============================================================================
 * Renders 4 high-performance interactive Chart.js visualizations:
 * 1. Traffic Volume Over Time (Historical vs Predicted Line Chart)
 * 2. Hourly Traffic Density (24-Hour Cycle Bar Chart)
 * 3. Vehicle Distribution Breakdown (Doughnut Chart)
 * 4. Corridor Congestion Comparison (Comparative Horizontal Bar Chart)
 */

let volumeChart = null;
let hourlyDensityChart = null;
let vehicleDistChart = null;
let corridorChart = null;

// Global Chart.js Defaults for Dark Cyberpunk Theme
if (typeof Chart !== 'undefined') {
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(7, 15, 30, 0.95)';
  Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
  Chart.defaults.plugins.tooltip.bodyColor = '#00f2fe';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(0, 242, 254, 0.3)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.boxWidth = 8;
  Chart.defaults.plugins.legend.labels.padding = 15;
}

// Analytics Datasets for different filter modes
const ANALYTICS_DATASETS = {
  today: {
    volume: {
      labels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
      historical: [410, 220, 940, 2480, 1680, 1920, 2810, 1290],
      predicted: [390, 230, 990, 2550, 1620, 1980, 2890, 1220]
    },
    density: {
      labels: ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
      values: [32, 82, 88, 54, 49, 71, 94, 76, 42]
    },
    corridors: {
      labels: ["Tech Corridor", "Metro Central", "Airport Hwy", "Outer Ring", "Cyber Jct", "Fin District"],
      values: [86, 78, 56, 64, 82, 51]
    }
  },
  weekly: {
    volume: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      historical: [2650, 2720, 2810, 2790, 3100, 1940, 1620],
      predicted: [2680, 2750, 2800, 2840, 3150, 1900, 1580]
    },
    density: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [78, 81, 84, 83, 91, 58, 48]
    },
    corridors: {
      labels: ["Tech Corridor", "Metro Central", "Airport Hwy", "Outer Ring", "Cyber Jct", "Fin District"],
      values: [82, 74, 60, 68, 76, 55]
    }
  },
  peakhours: {
    volume: {
      labels: ["07:30", "08:00", "08:30", "09:00", "09:30", "17:30", "18:00", "18:30", "19:00", "19:30"],
      historical: [1850, 2290, 2680, 2850, 2410, 2180, 2790, 3040, 2920, 2350],
      predicted: [1890, 2340, 2720, 2910, 2450, 2220, 2840, 3110, 2960, 2380]
    },
    density: {
      labels: ["07:30", "08:00", "08:30", "09:00", "09:30", "17:30", "18:00", "18:30", "19:00", "19:30"],
      values: [68, 84, 91, 95, 82, 78, 92, 98, 94, 79]
    },
    corridors: {
      labels: ["Tech Corridor", "Metro Central", "Airport Hwy", "Outer Ring", "Cyber Jct", "Fin District"],
      values: [94, 89, 72, 79, 92, 68]
    }
  }
};

/**
 * 1. Initialize Traffic Volume Over Time Line Chart
 */
function initVolumeChart(ctx, data) {
  const gradientHist = ctx.createLinearGradient(0, 0, 0, 260);
  gradientHist.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
  gradientHist.addColorStop(1, 'rgba(0, 242, 254, 0.01)');

  const gradientPred = ctx.createLinearGradient(0, 0, 0, 260);
  gradientPred.addColorStop(0, 'rgba(217, 70, 239, 0.35)');
  gradientPred.addColorStop(1, 'rgba(217, 70, 239, 0.01)');

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Historical Actual (veh/hr)',
          data: data.historical,
          borderColor: '#00f2fe',
          backgroundColor: gradientHist,
          borderWidth: 2.5,
          tension: 0.38,
          fill: true,
          pointBackgroundColor: '#00f2fe',
          pointBorderColor: '#070f1e',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'AI Predicted (veh/hr)',
          data: data.predicted,
          borderColor: '#d946ef',
          backgroundColor: gradientPred,
          borderWidth: 2.5,
          borderDash: [5, 4],
          tension: 0.38,
          fill: true,
          pointBackgroundColor: '#d946ef',
          pointBorderColor: '#070f1e',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#94a3b8' }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#94a3b8' },
          title: {
            display: true,
            text: 'Vehicles / Hour',
            color: '#64748b'
          }
        }
      }
    }
  });
}

/**
 * 2. Initialize Hourly Traffic Density Bar Chart
 */
function initHourlyDensityChart(ctx, data) {
  const gradientBar = ctx.createLinearGradient(0, 0, 0, 260);
  gradientBar.addColorStop(0, '#00f2fe');
  gradientBar.addColorStop(1, '#4facfe');

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Traffic Density (%)',
        data: data.values,
        backgroundColor: data.values.map(v => {
          if (v >= 80) return '#ef4444';
          if (v >= 55) return '#f59e0b';
          return '#10b981';
        }),
        borderRadius: 6,
        borderWidth: 0,
        barPercentage: 0.65
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: {
            color: '#94a3b8',
            callback: value => `${value}%`
          },
          title: {
            display: true,
            text: 'Density Ratio (%)',
            color: '#64748b'
          }
        }
      }
    }
  });
}

/**
 * 3. Initialize Vehicle Distribution Doughnut Chart
 */
function initVehicleDistChart(ctx) {
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Cars / Sedans", "Two-Wheelers", "Heavy Trucks", "Transit Buses", "Emergency Vehicles"],
      datasets: [{
        data: [52, 26, 11, 9, 2],
        backgroundColor: [
          '#00f2fe',
          '#4facfe',
          '#f59e0b',
          '#7928ca',
          '#ef4444'
        ],
        borderColor: '#070f1e',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#cbd5e1',
            font: { size: 11 },
            padding: 12
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.raw}% share`
          }
        }
      }
    }
  });
}

/**
 * 4. Initialize Corridor Congestion Comparative Bar Chart
 */
function initCorridorChart(ctx, data) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Congestion Index (%)',
        data: data.values,
        backgroundColor: data.values.map(val => {
          if (val > 80) return 'rgba(239, 68, 68, 0.85)';
          if (val > 60) return 'rgba(245, 158, 11, 0.85)';
          return 'rgba(16, 185, 129, 0.85)';
        }),
        borderColor: data.values.map(val => {
          if (val > 80) return '#ef4444';
          if (val > 60) return '#f59e0b';
          return '#10b981';
        }),
        borderWidth: 1.5,
        borderRadius: 6,
        barPercentage: 0.65
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: {
            color: '#94a3b8',
            callback: value => `${value}%`
          }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#ffffff', font: { weight: '600' } }
        }
      }
    }
  });
}

/**
 * Filter Switcher to dynamically update charts
 */
function switchAnalyticsFilter(mode) {
  const currentData = ANALYTICS_DATASETS[mode] || ANALYTICS_DATASETS.today;

  // Update Line Chart
  if (volumeChart) {
    volumeChart.data.labels = currentData.volume.labels;
    volumeChart.data.datasets[0].data = currentData.volume.historical;
    volumeChart.data.datasets[1].data = currentData.volume.predicted;
    volumeChart.update('active');
  }

  // Update Density Chart
  if (hourlyDensityChart) {
    hourlyDensityChart.data.labels = currentData.density.labels;
    hourlyDensityChart.data.datasets[0].data = currentData.density.values;
    hourlyDensityChart.data.datasets[0].backgroundColor = currentData.density.values.map(v => {
      if (v >= 80) return '#ef4444';
      if (v >= 55) return '#f59e0b';
      return '#10b981';
    });
    hourlyDensityChart.update('active');
  }

  // Update Corridor Chart
  if (corridorChart) {
    corridorChart.data.labels = currentData.corridors.labels;
    corridorChart.data.datasets[0].data = currentData.corridors.values;
    corridorChart.data.datasets[0].backgroundColor = currentData.corridors.values.map(val => {
      if (val > 80) return 'rgba(239, 68, 68, 0.85)';
      if (val > 60) return 'rgba(245, 158, 11, 0.85)';
      return 'rgba(16, 185, 129, 0.85)';
    });
    corridorChart.data.datasets[0].borderColor = currentData.corridors.values.map(val => {
      if (val > 80) return '#ef4444';
      if (val > 60) return '#f59e0b';
      return '#10b981';
    });
    corridorChart.update('active');
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const volCtx = document.getElementById('chart-traffic-volume');
  const denCtx = document.getElementById('chart-hourly-density');
  const distCtx = document.getElementById('chart-vehicle-dist');
  const corCtx = document.getElementById('chart-corridor-comp');

  if (volCtx) volumeChart = initVolumeChart(volCtx.getContext('2d'), ANALYTICS_DATASETS.today.volume);
  if (denCtx) hourlyDensityChart = initHourlyDensityChart(denCtx.getContext('2d'), ANALYTICS_DATASETS.today.density);
  if (distCtx) vehicleDistChart = initVehicleDistChart(distCtx.getContext('2d'));
  if (corCtx) corridorChart = initCorridorChart(corCtx.getContext('2d'), ANALYTICS_DATASETS.today.corridors);

  // Tab switchers
  const filterBtns = document.querySelectorAll('.chart-tab-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.filter || 'today';
      switchAnalyticsFilter(mode);
    });
  });
});

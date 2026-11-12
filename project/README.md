# INTELLIGENT TRAFFIC PREDICTION SYSTEM
### Computer Science & Engineering Academic Project | KLH University | 2026–2027

---

## 📌 Project Overview
The **Intelligent Traffic Prediction System (ITPS)** is an AI-powered urban traffic monitoring and congestion forecasting platform. It addresses the growing challenge of metropolitan vehicular gridlock by analyzing historical traffic data, environmental conditions, and real-time sensor streams to predict traffic density, average velocity, and congestion severity before bottlenecking occurs.

---

## 👥 Academic Credentials

- **Institution:** KLH University
- **Department:** Computer Science and Engineering (CSE)
- **Academic Year:** 2026–2027
- **Faculty Guide:** **DR. N. SUNANDA**

### 🎓 Project Team
1. **TAMMISETTI VALLABH RAI** – `2420030029` (Team Lead & ML Algorithm Engineer)
2. **PILLI SHIVA KUMAR** – `2420030030` (Backend Architect & Data Modeling)
3. **YATA VIGNESHWAR REDDY** – `2420030203` (Frontend Dashboard & Data Visualization)

---

## 🚀 Key Features

1. **Smart City Traffic Dashboard:**
   - Real-time counters for **Total Vehicles**, **Current Traffic Density**, **Average Vehicle Speed**, and **Congestion Level**.
   - Glassmorphic UI with animated gradients, dark navy palette, and status glow indicators.

2. **Interactive AI Traffic Prediction Interface:**
   - Dropdown selection of 6 major urban road corridors (Expressways, Ring Roads, Commercial Arterials).
   - Date and time selectors with one-click commute rush presets (Morning Rush, Afternoon, Evening Peak, Late Night).
   - Vehicle inflow rate slider with synchronized numerical inputs.
   - Environmental factors: Weather conditions (Clear, Rainy, Foggy, Storm) and Day types (Weekday, Weekend, Holiday).
   - Dynamic SVG circular gauge animating predicted traffic density (%).
   - Congestion classification badges:
     - 🟢 **Green** – Low Traffic / Free Flow
     - 🟡 **Yellow** – Medium Traffic / Moderate Congestion
     - 🔴 **Red** – High Traffic / Heavy Bottleneck Warning
   - Estimated average vehicle speed (km/h) and confidence rating (92%–98%).
   - Algorithmic traffic recommendations (e.g., adaptive signal phase timing, dynamic rerouting).

3. **Interactive Traffic Analytics (Chart.js):**
   - **Traffic Volume Over Time:** Historical actual vs. AI-predicted volume curve.
   - **Hourly Traffic Density:** 24-hour cycle showing diurnal commuter rush curves.
   - **Vehicle Distribution:** Modal split of Cars, Two-Wheelers, Trucks, Buses, and Emergency Vehicles.
   - **Corridor Congestion Comparison:** Ranked comparative analysis of 6 key arterial corridors.
   - Interactive timeframe filters: *Live Today*, *7-Day Trend*, and *Peak Rush Hours*.

4. **Simulated Live Road Monitoring:**
   - Real-time status cards for 6 sectors (Sensor IDs: `TC-101`, `MC-204`, `AH-305`, `OR-402`, `CJ-108`, `FD-506`).
   - "Simulate Real-Time Fluctuation" and "Simulate Rush Hour Surge" controls.
   - Interactive **CCTV & Radar Sensor Modal** featuring scanlines, live telemetry, and optical bounding boxes.

5. **Viva Presentation & Executive Summary Sheet:**
   - Built-in printable report modal summarizing the project abstract, formulas, team roles, and guide credentials for college examinations.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, Modern JavaScript (ES6+), Inter font, CSS Glassmorphism |
| **Backend** | Python Flask, REST API (`/api/predict`, `/api/monitoring`, `/api/analytics`) |
| **Data Visualization** | Chart.js 4 (Dual-series line, multi-colored bar, doughnut, horizontal bar) |
| **Icons & Media** | Font Awesome 6.5.1, Custom SVG vector highway graphics & architecture diagrams |
| **ML Models & Logic** | Greenshields Traffic Flow Model, Bureau of Public Roads (BPR) velocity equation, Spatial-temporal rush hour regression |

---

## 📂 Project Directory Structure

```text
project/
├── app.py                     # Python Flask backend server with REST endpoints
├── requirements.txt           # Python dependencies (Flask, flask-cors, scikit-learn, numpy)
├── index.html                 # Standalone master HTML (direct browser preview & deployment)
├── README.md                  # Project documentation & presentation notes
├── model/
│   ├── __init__.py
│   └── traffic_model.py       # Core Machine Learning prediction engine & road profiles
├── static/
│   ├── css/
│   │   └── style.css          # Dark theme, neon cyan/purple gradients, responsive styles
│   ├── js/
│   │   ├── main.js            # UI animations, live counters, telemetry simulation, modals
│   │   ├── charts.js          # Chart.js instances, gradients, filter toggle logic
│   │   └── prediction.js      # Form handler, Flask API call & client ML fallback engine
│   └── images/
│       ├── logo.svg           # Cyber traffic AI brand logo
│       ├── traffic-hero-bg.svg# Futuristic highway vector illustration
│       └── architecture.svg   # 4-stage end-to-end system architecture diagram
└── templates/
    └── index.html             # Flask template copy
```

---

## 🖥️ How to Run the Website

### Method 1: Instant Standalone Execution (No Setup Required)
You can open the website immediately in any modern web browser:
1. Navigate to the project directory.
2. Double-click **`index.html`** or right-click and choose **Open with Google Chrome / Microsoft Edge / Firefox**.
3. *The website includes a complete built-in client-side Machine Learning simulation engine, so all predictions, charts, simulations, and animations run 100% locally with zero internet or server dependencies!*

---

### Method 2: Running with Python Flask Backend
When presenting on a machine with Python installed:

1. Open your terminal / PowerShell in the project directory:
   ```bash
   cd c:\Users\Sirigireddy\OneDrive\Desktop\project
   ```

2. Install dependencies (optional, Flask is lightweight):
   ```bash
   pip install -r requirements.txt
   ```

3. Launch the Python Flask server:
   ```bash
   python app.py
   ```

4. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```

---

## 🧠 Machine Learning & Mathematical Formulation

### 1. Greenshields Traffic Density Model
The system calculates the volume-to-capacity ($V/C$) ratio adjusted for temporal rush periods:
$$\text{Density (\%)} = \min\left(\max\left(\frac{V}{C_{\text{eff}}} \times [0.65 + 0.35 \times T(t)] \times D_{\text{type}} \times 100, 5\right), 98\right)$$
Where:
- $V$ = Inflow vehicle count (veh/hr)
- $C_{\text{eff}} = C_{\text{base}} \times W_{\text{factor}}$ (Effective capacity adjusted for weather)
- $T(t)$ = Gaussian time-of-day peak rush multiplier ($08:00–10:30$ and $17:30–20:30$)
- $D_{\text{type}}$ = Day multiplier ($1.0$ for weekdays, $0.78$ for weekends)

### 2. Bureau of Public Roads (BPR) Speed Estimation
The estimated vehicle speed is derived from the standard empirical BPR function:
$$S = \frac{S_0 \times W_{\text{speed}}}{1 + \alpha \left(\frac{V}{C_{\text{eff}}}\right)^\beta}$$
Where:
- $S_0$ = Free-flow corridor design speed ($45–85\text{ km/h}$)
- $\alpha = 0.15, \beta = 4.0$ (BPR standard congestion calibration coefficients)
- $W_{\text{speed}}$ = Weather deceleration factor ($1.0$ for Clear, $0.78$ for Rainy, $0.70$ for Foggy, $0.60$ for Storm)

---

## 🌟 College Presentation Highlights
- **Smart Adaptive Recommendations:** Generates real-time actionable traffic signal timing changes (e.g., *"+15s Green light duration"*).
- **Incident Simulation:** Demonstrate how the system reacts to rush hour surges by clicking *"Simulate Rush Hour Surge"* in the Monitoring section.
- **Viva Sheet:** Click the *"Viva Sheet"* button in the top navbar to showcase the executive project summary and print/save a copy for viva examiners.

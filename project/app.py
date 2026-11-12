"""
=============================================================================
INTELLIGENT TRAFFIC PREDICTION SYSTEM - BACKEND SERVER
=============================================================================
Academic Project: Computer Science and Engineering (CSE)
Institution: KLH University
Academic Year: 2026-2027

Team Members:
  1. TAMMISETTI VALLABH RAI - 2420030029
  2. PILLI SHIVA KUMAR       - 2420030030
  3. YATA VIGNESHWAR REDDY   - 2420030203

Faculty Guide:
  DR. N. SUNANDA
=============================================================================
"""

import os
import json
from datetime import datetime
from model.traffic_model import TrafficPredictionModel

try:
    from flask import Flask, render_template, request, jsonify, send_from_directory
    from flask_cors import CORS
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False

if FLASK_AVAILABLE:
    app = Flask(__name__, 
                static_folder="static", 
                template_folder="templates")
    try:
        CORS(app)
    except Exception:
        pass

    predictor = TrafficPredictionModel()

    @app.route("/")
    def index():
        """Serves the main intelligent traffic dashboard."""
        return render_template("index.html")

    @app.route("/api/health", methods=["GET"])
    def health_check():
        """Returns API health, system metrics, and academic meta info."""
        return jsonify({
            "status": "online",
            "service": "Intelligent Traffic Prediction System API",
            "version": "2.4.0",
            "institution": "KLH University",
            "department": "Computer Science and Engineering",
            "academic_year": "2026-2027",
            "faculty_guide": "DR. N. SUNANDA",
            "team": [
                {"name": "TAMMISETTI VALLABH RAI", "id": "2420030029"},
                {"name": "PILLI SHIVA KUMAR", "id": "2420030030"},
                {"name": "YATA VIGNESHWAR REDDY", "id": "2420030203"}
            ],
            "server_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })

    @app.route("/api/predict", methods=["POST"])
    def predict_traffic():
        """
        Predicts traffic congestion level, density percentage,
        and estimated speed based on road, time, vehicle count, and weather.
        """
        data = request.get_json(silent=True) or {}
        location_key = data.get("location", "tech_corridor")
        date_str = data.get("date", datetime.now().strftime("%Y-%m-%d"))
        time_str = data.get("time", "09:00")
        try:
            vehicle_count = int(data.get("vehicle_count", 1850))
        except (ValueError, TypeError):
            vehicle_count = 1850

        weather = data.get("weather", "clear")
        day_type = data.get("day_type", "weekday")

        result = predictor.predict(
            location_key=location_key,
            date_str=date_str,
            time_str=time_str,
            vehicle_count=vehicle_count,
            weather=weather,
            day_type=day_type
        )
        return jsonify({"success": True, "prediction": result})

    @app.route("/api/monitoring", methods=["GET"])
    def get_monitoring_data():
        """Returns real-time simulated telemetry for 6 smart road segments."""
        roads = predictor.get_monitoring_roads()
        return jsonify({"success": True, "roads": roads})

    @app.route("/api/analytics", methods=["GET"])
    def get_analytics_data():
        """Returns aggregated chart analytics data for traffic volume, hourly trends, and vehicle mix."""
        analytics = {
            "volume_over_time": {
                "labels": ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
                "historical": [320, 180, 890, 2450, 1620, 1890, 2780, 1150],
                "predicted": [310, 195, 920, 2520, 1590, 1940, 2850, 1100]
            },
            "hourly_density": {
                "labels": ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
                "density": [28, 79, 86, 52, 48, 67, 92, 74, 38]
            },
            "vehicle_distribution": {
                "labels": ["Cars / Sedans", "Two-Wheelers", "Heavy Trucks", "Public Transit Buses", "Emergency Vehicles"],
                "percentages": [52, 26, 11, 9, 2]
            },
            "corridor_comparison": {
                "labels": ["Tech Corridor", "Metro Central", "Airport Hwy", "Outer Ring", "Cyber Jct", "Fin District"],
                "densities": [84, 76, 54, 62, 79, 48]
            }
        }
        return jsonify({"success": True, "analytics": analytics})

if __name__ == "__main__":
    if FLASK_AVAILABLE:
        print("=" * 70)
        print("  INTELLIGENT TRAFFIC PREDICTION SYSTEM - FLASK SERVER")
        print("  KLH University - CSE Department (2026-2027)")
        print("  Faculty Guide: DR. N. SUNANDA")
        print("  Starting local server at http://127.0.0.1:5000")
        print("=" * 70)
        app.run(host="127.0.0.1", port=5000, debug=True)
    else:
        print("Flask is not installed in the current environment.")
        print("To run with Flask backend, install Flask: pip install flask flask-cors")
        print("Alternatively, open index.html directly in any web browser - it includes a full client-side ML engine!")

"""Flood risk calculation, alert level mapping, and SitRep generation."""
from dataclasses import dataclass
from datetime import datetime, timezone


@dataclass
class AlertInfo:
    level: str  # 'red' | 'orange' | 'yellow' | 'green' | 'insufficient'
    title: str
    bg_color: str
    action_msg: str
    marker_color: str
    text_color: str


def calculate_rain(rain: float) -> float:
    if 0 < rain <= 5:
        return rain * 4
    elif 5 < rain <= 15:
        return 20 + (rain - 5) * 3
    elif rain > 15:
        return 50 + (rain - 15) * 2
    return 0


def calculate_river(river_level: float, danger_mark: float) -> float:
    if danger_mark <= 0:
        return 0
    ratio = river_level / danger_mark
    if ratio > 0.7:
        return (ratio - 0.7) * 100
    return 0


def calculate_humidity(humidity: float) -> float:
    if humidity > 70:
        return (humidity - 70) * 0.33
    return 0


def calculate_risk(
    rain: float,
    river_level: float,
    humidity: float,
    danger_mark: float = 0,
) -> int:
    score = 0
    score += calculate_rain(rain)
    score += calculate_river(river_level, danger_mark)
    score += calculate_humidity(humidity)

    river_ratio = river_level / danger_mark if danger_mark > 0 else 0
    if rain == 0 and river_ratio < 0.95:
        score = min(score, 28)

    return max(0, min(100, round(score)))


def get_alert_info(risk_score: float | None, location_name: str) -> AlertInfo:
    if risk_score is None:
        return AlertInfo(
            level="insufficient",
            title=f"DATA INSUFFICIENT ({location_name.upper()}: UNABLE TO ASSESS RISK)",
            bg_color="#455A64",
            action_msg=f"Live weather data for {location_name} is currently unavailable. "
            f"Risk status cannot be determined. Please retry or check alternative sources.",
            marker_color="gray",
            text_color="#ffffff",
        )
    if risk_score >= 81:
        return AlertInfo(
            level="red",
            title=f"RED ALERT ({location_name.upper()}: EMERGENCY EVACUATION)",
            bg_color="#D32F2F",
            action_msg=f"Extreme flood risk in {location_name}! Evacuate immediately to designated relief camps.",
            marker_color="red",
            text_color="#ffffff",
        )
    elif risk_score >= 61:
        return AlertInfo(
            level="orange",
            title=f"ORANGE ALERT ({location_name.upper()}: PREPARE TO EVACUATE)",
            bg_color="#EF6C00",
            action_msg=f"High risk in {location_name}. Live weather shows heavy rainfall. Prepare to evacuate.",
            marker_color="orange",
            text_color="#ffffff",
        )
    elif risk_score >= 31:
        return AlertInfo(
            level="yellow",
            title=f"YELLOW ALERT ({location_name.upper()}: WATCH & MONITOR)",
            bg_color="#FBC02D",
            action_msg=f"Moderate risk in {location_name}. Stay updated on weather conditions.",
            marker_color="beige",
            text_color="#1a1a1a",
        )
    return AlertInfo(
        level="green",
        title=f"GREEN ALERT ({location_name.upper()}: SAFE CONDITIONS)",
        bg_color="#388E3C",
        action_msg=f"Normal conditions in {location_name}. No immediate threat detected from live weather feeds.",
        marker_color="green",
        text_color="#ffffff",
    )


def generate_sitrep(
    location_name: str,
    risk_score: float | None,
    alert_title: str,
    rain: float,
    river_level: float,
    danger_mark: float,
    humidity: float,
    action_msg: str,
) -> str:
    now = datetime.now(timezone.utc).isoformat().replace("T", " ")[:19]
    score_text = "N/A (Data Insufficient)" if risk_score is None else f"{risk_score:.0f} / 100"
    return f"""==================================================
NATIONAL DISASTER MANAGEMENT AUTHORITY (NDMA)
AUTOMATED SITUATION REPORT (SITREP) - SIH 2026
==================================================
Timestamp       : {now}
Target Location : {location_name}
Risk Index Score: {score_text}
Current Status  : {alert_title}
--------------------------------------------------
METEOROLOGICAL TELEMETRY DATA:
- Live Rainfall          : {rain} mm/hr
- Estimated Water Level  : {river_level} m (Danger Mark: {danger_mark}m)
- Soil Humidity          : {humidity}%
--------------------------------------------------
RECOMMENDED ACTION DIRECTIVE:
{action_msg}
--------------------------------------------------
DESIGNATED RELIEF HUBS & ROUTES:
1. Govt Primary School (1.2 km) - Status: OPEN (Safe Corridor Active)
2. Panchayat Bhawan (2.5 km)   - Status: OPEN
3. Community Centre (3.8 km)   - Status: STANDBY
=================================================="""

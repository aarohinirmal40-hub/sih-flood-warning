"""
Aapda Seva — Streamlit Flood Warning & Emergency Response Platform
SIH 2026 (SIH26192)

Run with:  streamlit run streamlit_app.py
"""
import sys
import os
import random
from datetime import datetime

import streamlit as st

# Ensure the package directory is importable
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(_file_)), "streamlit_app"))

from risk import calculate_risk, get_alert_info, generate_sitrep, AlertInfo  # noqa: E402
from locations import (  # noqa: E402
    REGIONAL_DATABASE, DEFAULT_LOCATION, fetch_weather, search_locations,
    estimate_danger, WeatherData, SearchResult,
)
from translations import LANGUAGES, get_ui_text, translate_alert  # noqa: E402
from supabase_client import fetch_reports, insert_report  # noqa: E402

# ── Optional deps ──────────────────────────────────────────────────────
try:
    import folium
    from streamlit_folium import st_folium
    HAS_FOLIUM = True
except ImportError:
    HAS_FOLIUM = False

try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False

try:
    import plotly.graph_objects as go
    HAS_PLOTLY = True
except ImportError:
    HAS_PLOTLY = False

try:
    from supabase import create_client as _sb_create  # noqa: F401
    HAS_SUPABASE = True
except ImportError:
    HAS_SUPABASE = False


# ── Page config ────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Aapda Seva — Flood Warning Portal",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Dark theme CSS
st.markdown("""
<style>
    /* Dark emergency command-center theme */
    .stApp { background: #0f172a; color: #e2e8f0; }
    .stSidebar > div { background: #1e293b; }
    .stMarkdown, .stText, p, span, li, label { color: #e2e8f0 !important; }
    h1, h2, h3, h4 { color: #f1f5f9 !important; }
    .stButton > button {
        border-radius: 8px; font-weight: 600; transition: all 0.2s;
    }
    .stMetric {
        background: #1e293b; border: 1px solid #334155; border-radius: 12px;
        padding: 16px; border-radius: 12px;
    }
    .stMetric label { color: #94a3b8 !important; font-size: 0.75rem; }
    .stMetric value { color: #f1f5f9 !important; font-size: 1.5rem; font-weight: 700; }
    div[data-testid="stAlert"] { border-radius: 12px; }
    .risk-banner {
        border-radius: 12px; padding: 16px 20px; text-align: center;
        font-weight: 700; font-size: 1.1rem; margin-bottom: 16px;
    }
    .data-badge-live {
        background: #1b4332; color: #66bb6a; padding: 2px 10px;
        border-radius: 999px; font-size: 0.7rem; font-weight: 700;
    }
    .data-badge-unavailable {
        background: #334155; color: #94a3b8; padding: 2px 10px;
        border-radius: 999px; font-size: 0.7rem; font-weight: 700;
    }
    .data-badge-simulated {
        background: #78350f; color: #fbbf24; padding: 2px 10px;
        border-radius: 999px; font-size: 0.7rem; font-weight: 700;
    }
    .card {
        background: #1e293b; border: 1px solid #334155;
        border-radius: 12px; padding: 20px; margin-bottom: 16px;
    }
    .sos-button button {
        background: #dc2626 !important; color: white !important;
        font-size: 1.2rem !important; font-weight: 800 !important;
        padding: 20px !important; border-radius: 50% !important;
        width: 120px !important; height: 120px !important;
    }
</style>
""", unsafe_allow_html=True)


# ── Session state init ─────────────────────────────────────────────────
def init_state():
    defaults = {
        "lang_key": "en",
        "selected_name": DEFAULT_LOCATION["name"],
        "lat": DEFAULT_LOCATION["lat"],
        "lon": DEFAULT_LOCATION["lon"],
        "danger_mark": DEFAULT_LOCATION["danger"],
        "weather": None,
        "broadcast_log": [],
        "family_members": [
            {"name": "Demo Member", "phone": "+91 98765 43210", "status": "unknown", "last_checkin": None},
        ],
        "chat_messages": [],
    }
    for k, v in defaults.items():
        if k not in st.session_state:
            st.session_state[k] = v


init_state()


# ── Helper functions ───────────────────────────────────────────────────
def fmt(val, suffix="", decimals=1):
    if val is None:
        return "—"
    return f"{val:.{decimals}f}{suffix}"


def data_badge(weather: WeatherData | None):
    if weather is None or not weather.success:
        return '<span class="data-badge-unavailable">UNAVAILABLE</span>'
    return '<span class="data-badge-live">LIVE</span>'


def get_river_level(weather: WeatherData | None, danger_mark: float) -> float | None:
    if weather is None or weather.rain is None:
        return None
    return round(danger_mark + weather.rain * 0.05, 2)


def get_risk_score(weather: WeatherData | None, river_level: float | None, danger_mark: float) -> float | None:
    if weather is None or weather.rain is None or weather.humidity is None or river_level is None:
        return None
    return calculate_risk(weather.rain, river_level, weather.humidity, danger_mark)


def fetch_and_store_weather():
    w = fetch_weather(st.session_state.lat, st.session_state.lon)
    st.session_state.weather = w


# ── Sidebar ─────────────────────────────────────────────────────────────
def render_sidebar():
    t = get_ui_text(st.session_state.lang_key)

    with st.sidebar:
        st.markdown(f"### 🌐 {t['sidebar_lang']}")
        lang_options = {l["key"]: l["label"] for l in LANGUAGES}
        lang_key = st.selectbox(
            t["sidebar_lang"],
            options=list(lang_options.keys()),
            format_func=lambda k: lang_options[k],
            index=list(lang_options.keys()).index(st.session_state.lang_key),
            key="lang_selector",
        )
        if lang_key != st.session_state.lang_key:
            st.session_state.lang_key = lang_key
            st.rerun()

        t = get_ui_text(st.session_state.lang_key)

        st.markdown(f"### 📍 {t['sidebar_location']}")

        mode = st.radio(
            t["sidebar_location"],
            [t["auto_gps"], t["smart_search"]],
            key="location_mode",
            horizontal=True,
        )

        if t["auto_gps"] in mode:
            st.markdown(f"_{t.get('auto_gps', 'Auto GPS')}_")
            if st.button("📍 Get My Location", use_container_width=True):
                st.info("GPS requires browser access. Enter coordinates manually below.")
            col1, col2 = st.columns(2)
            with col1:
                lat_val = st.number_input("Latitude", value=st.session_state.lat, format="%.4f", key="gps_lat")
            with col2:
                lon_val = st.number_input("Longitude", value=st.session_state.lon, format="%.4f", key="gps_lon")
            if st.button("Set GPS Coordinates", use_container_width=True):
                st.session_state.lat = lat_val
                st.session_state.lon = lon_val
                st.session_state.danger_mark = estimate_danger(lat_val, lon_val)
                st.session_state.selected_name = f"GPS ({lat_val:.2f}, {lon_val:.2f})"
                fetch_and_store_weather()
                st.rerun()
        else:
            search_query = st.text_input(
                "Search any village, city, town...",
                key="live_search",
                placeholder=t["search_placeholder"],
            )
            if search_query and len(search_query) >= 2:
                results = search_locations(search_query)
                if results:
                    options = [r.display_name for r in results]
                    selected = st.selectbox(
                        "Select location:",
                        options=options,
                        key="search_result_select",
                    )
                    if st.button("Use This Location", use_container_width=True):
                        idx = options.index(selected)
                        r = results[idx]
                        st.session_state.selected_name = r.display_name.split(",")[:3][0]
                        st.session_state.lat = r.lat
                        st.session_state.lon = r.lon
                        st.session_state.danger_mark = estimate_danger(r.lat, r.lon)
                        fetch_and_store_weather()
                        st.rerun()
                else:
                    st.info("No locations found. Try a different search.")

            st.markdown("**Quick select high-risk zones:**")
            regional_names = list(REGIONAL_DATABASE.keys())
            selected_regional = st.selectbox(
                "High-risk zones",
                regional_names,
                index=regional_names.index(st.session_state.selected_name) if st.session_state.selected_name in regional_names else 0,
                key="regional_select",
                label_visibility="collapsed",
            )
            if selected_regional and selected_regional != st.session_state.selected_name:
                loc = REGIONAL_DATABASE[selected_regional]
                st.session_state.selected_name = selected_regional
                st.session_state.lat = loc["lat"]
                st.session_state.lon = loc["lon"]
                st.session_state.danger_mark = loc["danger"]
                fetch_and_store_weather()
                st.rerun()

        # Live climate panel
        st.markdown("---")
        st.markdown(f"### 📡 {t.get('live_rainfall', 'Live Climate Feed')}")
        weather = st.session_state.weather
        if weather is None:
            st.info(t.get("fetching_weather", "Fetching live weather..."))
            fetch_and_store_weather()
            weather = st.session_state.weather
            st.rerun()

        if weather and weather.success:
            st.success(t.get("api_synced", "API Synced!"))
        else:
            st.warning(t.get("api_offline", "API Offline"))

        st.markdown(f"**{t.get('target_location', 'Location')}**")
        st.markdown(f"_{st.session_state.selected_name}_")

        col1, col2 = st.columns(2)
        with col1:
            st.metric(t.get("live_temp", "Temp"), fmt(weather.temperature if weather else None, "°C"))
            st.metric(t.get("live_rainfall", "Rain"), fmt(weather.rain if weather else None, " mm/hr"))
            st.metric(t.get("soil_humidity", "Humidity"), fmt(weather.humidity if weather else None, "%", 0))
        with col2:
            st.metric(t.get("feels_like", "Feels"), fmt(weather.feels_like if weather else None, "°C"))
            st.metric(t.get("wind_speed", "Wind"), fmt(weather.wind_speed if weather else None, " km/h"))
            st.metric(t.get("cloud_cover", "Cloud"), fmt(weather.cloud_cover if weather else None, "%", 0))

        if weather and weather.weather_desc:
            st.markdown(f"**{t.get('weather_condition', 'Weather')}**: {weather.weather_desc}")

    return t


# ── Tab renderers ──────────────────────────────────────────────────────

def tab_live_risk(t, weather, river_level, risk_score, alert, broadcast_log):
    """Tab 0: Live Risk Dashboard"""
    # Alert banner
    st.markdown(
        f'<div class="risk-banner" style="background:{alert.bg_color};color:{alert.text_color};">'
        f'⚠️ {alert.title}</div>',
        unsafe_allow_html=True,
    )

    # Data source + last updated
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    badge = data_badge(weather)
    st.markdown(
        f"🕐 **{t.get('last_updated', 'Last Updated')}**: {now_str} &nbsp;&nbsp; "
        f"📊 **{t.get('data_source', 'Data Source')}**: {badge}",
        unsafe_allow_html=True,
    )

    # Weather metric cards
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric(t.get("live_temp", "Temp"), fmt(weather.temperature if weather else None, "°C"))
    with col2:
        st.metric(t.get("live_rain", "Rain"), fmt(weather.rain if weather else None, " mm/hr"))
    with col3:
        st.metric(t.get("water_elev", "Water Elev"), fmt(river_level, " m", 2))
    with col4:
        st.metric(t.get("risk_index", "Risk Index"), f"{risk_score:.0f}/100" if risk_score is not None else "—")

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric(t.get("weather_condition", "Weather"), weather.weather_desc if weather else "—")
    with col2:
        st.metric(t.get("soil_humidity", "Humidity"), fmt(weather.humidity if weather else None, "%", 0))
    with col3:
        st.metric(t.get("wind_speed", "Wind"), fmt(weather.wind_speed if weather else None, " km/h"))
    with col4:
        st.metric(t.get("helpline", "Helpline"), "1077")

    # Risk explanation
    st.markdown(f"### ℹ️ {t.get('risk_why', 'Why this risk level?')}")
    if risk_score is None:
        st.warning("Live weather data is currently unavailable. Risk score cannot be calculated.")
    else:
        factors = []
        if weather and weather.rain is not None:
            if weather.rain == 0:
                factors.append("No live rainfall detected (0 mm/hr)")
            elif weather.rain <= 5:
                factors.append(f"Light rainfall ({weather.rain:.1f} mm/hr) — low contribution")
            elif weather.rain <= 15:
                factors.append(f"Moderate rainfall ({weather.rain:.1f} mm/hr) — significant contribution")
            else:
                factors.append(f"Heavy rainfall ({weather.rain:.1f} mm/hr) — major contribution")
        if river_level is not None and st.session_state.danger_mark > 0:
            ratio = river_level / st.session_state.danger_mark
            if ratio < 0.7:
                factors.append(f"River at {ratio*100:.0f}% of danger mark — within safe range")
            elif ratio < 0.95:
                factors.append(f"River at {ratio*100:.0f}% of danger mark — approaching danger")
            else:
                factors.append(f"River at {ratio*100:.0f}% of danger mark — at or above danger")
        if weather and weather.humidity is not None:
            if weather.humidity > 85:
                factors.append(f"Soil humidity very high ({weather.humidity:.0f}%) — ground saturated")
            elif weather.humidity > 70:
                factors.append(f"Soil humidity elevated ({weather.humidity:.0f}%)")
            else:
                factors.append(f"Soil humidity normal ({weather.humidity:.0f}%)")
        for f in factors:
            st.markdown(f"- {f}")

    # What should I do now
    st.markdown(f"### 🎯 {t.get('what_to_do', 'What should I do now?')}")
    st.info(alert.action_msg)
    if risk_score is not None:
        st.progress(min(risk_score / 100, 1.0))

    # Emergency siren
    if risk_score is not None and risk_score >= 50:
        st.error(f"🚨 {t.get('emergency_siren', 'Emergency siren active')}")
        st.warning('Automated Audio Warning: "Attention villagers, water level is rising rapidly. Evacuate immediately."')

    # Broadcast logs
    if broadcast_log:
        with st.expander(f"📢 {t.get('broadcast_logs', 'Broadcast Logs')} ({len(broadcast_log)} entries)"):
            for log in reversed(broadcast_log[-5:]):
                st.code(log, language="text")

    # SitRep download
    st.markdown(f"### 📋 {t.get('sitrep', 'SitRep')}")
    sitrep_text = generate_sitrep(
        st.session_state.selected_name, risk_score, alert.title,
        weather.rain if weather and weather.rain else 0,
        river_level or 0, st.session_state.danger_mark,
        weather.humidity if weather and weather.humidity else 0,
        alert.action_msg,
    )
    st.download_button(
        t.get("download_sitrep", "Download SitRep"),
        data=sitrep_text,
        file_name=f"NDMA_SitRep_{st.session_state.selected_name.split(' ')[0]}.txt",
        mime="text/plain",
    )

    # Relief camps
    st.markdown(f"### 🏠 {t.get('relief_camps', 'Relief Camps')}")
    camps = [
        {"name": "Govt Primary School", "distance": "1.2 km (Safe Route)", "status": "OPEN"},
        {"name": "Panchayat Bhawan", "distance": "2.5 km (High Ground)", "status": "OPEN"},
        {"name": "Community Centre", "distance": "3.8 km (Main Highway)", "status": "STANDBY"},
    ]
    for camp in camps:
        color = "🟢" if camp["status"] == "OPEN" else "🟡"
        st.markdown(f"{color} **{camp['name']}** — {camp['distance']} [{camp['status']}]")

    # Map
    st.markdown(f"### 🗺️ {t.get('map_view', 'Map View')} — {st.session_state.selected_name}")
    render_map(t, alert)


def render_map(t, alert: AlertInfo, show_route=False):
    if not HAS_FOLIUM:
        st.info("Install `folium` and `streamlit-folium` to see the interactive map. "
                "Run: pip install folium streamlit-folium")
        return

    lat, lon = st.session_state.lat, st.session_state.lon
    m = folium.Map(location=[lat, lon], zoom_start=13)

    color_map = {
        "red": "red", "orange": "orange", "yellow": "beige",
        "green": "green", "gray": "gray",
    }
    marker_color = color_map.get(alert.marker_color, "gray")

    # Risk zones
    for _ in range(12):
        zlat = lat + (random.random() - 0.5) * 0.03
        zlon = lon + (random.random() - 0.5) * 0.03
        folium.CircleMarker(
            [zlat, zlon], radius=7, color=marker_color,
            fill=True, fill_color=marker_color, fill_opacity=0.7,
            popup="Active Flood Risk Zone",
        ).add_to(m)

    # Relief camps
    camp_locs = [
        ("Govt Primary School", lat + 0.005, lon + 0.005),
        ("Panchayat Bhawan", lat - 0.005, lon - 0.005),
        ("Community Centre", lat + 0.008, lon - 0.008),
    ]
    for name, clat, clon in camp_locs:
        folium.Marker(
            [clat, clon], popup=name,
            icon=folium.Icon(color="green", icon="home", prefix="fa"),
        ).add_to(m)

    if show_route:
        route = [
            [lat, lon],
            [lat + 0.002, lon + 0.001],
            [lat + 0.0035, lon + 0.003],
            [lat + 0.005, lon + 0.005],
        ]
        folium.PolyLine(route, color="green", weight=4, opacity=0.8, dash_array="10, 5").add_to(m)
        folium.Marker([lat, lon], popup="Current Location",
                      icon=folium.Icon(color="blue", icon="user", prefix="fa")).add_to(m)
        danger_zones = [
            (lat + 0.001, lon - 0.002, "Waterlogged area"),
            (lat - 0.003, lon + 0.004, "Blocked road"),
        ]
        for dlat, dlon, label in danger_zones:
            folium.CircleMarker(
                [dlat, dlon], radius=10, color="red", fill=True,
                fill_color="red", fill_opacity=0.4, popup=label,
            ).add_to(m)
            folium.Marker(
                [dlat, dlon], popup=label,
                icon=folium.Icon(color="red", icon="exclamation-triangle", prefix="fa"),
            ).add_to(m)

    st_folium(m, width=700, height=500)


def tab_smart_alerts(t, risk_score, alert, weather, river_level):
    """Tab 1: Smart Alerts"""
    st.markdown(f"### 🔔 {t.get('alerts_title', 'Smart Alert Center')}")
    st.markdown(f"_{t.get('alerts_desc', 'Active flood warnings')} — {st.session_state.selected_name}_")

    if risk_score is None:
        st.info("Risk data unavailable. No alerts can be generated.")
        return

    if risk_score < 31:
        st.success(t.get("no_active_alerts", "No active alerts. Conditions are normal."))
        st.metric(t.get("risk_index", "Risk Index"), f"{risk_score:.0f}/100")
        return

    level_map = {
        "red": ("CRITICAL", "🔴"),
        "orange": ("WARNING", "🟠"),
        "yellow": ("WATCH", "🟡"),
    }
    label, icon = level_map.get(alert.level, ("WATCH", "🟡"))

    reasons = []
    if weather and weather.rain is not None and weather.rain > 0:
        reasons.append(f"Live rainfall: {weather.rain:.1f} mm/hr")
    if river_level is not None and st.session_state.danger_mark > 0:
        ratio = river_level / st.session_state.danger_mark
        if ratio > 0.7:
            reasons.append(f"River at {ratio*100:.0f}% of danger mark")
    if weather and weather.humidity is not None and weather.humidity > 85:
        reasons.append(f"Soil saturated ({weather.humidity:.0f}% humidity)")

    urgency = {
        "red": "IMMEDIATE — Evacuate now",
        "orange": "HIGH — Prepare to evacuate",
        "yellow": "MODERATE — Stay alert",
    }.get(alert.level, "MODERATE — Stay alert")

    if alert.level == "red":
        st.error(f"{icon} **{label} FLOOD WARNING**")
    elif alert.level == "orange":
        st.warning(f"{icon} **{label} FLOOD WARNING**")
    else:
        st.info(f"{icon} **{label} FLOOD ADVISORY**")

    st.markdown(f"**Evacuation Urgency**: {urgency}")
    st.markdown(f"**Affected Area**: {st.session_state.selected_name}")
    st.markdown(f"**Time**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    st.markdown(f"**Reason**: {'; '.join(reasons) if reasons else 'Elevated risk conditions detected'}")
    st.markdown(f"**Recommended Action**: {alert.action_msg}")

    col1, col2, col3 = st.columns(3)
    with col1:
        st.button(f"🛣️ {t.get('find_safe_route', 'Find Safe Route')}", use_container_width=True)
    with col2:
        st.button(f"🏠 {t.get('find_shelter', 'Find Shelter')}", use_container_width=True)
    with col3:
        st.button(f"🆘 {t.get('sos_btn', 'SOS')}", use_container_width=True)


def tab_safe_routing(t, risk_score, alert):
    """Tab 2: Safe Routing"""
    st.markdown(f"### 🛣️ {t.get('routing_title', 'Safe Evacuation Routing')}")
    st.markdown(f"_{t.get('routing_desc', 'Emergency route guidance')} — {st.session_state.selected_name}_")

    st.warning(
        f"⚠️ Route guidance is based on **{t.get('simulated_data', 'SIMULATED')}** shelter locations. "
        "Real-time road conditions and live hazard data are not yet integrated."
    )

    shelters = [
        {"name": "Govt Primary School", "distance": "1.2 km", "time": "~15 min walk"},
        {"name": "Panchayat Bhawan", "distance": "2.5 km", "time": "~30 min walk"},
        {"name": "Community Centre", "distance": "3.8 km", "time": "~45 min walk"},
    ]

    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric(t.get("current_location", "Current"), st.session_state.selected_name)
    with col2:
        st.metric(t.get("destination", "Destination"), shelters[0]["name"])
    with col3:
        st.metric(f"{t.get('estimated_distance', 'Distance')} / {t.get('estimated_time', 'Time')}",
                  f"{shelters[0]['distance']} · {shelters[0]['time']}")

    if risk_score is not None and risk_score >= 50:
        st.error(f"⚠️ {t.get('route_warning', 'Route passes through a risk zone')}")

    render_map(t, alert, show_route=True)

    st.markdown(f"#### ⚠️ {t.get('danger_zones', 'Danger Zones')}")
    st.markdown("- 📍 Waterlogged area [SIMULATED]")
    st.markdown("- 📍 Blocked road [SIMULATED]")

    st.markdown(f"#### 🏠 {t.get('destination', 'Destination Shelters')}")
    for i, s in enumerate(shelters):
        tag = "🟢 Nearest" if i == 0 else ""
        st.markdown(f"**{s['name']}** — {s['distance']} · {s['time']} {tag}")


def tab_shelters(t):
    """Tab 3: Shelters"""
    st.markdown(f"### 🏠 {t.get('shelters_title', 'Relief & Shelter Directory')}")
    st.markdown(f"_{t.get('shelters_desc', 'Available shelters')} — {st.session_state.selected_name}_")

    shelters = [
        {"name": "Govt Primary School", "distance": "1.2 km", "capacity": "200 persons",
         "status": "open", "accessibility": "Wheelchair accessible",
         "facilities": ["Drinking water", "First aid", "Sanitation", "Power backup"]},
        {"name": "Panchayat Bhawan", "distance": "2.5 km", "capacity": "150 persons",
         "status": "open", "accessibility": "Ground floor only",
         "facilities": ["Drinking water", "Sanitation", "Food supply"]},
        {"name": "Community Centre", "distance": "3.8 km", "capacity": "300 persons",
         "status": "standby", "accessibility": "Wheelchair accessible",
         "facilities": ["Drinking water", "First aid", "Sanitation", "Power backup", "Medical room"]},
        {"name": "District Sports Complex", "distance": "5.5 km", "capacity": "500 persons",
         "status": "full", "accessibility": "Full accessibility",
         "facilities": ["Drinking water", "First aid", "Sanitation", "Power backup", "Medical room", "Helipad"]},
    ]

    status_map = {
        "open": ("🟢 OPEN", "success"),
        "full": ("🔴 FULL", "error"),
        "standby": ("🟡 STANDBY", "warning"),
    }

    for s in shelters:
        label, _ = status_map.get(s["status"], ("—", "info"))
        with st.expander(f"{label} — {s['name']} ({s['distance']})", expanded=True):
            col1, col2 = st.columns(2)
            with col1:
                st.markdown(f"**Capacity**: {s['capacity']}")
            with col2:
                st.markdown(f"**Accessibility**: {s['accessibility']}")
            st.markdown(f"**Facilities**: {', '.join(s['facilities'])}")
            col1, col2 = st.columns(2)
            with col1:
                st.button(f"🛣️ {t.get('safe_route_btn', 'Safe Route')}", key=f"route_{s['name']}", use_container_width=True)
            with col2:
                st.button(f"📞 {t.get('call_btn', 'Call')}", key=f"call_{s['name']}", use_container_width=True)

    st.warning(f"Shelter data is **{t.get('simulated_data', 'SIMULATED')}**. Verify with district authorities during an actual emergency.")


def tab_community_reports(t):
    """Tab 4: Community Reports"""
    st.markdown(f"### 📸 {t.get('reports_title', 'Community Flood Reports')}")
    st.markdown(f"_{t.get('reports_desc', 'Crowdsourced flood reporting')}_")

    categories = ["Waterlogging", "Rising Water Level", "Blocked Road",
                  "Damaged Bridge", "Rescue Required", "Other Emergency"]
    severities = ["Low", "Moderate", "High", "Critical"]

    with st.form("report_form"):
        col1, col2 = st.columns(2)
        with col1:
            name = st.text_input(t.get("reporter_name", "Reporter Name"))
        with col2:
            location = st.text_input(t.get("reporter_loc", "Location"), value=st.session_state.selected_name)

        col1, col2 = st.columns(2)
        with col1:
            category = st.selectbox("Category", categories)
        with col2:
            severity = st.selectbox("Severity", severities)

        details = st.text_area(t.get("additional_details", "Details"))
        submitted = st.form_submit_button(t.get("submit_btn", "Submit Report"))

    if submitted:
        if not name.strip() or not location.strip():
            st.error(t.get("submit_warn", "Please fill name and location."))
        else:
            issue = f"{category} [{severity}]"
            ok = insert_report(name.strip(), location.strip(), issue, details.strip())
            if ok:
                st.success(t.get("submit_success", "Report saved!"))
            else:
                st.warning("Report could not be saved to database (Supabase not configured). "
                           "In demo mode, your report is not persisted.")

    st.markdown(f"### 📋 {t.get('live_incidents', 'Community Report Feed')}")

    reports = fetch_reports()
    if not reports:
        if HAS_SUPABASE:
            st.info(t.get("no_reports", "No reports submitted yet."))
        else:
            st.info("Supabase not configured. Reports cannot be fetched. "
                    "Demo reports shown below.")
            demo_reports = [
                {"name": "Ramesh K", "location": "Chitrakoot", "issue": "Waterlogging [High]", "details": "Main road under 2ft water", "created_at": "2026-09-12 10:30"},
                {"name": "Sita Devi", "location": "Shimla", "issue": "Blocked Road [Moderate]", "details": "Landslide debris on highway", "created_at": "2026-09-12 09:15"},
            ]
            for r in demo_reports:
                sev_color = "🔴" if "Critical" in r["issue"] else "🟠" if "High" in r["issue"] else "🟡" if "Moderate" in r["issue"] else "🟢"
                st.markdown(f"{sev_color} **{r['name']}** — {r['location']}")
                st.markdown(f"&nbsp;&nbsp;{r['issue']} | {r['details']} | {r['created_at']}")
    else:
        for r in reports:
            sev_color = "🔴" if "Critical" in r.issue else "🟠" if "High" in r.issue else "🟡" if "Moderate" in r.issue else "🟢"
            st.markdown(f"{sev_color} **{r.name}** — {r.location}")
            st.markdown(f"&nbsp;&nbsp;{r.issue} | {r.details or '—'} | {r.created_at}")


def tab_emergency_center(t, risk_score, alert):
    """Tab 5: Emergency Center"""
    st.markdown(f"### 🆘 {t.get('emergency_title', 'Emergency Center')}")
    st.markdown(f"_{t.get('emergency_desc', 'One-tap emergency actions')}_")

    # SOS button
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        if st.button("🆘\nSOS", use_container_width=True, type="primary"):
            st.error("🚨 SOS ACTIVATED — Call 112 immediately!")

    if risk_score is not None and risk_score >= 50:
        st.error(f"⚠️ High risk detected: {alert.action_msg}")

    col1, col2, col3 = st.columns(3)
    with col1:
        if st.button("📤 Share My Location", use_container_width=True):
            loc_text = (f"EMERGENCY: I need help. Location: {st.session_state.selected_name} "
                        f"({st.session_state.lat:.4f}, {st.session_state.lon:.4f}). "
                        f"Risk: {risk_score:.0f}/100" if risk_score else "Risk: unknown")
            st.code(loc_text)
            st.info("Copy the text above to share via SMS/WhatsApp.")
    with col2:
        st.button(f"🏠 {t.get('nearest_shelter', 'Nearest Shelter')}", use_container_width=True)
    with col3:
        st.button(f"🏥 {t.get('nearest_hospital', 'Nearest Hospital')}", use_container_width=True)

    if st.button(f"🚨 {t.get('rescue_request', 'Request Rescue')}", use_container_width=True, type="primary"):
        st.error("Rescue request initiated. Call 112 for immediate assistance.")

    st.markdown(f"### 📞 {t.get('emergency_contacts', 'Emergency Contacts')}")
    contacts = [
        ("112", "Emergency", "danger"),
        ("1077", "District Control Room", "primary"),
        ("108", "Ambulance", "success"),
    ]
    for num, desc, _ in contacts:
        st.markdown(f"**[{num}](tel:{num})** — {desc}")

    st.markdown(f"### ℹ️ {t.get('emergency_instructions', 'Emergency Instructions')}")
    instructions = [
        "Call 112 immediately if you are in immediate danger",
        "Move to higher ground if water is rising around you",
        "Do not walk or drive through flooded areas",
        "Keep your phone charged and stay connected",
        "Follow official evacuation orders without delay",
        "Help elderly, children, and disabled persons first",
    ]
    for i, inst in enumerate(instructions, 1):
        st.markdown(f"{i}. {inst}")

    st.markdown(f"### 📍 {t.get('current_location', 'Current Location')}")
    st.markdown(f"**{st.session_state.selected_name}**")
    st.markdown(f"_{st.session_state.lat:.4f}, {st.session_state.lon:.4f}_")
    if risk_score is not None:
        st.markdown(f"**{t.get('risk_index', 'Risk Index')}**: {risk_score:.0f}/100")


def tab_family_safety(t):
    """Tab 6: Family Safety"""
    st.markdown(f"### ❤️ {t.get('family_title', 'Family Safety')}")
    st.markdown(f"_{t.get('family_desc', 'Track family and send check-ins')}_")

    st.warning("Family Safety runs on local session data. Check-ins are stored locally and "
               "do not send real SMS or track live locations.")

    with st.expander(t.get("add_family_member", "Add Family Member"), expanded=False):
        col1, col2 = st.columns(2)
        with col1:
            new_name = st.text_input("Name", key="fam_name")
        with col2:
            new_phone = st.text_input("Phone", key="fam_phone")
        if st.button("Add Member"):
            if new_name.strip():
                st.session_state.family_members.append({
                    "name": new_name.strip(),
                    "phone": new_phone.strip() or "—",
                    "status": "unknown",
                    "last_checkin": None,
                })
                st.success(f"Added {new_name}")
                st.rerun()

    members = st.session_state.family_members
    for i, m in enumerate(members):
        status_icon = {"safe": "🟢", "unknown": "⚪", "need_help": "🔴"}.get(m["status"], "⚪")
        status_label = {"safe": t.get("status_safe", "Safe"),
                        "unknown": t.get("status_unknown", "Unknown"),
                        "need_help": t.get("status_need_help", "Needs Help")}.get(m["status"], "Unknown")

        with st.expander(f"{status_icon} {m['name']} — {status_label}", expanded=True):
            st.markdown(f"**Phone**: {m['phone']}")
            if m["last_checkin"]:
                st.markdown(f"**Last check-in**: {m['last_checkin']}")
            col1, col2, col3 = st.columns(3)
            with col1:
                safe_label = t.get('im_safe', "I'm Safe")
                if st.button(f"✅ {safe_label}", key=f"safe_{i}"):
                    members[i]["status"] = "safe"
                    members[i]["last_checkin"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    st.rerun()
            with col2:
                if st.button(f"🆘 {t.get('emergency_checkin', 'Emergency Check-in')}", key=f"help_{i}"):
                    members[i]["status"] = "need_help"
                    members[i]["last_checkin"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    st.rerun()
            with col3:
                if st.button("❌ Remove", key=f"rm_{i}"):
                    st.session_state.family_members.pop(i)
                    st.rerun()


def tab_preparedness(t):
    """Tab 7: Flood Preparedness"""
    st.markdown(f"### 📋 {t.get('preparedness_title', 'Flood Preparedness Guide')}")
    st.markdown(f"_{t.get('preparedness_desc', 'Checklists for before, during, after flood')}_")

    phase = st.radio(
        "Phase",
        [t.get("before_flood", "Before Flood"), t.get("during_flood", "During Flood"), t.get("after_flood", "After Flood")],
        horizontal=True,
        key="prep_phase",
    )

    if t.get("before_flood", "Before Flood") in phase:
        st.markdown("#### ✅ Preparedness Checklist")
        items = [
            t.get("checklist_documents", "Important documents in waterproof bag"),
            t.get("checklist_medicines", "Essential medicines (7-day supply)"),
            t.get("checklist_water", "Drinking water (3 liters per person)"),
            t.get("checklist_emergency_kit", "Emergency kit (first aid, torch, whistle)"),
            t.get("checklist_power_bank", "Phone & power bank charged"),
            t.get("checklist_evacuation", "Evacuation plan and route known"),
        ]
        checked_count = 0
        for item in items:
            key = f"chk_{item[:20]}"
            if st.checkbox(item, key=key):
                checked_count += 1
        st.info(f"{checked_count} / {len(items)} items checked")

    elif t.get("during_flood", "During Flood") in phase:
        tips = [
            "Move to higher ground immediately when warned",
            "Do not walk or drive through flood waters",
            "Keep your phone charged and stay tuned to alerts",
            "Help elderly, children, and disabled persons",
            "Disconnect electrical appliances before water enters",
            "Keep emergency contacts and documents with you",
        ]
        for i, tip in enumerate(tips, 1):
            st.markdown(f"{i}. {tip}")

    else:
        tips = [
            "Wait for official all-clear before returning home",
            "Avoid flood water — it may be contaminated or electrically charged",
            "Check for structural damage before entering buildings",
            "Boil drinking water until supply is confirmed safe",
            "Document damage with photos for insurance claims",
            "Report hazards (broken power lines, gas leaks) to authorities",
        ]
        for i, tip in enumerate(tips, 1):
            st.markdown(f"{i}. {tip}")


def tab_chatbot(t, risk_score, alert, weather, river_level):
    """Tab 8: AI Assistant"""
    st.markdown(f"### 🤖 {t.get('chatbot_title', 'AI Flood Safety Assistant')}")
    st.markdown(f"_{t.get('chatbot_desc', 'Ask about flood safety')}_")

    st.info("Responses tagged: **[LIVE DATA]** from weather API, **[SIMULATED DATA]** for demo info, "
            "**[GENERAL GUIDANCE]** for safety tips, **[EMERGENCY]** for urgent actions.")

    quick_questions = [
        "Is my area at risk?",
        "What should I do now?",
        "Find a shelter",
        "How do I evacuate?",
        "I need rescue",
        "Flood safety checklist",
    ]
    cols = st.columns(3)
    for i, q in enumerate(quick_questions):
        with cols[i % 3]:
            if st.button(q, key=f"q_{i}", use_container_width=True):
                response = get_chatbot_response(
                    q, st.session_state.selected_name, risk_score, alert.action_msg,
                    weather.rain if weather else None, river_level,
                )
                st.session_state.chat_messages.append({"role": "user", "text": q})
                st.session_state.chat_messages.append({"role": "bot", "text": response})
                st.rerun()

    for msg in st.session_state.chat_messages:
        if msg["role"] == "user":
            st.markdown(f"**You**: {msg['text']}")
        else:
            st.markdown(f"**Assistant**: {msg['text']}")

    user_input = st.text_input(
        t.get("chatbot_placeholder", "Type your query..."),
        key="chat_input",
    )
    if st.button("Send") and user_input.strip():
        response = get_chatbot_response(
            user_input, st.session_state.selected_name, risk_score, alert.action_msg,
            weather.rain if weather else None, river_level,
        )
        st.session_state.chat_messages.append({"role": "user", "text": user_input.strip()})
        st.session_state.chat_messages.append({"role": "bot", "text": response})
        st.rerun()


def get_chatbot_response(query, location, risk_score, action_msg, rain, river_level):
    q = query.lower()
    if any(w in q for w in ["is my area", "area at risk", "current risk", "risk level", "what.*risk"]):
        if risk_score is None:
            return f"[UNAVAILABLE] Live weather data for {location} is unavailable. Risk cannot be determined."
        level = "CRITICAL" if risk_score >= 81 else "WARNING" if risk_score >= 61 else "WATCH" if risk_score >= 31 else "SAFE"
        return f"[LIVE DATA] Risk score for {location}: {risk_score:.0f}/100 — Level: {level}. {action_msg}"
    if any(w in q for w in ["what should i do", "what.*do now", "action", "advisory"]):
        if risk_score is None:
            return f"Weather data unavailable for {location}. Cannot recommend specific actions without live data."
        return f"[LIVE DATA] Based on current risk ({risk_score:.0f}/100) for {location}: {action_msg}"
    if any(w in q for w in ["shelter", "camp", "where.*safe", "relief"]):
        return ("[SIMULATED DATA] Nearest relief shelters: Govt Primary School (1.2 km, OPEN), "
                "Panchayat Bhawan (2.5 km, OPEN), Community Centre (3.8 km, STANDBY). "
                "Use the Shelters tab for full details.")
    if any(w in q for w in ["evacuat", "how.*evacuate", "route", "escape"]):
        return ("[GENERAL GUIDANCE] Evacuation steps: 1) Move to higher ground immediately. "
                "2) Avoid walking or driving through flood water. 3) Follow the green safe route on the Safe Routing tab. "
                "4) Help elderly and children first. 5) Carry your emergency kit and documents.")
    if any(w in q for w in ["rescue", "help me", "emergency", "sos", "save"]):
        return ("[EMERGENCY] Call 112 immediately for rescue. Share your location with rescuers. "
                "If possible, move to higher ground and wait. Use the Emergency Center tab for one-tap SOS.")
    if any(w in q for w in ["checklist", "prepare", "prepared", "kit", "before flood", "safety checklist"]):
        return ("[GENERAL GUIDANCE] Flood preparedness checklist: 1) Waterproof documents bag. "
                "2) 7-day medicine supply. 3) 3L drinking water per person. 4) Emergency kit (first aid, torch, whistle). "
                "5) Phone & power bank charged. 6) Know your evacuation route.")
    if any(w in q for w in ["helpline", "number", "call", "contact", "ndrf", "police", "ambulance"]):
        return ("[GENERAL GUIDANCE] Emergency contacts: 112 (Emergency), 1077 (District Control Room), "
                "108 (Ambulance), NDRF Command: 011-24363260.")
    if any(w in q for w in ["rain", "rainfall", "weather", "temperature", "humidity"]):
        rain_text = f"{rain:.1f} mm/hr" if rain is not None else "unavailable"
        river_text = f"{river_level}m" if river_level is not None else "unavailable"
        if rain is None:
            return f"[UNAVAILABLE] Live weather data for {location} is currently unavailable."
        return f"[LIVE DATA] For {location} — Rainfall: {rain_text}, Est. water elevation: {river_text}. Source: Open-Meteo API."
    if any(w in q for w in ["bridge", "cross", "safe.*cross"]):
        return "[GENERAL GUIDANCE] Do not cross bridges or roads submerged in flood water. Wait for official clearance."
    return ("[GENERAL GUIDANCE] I can help with: risk assessment, evacuation guidance, shelter locations, "
            "emergency contacts, rescue instructions, and flood preparedness. Ask me or use the quick action buttons.")


def tab_forecast(t, risk_score, rain):
    """Tab 9: Forecast"""
    st.markdown(f"### 📈 {t.get('forecast_title', 'AI-Driven Early Warning Engine')}")

    if risk_score is None or rain is None:
        st.warning(f"Live weather data for {st.session_state.selected_name} is currently unavailable. "
                   "Forecast cannot be generated without actual rainfall and risk data.")
        return

    forecast_type = st.radio(
        "Prediction Horizon",
        [t.get("forecast_24", "24-Hour"), t.get("forecast_6", "6-Hour")],
        horizontal=True,
        key="forecast_radio",
    )

    if t.get("forecast_24", "24-Hour") in forecast_type:
        st.info(t.get("forecast_24_info", "24-hour lead time for NDRF staging."))
        hours = [f"+{i*2+2}h" for i in range(12)]
        curve = [risk_score * m for m in [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4]]
        curve = [max(10, min(100, v)) for v in curve]
    else:
        st.warning(t.get("forecast_6_alert", "Catchment saturation trend active."))
        hours = [f"+{i+1} Hr" for i in range(6)]
        trend = 1 if rain > 20 else -1
        curve = [max(10, min(100, risk_score + i * 3 * trend)) for i in range(6)]

    if HAS_PLOTLY:
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=hours, y=curve, mode="lines+markers",
            line=dict(color="#42a5f5", width=3),
            marker=dict(size=8, color="#42a5f5"),
            fill="tozeroy", fillcolor="rgba(33,150,243,0.1)",
        ))
        fig.update_layout(
            yaxis=dict(range=[0, 100], title="Flood Risk Index (%)"),
            xaxis_title="Time Horizon",
            height=350, paper_bgcolor="#1e293b", plot_bgcolor="#1e293b",
            font=dict(color="#e2e8f0"),
        )
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.bar_chart(dict(zip(hours, curve)))

    peak = max(curve)
    st.metric("Peak Risk", f"{peak:.0f}%")


def tab_offline(t):
    """Tab 10: Offline Mode"""
    st.markdown(f"### 📡 {t.get('offline_title', 'Offline Safety Mode & IoT Node Health')}")
    st.markdown(f"_{t.get('offline_title', 'Offline mode')}_")

    st.warning(f"**OFFLINE** — Last Synced: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    st.info("Information below was last synced when internet was available. "
            "Real-time updates require an active connection.")

    col1, col2 = st.columns(2)
    with col1:
        st.markdown(f"#### 📞 Saved Emergency Contacts")
        contacts = [("112", "Emergency"), ("1077", "Control Room"), ("108", "Ambulance")]
        for num, desc in contacts:
            st.markdown(f"**[{num}](tel:{num})** — {desc}")
    with col2:
        st.markdown(f"#### 🏠 Saved Shelters")
        shelters = [("Govt Primary School", "1.2 km", "OPEN"), ("Panchayat Bhawan", "2.5 km", "OPEN"),
                    ("Community Centre", "3.8 km", "STANDBY")]
        for name, dist, status in shelters:
            icon = "🟢" if status == "OPEN" else "🟡"
            st.markdown(f"{icon} **{name}** — {dist} [{status}]")

    st.markdown(f"#### 🆘 SOS Instructions")
    sos_steps = [
        "Call 112 or 1077 even without internet",
        "Send SMS to 1077 with your location if call fails",
        "Move to highest ground available",
        "Signal rescuers with a whistle or torch",
        "Stay visible — wear bright clothing",
        "Keep phone charged with power bank",
    ]
    for i, step in enumerate(sos_steps, 1):
        st.markdown(f"{i}. {step}")

    st.markdown("---")
    st.markdown(f"#### 📡 {t.get('lora_title', 'LoRaWAN Mesh')}")
    st.code("""[Water Level & Rain Sensors (ESP32)]
         │ (LoRaWAN 868MHz - 15km Range)
         ▼
[Local Village Gateway / Panchayat Siren Unit]
         │ (Automated Audio Broadcast / Horn)
         ▼
[Battery Backed RF Public Announcement Speakers]""", language="text")
    st.success(t.get("lora_desc", "Operates with 0% internet connectivity."))

    st.markdown(f"#### 🔋 {t.get('sensor_health', 'IoT Sensor Health')}")
    sensors = [
        ("NODE-CHIT-01", "92%", "Strong", "Just now", "ok"),
        ("NODE-CHIT-02", "89%", "Strong", "3 secs ago", "ok"),
        ("NODE-CHIT-03", "47%", "Moderate", "12 secs ago", "warn"),
    ]
    for sid, batt, sig, ping, status in sensors:
        icon = "✅" if status == "ok" else "⚠️"
        st.markdown(f"{icon} **{sid}** — Battery: {batt} | Signal: {sig} | Last Ping: {ping}")
    st.caption(f"Sensor data is {t.get('simulated_data', 'SIMULATED')} for demonstration.")


def tab_satellite_view(t):
    """Tab 11: Satellite View"""
    st.markdown(f"### 🛰️ {t.get('sat_title', 'Real-Time Satellite Imagery')}")
    st.markdown(f"_{t.get('sat_desc', 'Latest satellite telemetry')} — {st.session_state.selected_name}_")

    if HAS_FOLIUM:
        lat, lon = st.session_state.lat, st.session_state.lon
        m = folium.Map(location=[lat, lon], zoom_start=14)
        folium.TileLayer(
            tiles="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attr="Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP",
            name="Esri Satellite",
        ).add_to(m)
        folium.Marker([lat, lon], popup=f"Satellite Center: {st.session_state.selected_name}").add_to(m)
        st_folium(m, width=700, height=450)
    else:
        st.info("Install `folium` and `streamlit-folium` to see satellite imagery. "
                "Run: pip install folium streamlit-folium")
        st.markdown(f"**Coordinates**: {st.session_state.lat:.4f}, {st.session_state.lon:.4f}")

    st.success(t.get("sat_synced", "Satellite telemetry synchronized."))


# ── Main app ───────────────────────────────────────────────────────────
def main():
    t = render_sidebar()

    # Header
    st.markdown(f"## 🛡️ {t['title']}")
    st.markdown(f"_{t['caption']}_")

    # Compute derived values
    weather = st.session_state.weather
    if weather is None:
        fetch_and_store_weather()
        weather = st.session_state.weather

    river_level = get_river_level(weather, st.session_state.danger_mark)
    risk_score = get_risk_score(weather, river_level, st.session_state.danger_mark)
    alert = get_alert_info(risk_score, st.session_state.selected_name)

    # Broadcast log
    if risk_score is not None and risk_score >= 50:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        localized = translate_alert(st.session_state.selected_name, st.session_state.lang_key)
        entry = f"[{timestamp}] SMS/WhatsApp | Lang: {st.session_state.lang_key} | Location: {st.session_state.selected_name} | Risk: {risk_score:.0f}/100 | Text: {localized}"
        if not st.session_state.broadcast_log or st.session_state.broadcast_log[-1] != entry:
            st.session_state.broadcast_log.append(entry)

    # Tabs
    tab_labels = t["tabs"]
    tabs = st.tabs(tab_labels)

    with tabs[0]:
        tab_live_risk(t, weather, river_level, risk_score, alert, st.session_state.broadcast_log)
    with tabs[1]:
        tab_smart_alerts(t, risk_score, alert, weather, river_level)
    with tabs[2]:
        tab_safe_routing(t, risk_score, alert)
    with tabs[3]:
        tab_shelters(t)
    with tabs[4]:
        tab_community_reports(t)
    with tabs[5]:
        tab_emergency_center(t, risk_score, alert)
    with tabs[6]:
        tab_family_safety(t)
    with tabs[7]:
        tab_preparedness(t)
    with tabs[8]:
        tab_chatbot(t, risk_score, alert, weather, river_level)
    with tabs[9]:
        tab_forecast(t, risk_score, weather.rain if weather else None)
    with tabs[10]:
        tab_offline(t)
    with tabs[11]:
        tab_satellite_view(t)

    st.markdown("---")
    st.caption("NDMA Flash Flood Portal — SIH 2026 (SIH26192) | Aapda Seva")


if __name__ == "__main__":
    main()

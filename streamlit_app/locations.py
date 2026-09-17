"""Regional location database, live weather fetch, and location search."""
import urllib.request
import urllib.parse
import json
from dataclasses import dataclass

REGIONAL_DATABASE: dict[str, dict] = {
    "Chitrakoot (Mandakini Basin, UP)": {"lat": 25.1748, "lon": 80.8606, "danger": 4.5},
    "Shimla (Hilly Slope, HP)": {"lat": 31.1048, "lon": 77.1734, "danger": 6.0},
    "Nepal-Tibet Border Pass (Himalayas)": {"lat": 28.15, "lon": 85.8, "danger": 7.5},
    "Kathmandu Valley (Nepal)": {"lat": 27.172, "lon": 85.324, "danger": 5.5},
    "Uttarkashi Catchment (UK)": {"lat": 30.7268, "lon": 78.4413, "danger": 8.0},
    "Agra (Yamuna Basin, UP)": {"lat": 27.1767, "lon": 78.0081, "danger": 4.0},
    "Patna (Ganga Basin, Bihar)": {"lat": 25.5941, "lon": 85.1376, "danger": 7.0},
    "Guwahati (Brahmaputra Basin, Assam)": {"lat": 26.1445, "lon": 91.7362, "danger": 6.5},
    "Wayanad (Landslide Prone Zone, Kerala)": {"lat": 11.6854, "lon": 76.132, "danger": 7.2},
    "Chamoli (Glacial Zone, UK)": {"lat": 30.4048, "lon": 79.3242, "danger": 8.5},
}

DEFAULT_LOCATION = {
    "name": "Chitrakoot (Mandakini Basin, UP)",
    "lat": 25.1748,
    "lon": 80.8606,
    "danger": 4.5,
}

WEATHER_CODES: dict[int, str] = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    56: "Light freezing drizzle", 57: "Dense freezing drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    66: "Light freezing rain", 67: "Heavy freezing rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow", 77: "Snow grains",
    80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    85: "Slight snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail",
}


def get_weather_desc(code: int) -> str:
    return WEATHER_CODES.get(code, "Unknown")


@dataclass
class WeatherData:
    rain: float | None
    humidity: float | None
    temperature: float | None
    wind_speed: float | None
    weather_code: int | None
    weather_desc: str
    feels_like: float | None
    cloud_cover: float | None
    success: bool


def _safe_float(val) -> float | None:
    if val is None:
        return None
    try:
        f = float(val)
        return f if f == f else None  # NaN check
    except (TypeError, ValueError):
        return None


def _safe_int(val) -> int | None:
    if val is None:
        return None
    try:
        i = int(val)
        return i if i == i else None
    except (TypeError, ValueError):
        return None


def fetch_weather(lat: float, lon: float) -> WeatherData:
    try:
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}"
            f"&current=temperature_2m,relative_humidity_2m,precipitation,rain,"
            f"weather_code,wind_speed_10m,cloud_cover,apparent_temperature"
        )
        req = urllib.request.Request(url, headers={"User-Agent": "AapdaSevaFloodApp/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
        cur = data.get("current", {})

        rain = _safe_float(cur.get("rain", cur.get("precipitation")))
        humidity = _safe_float(cur.get("relative_humidity_2m"))
        temperature = _safe_float(cur.get("temperature_2m"))
        wind_speed = _safe_float(cur.get("wind_speed_10m"))
        weather_code = _safe_int(cur.get("weather_code"))
        feels_like = _safe_float(cur.get("apparent_temperature")) or temperature
        cloud_cover = _safe_float(cur.get("cloud_cover"))

        return WeatherData(
            rain=rain,
            humidity=humidity,
            temperature=temperature,
            wind_speed=wind_speed,
            weather_code=weather_code,
            weather_desc=get_weather_desc(weather_code) if weather_code is not None else "Unknown",
            feels_like=feels_like,
            cloud_cover=cloud_cover,
            success=True,
        )
    except Exception:
        return WeatherData(
            rain=None, humidity=None, temperature=None, wind_speed=None,
            weather_code=None, weather_desc="Unknown", feels_like=None,
            cloud_cover=None, success=False,
        )


@dataclass
class SearchResult:
    name: str
    lat: float
    lon: float
    display_name: str
    type: str


def search_locations(query: str) -> list[SearchResult]:
    if not query.strip():
        return []
    try:
        encoded = urllib.parse.quote(query)
        url = f"https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=15&q={encoded}"
        req = urllib.request.Request(url, headers={"User-Agent": "AapdaSevaFloodApp/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
        if not isinstance(data, list):
            return []
        results = []
        for item in data:
            results.append(SearchResult(
                name=item.get("display_name", "").split(",")[0],
                lat=float(item.get("lat", 0)),
                lon=float(item.get("lon", 0)),
                display_name=item.get("display_name", ""),
                type=item.get("type", ""),
            ))
        return results
    except Exception:
        return []


def estimate_danger(lat: float, lon: float) -> float:
    if lat > 28:
        return 7.5
    if lon > 88 and lat > 24:
        return 7.0
    if 24 < lat < 28 and 80 < lon < 88:
        return 6.0
    if lat < 21:
        return 5.5
    return 4.5

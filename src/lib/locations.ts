export interface RegionLocation {
  lat: number
  lon: number
  danger: number
}

export const regionalDatabase: Record<string, RegionLocation> = {
  'Chitrakoot (Mandakini Basin, UP)': { lat: 25.1748, lon: 80.8606, danger: 4.5 },
  'Shimla (Hilly Slope, HP)': { lat: 31.1048, lon: 77.1734, danger: 6.0 },
  'Nepal-Tibet Border Pass (Himalayas)': { lat: 28.15, lon: 85.8, danger: 7.5 },
  'Kathmandu Valley (Nepal)': { lat: 27.172, lon: 85.324, danger: 5.5 },
  'Uttarkashi Catchment (UK)': { lat: 30.7268, lon: 78.4413, danger: 8.0 },
  'Agra (Yamuna Basin, UP)': { lat: 27.1767, lon: 78.0081, danger: 4.0 },
  'Patna (Ganga Basin, Bihar)': { lat: 25.5941, lon: 85.1376, danger: 7.0 },
  'Guwahati (Brahmaputra Basin, Assam)': { lat: 26.1445, lon: 91.7362, danger: 6.5 },
  'Wayanad (Landslide Prone Zone, Kerala)': { lat: 11.6854, lon: 76.132, danger: 7.2 },
  'Chamoli (Glacial Zone, UK)': { lat: 30.4048, lon: 79.3242, danger: 8.5 },
}

export const defaultLocation = {
  name: 'Chitrakoot (Mandakini Basin, UP)',
  lat: 25.1748,
  lon: 80.8606,
  danger: 4.5,
}

export interface WeatherData {
  rain: number | null
  humidity: number | null
  temperature: number | null
  windSpeed: number | null
  weatherCode: number | null
  weatherDesc: string
  feelsLike: number | null
  cloudCover: number | null
  success: boolean
}

const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}

export function getWeatherDesc(code: number): string {
  return WEATHER_CODES[code] ?? 'Unknown'
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,cloud_cover,apparent_temperature`
    const res = await fetch(url)
    const data = await res.json()
    const cur = data.current ?? {}
    const rain = cur.rain !== undefined ? parseFloat(cur.rain) : (cur.precipitation !== undefined ? parseFloat(cur.precipitation) : null)
    const humidity = cur.relative_humidity_2m !== undefined ? parseFloat(cur.relative_humidity_2m) : null
    const temperature = cur.temperature_2m !== undefined ? parseFloat(cur.temperature_2m) : null
    const windSpeed = cur.wind_speed_10m !== undefined ? parseFloat(cur.wind_speed_10m) : null
    const weatherCode = cur.weather_code !== undefined ? parseInt(cur.weather_code) : null
    const feelsLike = cur.apparent_temperature !== undefined ? parseFloat(cur.apparent_temperature) : (temperature ?? null)
    const cloudCover = cur.cloud_cover !== undefined ? parseFloat(cur.cloud_cover) : null
    return {
      rain: rain !== null && !isNaN(rain) ? rain : null,
      humidity: humidity !== null && !isNaN(humidity) ? humidity : null,
      temperature: temperature !== null && !isNaN(temperature) ? temperature : null,
      windSpeed: windSpeed !== null && !isNaN(windSpeed) ? windSpeed : null,
      weatherCode: weatherCode !== null && !isNaN(weatherCode) ? weatherCode : null,
      weatherDesc: weatherCode !== null ? getWeatherDesc(weatherCode) : 'Unknown',
      feelsLike: feelsLike !== null && !isNaN(feelsLike) ? feelsLike : null,
      cloudCover: cloudCover !== null && !isNaN(cloudCover) ? cloudCover : null,
      success: true,
    }
  } catch {
    return {
      rain: null, humidity: null, temperature: null, windSpeed: null,
      weatherCode: null, weatherDesc: 'Unknown', feelsLike: null,
      cloudCover: null, success: false,
    }
  }
}

export interface SearchResult {
  name: string
  lat: number
  lon: number
  displayName: string
  type: string
}

export async function searchLocations(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=15&q=${encodeURIComponent(query)}`
    const res = await fetch(url, { headers: { 'User-Agent': 'AapdaSevaFloodApp/1.0' } })
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data.map((item: { lat: string; lon: string; display_name: string; type: string }) => ({
      name: item.display_name.split(',')[0],
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      displayName: item.display_name,
      type: item.type,
    }))
  } catch {
    return []
  }
}

export function estimateDanger(lat: number, lon: number): number {
  const himalayanLat = lat > 28
  const northEast = lon > 88 && lat > 24
  const coastal = lat < 21
  const gangaBasin = lat > 24 && lat < 28 && lon > 80 && lon < 88

  if (himalayanLat) return 7.5
  if (northEast) return 7.0
  if (gangaBasin) return 6.0
  if (coastal) return 5.5
  return 4.5
}

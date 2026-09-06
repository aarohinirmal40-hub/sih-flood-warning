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
  rain: number
  humidity: number
  success: boolean
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=precipitation,rain,relative_humidity_2m`
    const res = await fetch(url)
    const data = await res.json()
    const rain = parseFloat(data.current?.rain ?? '0') || 0
    const humidity = parseFloat(data.current?.relative_humidity_2m ?? '50') || 50
    return { rain, humidity, success: true }
  } catch {
    return { rain: 10.0, humidity: 60.0, success: false }
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

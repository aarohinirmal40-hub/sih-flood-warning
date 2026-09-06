import { Globe, MapPin, Search, Radio, CloudRain, Droplets, Navigation } from 'lucide-react'
import { useState, useEffect } from 'react'
import { languages, type LanguageKey, type UIText } from '../lib/translations'
import { regionalDatabase, defaultLocation, fetchWeather, type WeatherData } from '../lib/locations'

interface SidebarProps {
  langKey: LanguageKey
  setLangKey: (k: LanguageKey) => void
  t: UIText
  selectedName: string
  setSelectedName: (n: string) => void
  lat: number
  setLat: (n: number) => void
  lon: number
  setLon: (n: number) => void
  dangerMark: number
  setDangerMark: (n: number) => void
  weather: WeatherData
  setWeather: (w: WeatherData) => void
}

export default function Sidebar({
  langKey, setLangKey, t, selectedName, setSelectedName,
  lat, setLat, lon, setLon, dangerMark, setDangerMark,
  weather, setWeather,
}: SidebarProps) {
  const [locationMode, setLocationMode] = useState<'gps' | 'search'>('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [matchedLocations, setMatchedLocations] = useState<string[]>(Object.keys(regionalDatabase))
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (searchQuery.trim()) {
      const queryWords = searchQuery.toLowerCase().replace('-', ' ').split(' ').filter(Boolean)
      const matched = Object.keys(regionalDatabase).filter((loc) => {
        const locLower = loc.toLowerCase().replace('-', ' ')
        return queryWords.every((word) => locLower.includes(word))
      })
      setMatchedLocations(matched.length > 0 ? matched : Object.keys(regionalDatabase))
    } else {
      setMatchedLocations(Object.keys(regionalDatabase))
    }
  }, [searchQuery])

  useEffect(() => {
    if (locationMode === 'search' && matchedLocations.length > 0) {
      const loc = matchedLocations[0]
      setSelectedName(loc)
      setLat(regionalDatabase[loc].lat)
      setLon(regionalDatabase[loc].lon)
      setDangerMark(regionalDatabase[loc].danger)
    }
  }, [matchedLocations, locationMode, setSelectedName, setLat, setLon, setDangerMark])

  useEffect(() => {
    fetchWeather(lat, lon).then((w) => setWeather(w))
  }, [lat, lon, setWeather])

  const handleGPS = () => {
    setGpsStatus('loading')
    if (!navigator.geolocation) {
      setGpsStatus('error')
      return
    }
    navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude: glat, longitude: glon } = pos.coords
      setGpsCoords({ lat: glat, lon: glon })
      setLat(glat)
      setLon(glon)
      setDangerMark(5.0)
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${glat}&lon=${glon}`
        const res = await fetch(url, { headers: { 'User-Agent': 'FloodWarningApp/1.0' } })
        const data = await res.json()
        const addr = data.address || {}
        const place = addr.city || addr.town || addr.village || addr.county || 'Live GPS Area'
        const state = addr.state || ''
        setSelectedName(state ? `${place}, ${state}` : place)
      } catch {
        setSelectedName(`Live GPS (${glat.toFixed(2)}, ${glon.toFixed(2)})`)
      }
      setGpsStatus('success')
    },
    () => setGpsStatus('error'),
    )
  }

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 h-full overflow-y-auto p-5 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-primary-400" />
          <h2 className="text-sm font-semibold text-slate-200">{t.sidebarLang}</h2>
        </div>
        <select
          value={langKey}
          onChange={(e) => setLangKey(e.target.value as LanguageKey)}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        >
          {languages.map((l) => (
            <option key={l.key} value={l.key}>{l.label}</option>
          ))}
        </select>
      </div>

      <div className="border-t border-slate-700/50 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-primary-400" />
          <h2 className="text-sm font-semibold text-slate-200">{t.sidebarLocation}</h2>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setLocationMode('gps')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${locationMode === 'gps' ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Navigation className="w-3.5 h-3.5 inline mr-1" />
            {t.autoGPS}
          </button>
          <button
            onClick={() => setLocationMode('search')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${locationMode === 'search' ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Search className="w-3.5 h-3.5 inline mr-1" />
            {t.smartSearch}
          </button>
        </div>

        {locationMode === 'gps' ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">{t.clickGPS}</p>
            <button
              onClick={handleGPS}
              disabled={gpsStatus === 'loading'}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg px-3 py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Navigation className={`w-4 h-4 ${gpsStatus === 'loading' ? 'animate-spin' : ''}`} />
              {gpsStatus === 'loading' ? 'Locating...' : 'Get My Location'}
            </button>
            {gpsStatus === 'success' && gpsCoords && (
              <div className="bg-success-900/30 border border-success-700/50 rounded-lg p-3 text-xs text-success-300 animate-fade-in">
                <p className="font-semibold">Location Locked</p>
                <p className="text-slate-400 mt-1">{selectedName}</p>
                <p className="text-slate-500 mt-0.5">{gpsCoords.lat.toFixed(4)}, {gpsCoords.lon.toFixed(4)}</p>
              </div>
            )}
            {gpsStatus === 'error' && (
              <p className="text-xs text-danger-400">{t.orSwitch}</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
            <select
              value={selectedName}
              onChange={(e) => {
                const loc = e.target.value
                setSelectedName(loc)
                setLat(regionalDatabase[loc].lat)
                setLon(regionalDatabase[loc].lon)
                setDangerMark(regionalDatabase[loc].danger)
              }}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {matchedLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            {searchQuery.trim() && matchedLocations.length === 0 && (
              <p className="text-xs text-warning-400">{t.noMatch}</p>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-slate-700/50 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Radio className={`w-5 h-5 ${weather.success ? 'text-success-400' : 'text-warning-400'}`} />
          <h2 className="text-sm font-semibold text-slate-200">{t.liveClimate}</h2>
        </div>
        <div className={`flex items-center gap-1.5 text-xs mb-3 ${weather.success ? 'text-success-400' : 'text-warning-400'}`}>
          {weather.success ? (
            <><span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" /> {t.apiSynced}</>
          ) : (
            <><span className="w-2 h-2 rounded-full bg-warning-400" /> {t.apiOffline}</>
          )}
        </div>
        <div className="space-y-2">
          <div className="bg-slate-800/60 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-0.5">{t.targetLocation}</p>
            <p className="text-sm font-medium text-slate-200 truncate">{selectedName}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-800/60 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <CloudRain className="w-3.5 h-3.5 text-primary-400" />
                <span className="text-xs text-slate-500">{t.liveRainfall}</span>
              </div>
              <p className="text-lg font-bold text-slate-100">{weather.rain.toFixed(1)} <span className="text-xs font-normal text-slate-500">mm/hr</span></p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Droplets className="w-3.5 h-3.5 text-primary-400" />
                <span className="text-xs text-slate-500">{t.soilHumidity}</span>
              </div>
              <p className="text-lg font-bold text-slate-100">{weather.humidity.toFixed(0)}<span className="text-xs font-normal text-slate-500">%</span></p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

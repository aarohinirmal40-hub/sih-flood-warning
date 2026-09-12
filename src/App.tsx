import { useState, useMemo, useEffect } from 'react'
import {
  AlertTriangle, Bell, Route, Home, Users, Siren, Heart, ClipboardCheck,
  Bot, TrendingUp, WifiOff, Satellite, ShieldCheck,
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import SmartAlerts from './components/SmartAlerts'
import SafeRouting from './components/SafeRouting'
import Shelters from './components/Shelters'
import CommunityReports from './components/CommunityReports'
import EmergencyCenter from './components/EmergencyCenter'
import FamilySafety from './components/FamilySafety'
import FloodPreparedness from './components/FloodPreparedness'
import Chatbot from './components/Chatbot'
import Forecast from './components/Forecast'
import Offline from './components/Offline'
import SatelliteView from './components/SatelliteView'
import { type LanguageKey, getUIText, translateAlert } from './lib/translations'
import { defaultLocation, type WeatherData } from './lib/locations'
import { calculateRisk, getAlertInfo, type AlertInfo } from './lib/risk'

const nullWeather: WeatherData = {
  rain: null, humidity: null, temperature: null, windSpeed: null,
  weatherCode: null, weatherDesc: 'Unknown', feelsLike: null, cloudCover: null, success: false,
}

const tabIcons = [
  AlertTriangle, Bell, Route, Home, Users, Siren, Heart, ClipboardCheck,
  Bot, TrendingUp, WifiOff, Satellite,
]

export interface AppContext {
  t: ReturnType<typeof getUIText>
  langKey: LanguageKey
  selectedName: string
  lat: number
  lon: number
  dangerMark: number
  weather: WeatherData
  riverLevel: number | null
  riskScore: number | null
  alert: AlertInfo
  broadcastLog: string[]
}

export default function App() {
  const [langKey, setLangKey] = useState<LanguageKey>('en')
  const [selectedName, setSelectedName] = useState(defaultLocation.name)
  const [lat, setLat] = useState(defaultLocation.lat)
  const [lon, setLon] = useState(defaultLocation.lon)
  const [dangerMark, setDangerMark] = useState(defaultLocation.danger)
  const [weather, setWeather] = useState<WeatherData>(nullWeather)
  const [activeTab, setActiveTab] = useState(0)
  const [broadcastLog, setBroadcastLog] = useState<string[]>([])

  const t = useMemo(() => getUIText(langKey), [langKey])

  const riverLevel = useMemo(
    () => weather.rain !== null ? Math.round((dangerMark + weather.rain * 0.05) * 100) / 100 : null,
    [dangerMark, weather.rain],
  )

  const riskScore = useMemo(
    () => {
      if (weather.rain === null || weather.humidity === null || riverLevel === null) return null
      return calculateRisk(weather.rain, riverLevel, weather.humidity, dangerMark)
    },
    [weather, riverLevel, dangerMark],
  )

  const alert = useMemo(
    () => getAlertInfo(riskScore, selectedName),
    [riskScore, selectedName],
  )

  useEffect(() => {
    if (riskScore !== null && riskScore >= 50) {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19)
      const localizedText = translateAlert(selectedName, langKey)
      const logEntry = `[${timestamp}] SMS/WhatsApp Broadcast | Lang: ${langKey} | Location: ${selectedName} | Risk: ${riskScore.toFixed(0)}/100 | Text: ${localizedText}`
      setBroadcastLog((prev) => {
        if (prev.length > 0 && prev[prev.length - 1] === logEntry) return prev
        return [...prev, logEntry]
      })
    }
  }, [riskScore, selectedName, langKey])

  const tabs = t.tabs

  const ctx: AppContext = {
    t, langKey, selectedName, lat, lon, dangerMark, weather, riverLevel, riskScore, alert, broadcastLog,
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950">
      <Sidebar
        langKey={langKey}
        setLangKey={setLangKey}
        t={t}
        selectedName={selectedName}
        setSelectedName={setSelectedName}
        lat={lat}
        setLat={setLat}
        lon={lon}
        setLon={setLon}
        dangerMark={dangerMark}
        setDangerMark={setDangerMark}
        weather={weather}
        setWeather={setWeather}
      />

      <main className="flex-1 overflow-y-auto p-5 lg:p-8 pb-20 lg:pb-8">
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="w-8 h-8 text-primary-400 flex-shrink-0" />
            <h1 className="text-xl lg:text-2xl font-bold text-slate-100 leading-tight">{t.title}</h1>
          </div>
          <p className="text-sm text-slate-400 ml-11">{t.caption}</p>
        </header>

        <nav className="flex flex-wrap gap-2 mb-6 border-b border-slate-700/50 pb-4">
          {tabs.map((tab, i) => {
            const Icon = tabIcons[i]
            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === i ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
              >
                <Icon className="w-4 h-4" />
                {tab}
              </button>
            )
          })}
        </nav>

        <div className="max-w-6xl mx-auto">
          {activeTab === 0 && (
            <Dashboard
              t={t}
              selectedName={selectedName}
              lat={lat}
              lon={lon}
              weather={weather}
              riverLevel={riverLevel}
              dangerMark={dangerMark}
              riskScore={riskScore}
              alert={alert}
              broadcastLog={broadcastLog}
            />
          )}
          {activeTab === 1 && <SmartAlerts ctx={ctx} />}
          {activeTab === 2 && <SafeRouting ctx={ctx} />}
          {activeTab === 3 && <Shelters ctx={ctx} />}
          {activeTab === 4 && <CommunityReports t={t} selectedName={selectedName} lat={lat} lon={lon} />}
          {activeTab === 5 && <EmergencyCenter ctx={ctx} />}
          {activeTab === 6 && <FamilySafety t={t} />}
          {activeTab === 7 && <FloodPreparedness t={t} />}
          {activeTab === 8 && (
            <Chatbot t={t} selectedName={selectedName} riskScore={riskScore} actionMsg={alert.actionMsg} rain={weather.rain} riverLevel={riverLevel} />
          )}
          {activeTab === 9 && (
            <Forecast t={t} riskScore={riskScore} rain={weather.rain} selectedName={selectedName} />
          )}
          {activeTab === 10 && <Offline t={t} />}
          {activeTab === 11 && <SatelliteView t={t} lat={lat} lon={lon} selectedName={selectedName} />}
        </div>

        <footer className="mt-8 pt-4 border-t border-slate-700/50 text-center text-xs text-slate-600">
          NDMA Flash Flood Portal — SIH 2026 (SIH26192) | Aapda Seva
        </footer>
      </main>

      {/* Mobile sticky SOS bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setActiveTab(5)}
          className="flex-1 flex items-center justify-center gap-2 bg-danger-600 hover:bg-danger-700 text-white rounded-lg px-4 py-2.5 text-sm font-bold transition-all animate-pulse-ring"
        >
          <Siren className="w-5 h-5" />
          {t.sosBtn}
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
        >
          <Route className="w-5 h-5" />
          {t.findSafeRoute}
        </button>
        <button
          onClick={() => setActiveTab(3)}
          className="flex items-center justify-center gap-2 bg-success-600 hover:bg-success-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
        >
          <Home className="w-5 h-5" />
          {t.findShelter}
        </button>
      </div>
    </div>
  )
}

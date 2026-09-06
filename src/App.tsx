import { useState, useMemo, useEffect } from 'react'
import { AlertTriangle, TrendingUp, Bot, Camera, Radio, Satellite, ShieldCheck } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Forecast from './components/Forecast'
import Chatbot from './components/Chatbot'
import SosReport from './components/SosReport'
import Offline from './components/Offline'
import SatelliteView from './components/SatelliteView'
import { type LanguageKey, getUIText, translateAlert } from './lib/translations'
import { defaultLocation, type WeatherData } from './lib/locations'
import { calculateRisk, getAlertInfo } from './lib/risk'

const tabIcons = [AlertTriangle, TrendingUp, Bot, Camera, Radio, Satellite]

export default function App() {
  const [langKey, setLangKey] = useState<LanguageKey>('en')
  const [selectedName, setSelectedName] = useState(defaultLocation.name)
  const [lat, setLat] = useState(defaultLocation.lat)
  const [lon, setLon] = useState(defaultLocation.lon)
  const [dangerMark, setDangerMark] = useState(defaultLocation.danger)
  const [weather, setWeather] = useState<WeatherData>({ rain: 10, humidity: 60, success: false })
  const [activeTab, setActiveTab] = useState(0)
  const [broadcastLog, setBroadcastLog] = useState<string[]>([])

  const t = useMemo(() => getUIText(langKey), [langKey])

  const riverLevel = useMemo(
    () => Math.round((dangerMark + weather.rain * 0.05) * 100) / 100,
    [dangerMark, weather.rain],
  )

  const riskScore = useMemo(
    () => calculateRisk(weather.rain, riverLevel, weather.humidity),
    [weather, riverLevel],
  )

  const alert = useMemo(
    () => getAlertInfo(riskScore, selectedName),
    [riskScore, selectedName],
  )

  useEffect(() => {
    if (riskScore >= 50) {
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

      <main className="flex-1 overflow-y-auto p-5 lg:p-8">
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
          {activeTab === 1 && (
            <Forecast t={t} riskScore={riskScore} rain={weather.rain} selectedName={selectedName} />
          )}
          {activeTab === 2 && (
            <Chatbot t={t} selectedName={selectedName} riskScore={riskScore} actionMsg={alert.actionMsg} rain={weather.rain} riverLevel={riverLevel} />
          )}
          {activeTab === 3 && (
            <SosReport t={t} selectedName={selectedName} />
          )}
          {activeTab === 4 && (
            <Offline t={t} />
          )}
          {activeTab === 5 && (
            <SatelliteView t={t} lat={lat} lon={lon} selectedName={selectedName} />
          )}
        </div>

        <footer className="mt-8 pt-4 border-t border-slate-700/50 text-center text-xs text-slate-600">
          NDMA Flash Flood Portal — SIH 2026 (SIH26192) | Aapda Seva
        </footer>
      </main>
    </div>
  )
}

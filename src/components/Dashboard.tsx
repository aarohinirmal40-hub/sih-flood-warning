import { MapContainer, TileLayer, CircleMarker, Marker, Polyline, Popup } from 'react-leaflet'
import L from 'leaflet'
import { AlertTriangle, Download, Home, Phone, CloudRain, Waves, ShieldAlert, Volume2, MessageSquare, Thermometer, Wind, Cloud, Eye, Droplets } from 'lucide-react'
import { useState } from 'react'
import { type UIText } from '../lib/translations'
import { type AlertInfo } from '../lib/risk'
import { generateSitRep } from '../lib/risk'

interface DashboardProps {
  t: UIText
  selectedName: string
  lat: number
  lon: number
  weather: { rain: number | null; humidity: number | null; temperature: number | null; windSpeed: number | null; weatherCode: number | null; weatherDesc: string; feelsLike: number | null; cloudCover: number | null; success: boolean }
  riverLevel: number | null
  dangerMark: number
  riskScore: number | null
  alert: AlertInfo
  broadcastLog: string[]
}

const reliefCamps = [
  { name: 'Govt Primary School', distance: '1.2 km (Safe Route)', status: 'OPEN' },
  { name: 'Panchayat Bhawan', distance: '2.5 km (High Ground)', status: 'OPEN' },
  { name: 'Community Centre', distance: '3.8 km (Main Highway)', status: 'STANDBY' },
]

export default function Dashboard({
  t, selectedName, lat, lon, weather, riverLevel, dangerMark, riskScore, alert, broadcastLog,
}: DashboardProps) {
  const [showLogs, setShowLogs] = useState(false)

  const riskZones = Array.from({ length: 12 }, () => ({
    lat: lat + (Math.random() - 0.5) * 0.03,
    lon: lon + (Math.random() - 0.5) * 0.03,
  }))

  const camps: [string, number, number][] = [
    ['Govt Primary School (Relief Camp 1)', lat + 0.005, lon + 0.005],
    ['Panchayat Bhawan (Relief Camp 2)', lat - 0.005, lon - 0.005],
    ['Community Centre (Shelter Hub)', lat + 0.008, lon - 0.008],
  ]

  const evacPath: [number, number][] = [
    [lat, lon],
    [lat + 0.002, lon + 0.001],
    [lat + 0.0035, lon + 0.003],
    [lat + 0.005, lon + 0.005],
  ]

  const sitRep = generateSitRep(selectedName, riskScore, alert.title, weather.rain ?? 0, riverLevel ?? 0, dangerMark, weather.humidity ?? 0, alert.actionMsg)

  const downloadSitRep = () => {
    const blob = new Blob([sitRep], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `NDMA_SitRep_${selectedName.split(' ')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const homeIcon = L.divIcon({ html: '<i class="fa fa-home" style="color:#388E3C;font-size:18px"></i>', className: '', iconSize: [24, 24] })

  return (
    <div className="space-y-5 animate-fade-in">
      <div
        className="rounded-xl px-5 py-4 text-center font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
        style={{ backgroundColor: alert.bgColor, color: alert.textColor }}
      >
        <AlertTriangle className="w-6 h-6 flex-shrink-0" />
        {alert.title}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-slate-400">{t.liveTemp}</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{weather.temperature !== null ? weather.temperature.toFixed(1) : '—'}<span className="text-sm font-normal text-slate-500">°C</span></p>
          <p className="text-xs text-slate-500 mt-0.5">{t.feelsLike}: {weather.feelsLike !== null ? `${weather.feelsLike.toFixed(1)}°C` : '—'}</p>
        </div>
        <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <CloudRain className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-slate-400">{t.liveRain}</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{weather.rain !== null ? weather.rain.toFixed(1) : '—'} <span className="text-sm font-normal text-slate-500">mm/hr</span></p>
        </div>
        <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Waves className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-slate-400">{t.waterElev}</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{riverLevel !== null ? riverLevel : '—'} <span className="text-sm font-normal text-slate-500">m</span></p>
          <p className={`text-xs mt-0.5 ${riverLevel !== null && riverLevel - dangerMark > 0 ? 'text-danger-400' : 'text-success-400'}`}>
            {riverLevel !== null ? `${(riverLevel - dangerMark).toFixed(1)}m vs Danger` : '—'}
          </p>
        </div>
        <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-4 h-4 text-danger-400" />
            <span className="text-xs text-slate-400">{t.riskIndex}</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{riskScore !== null ? riskScore.toFixed(0) : '—'} <span className="text-sm font-normal text-slate-500">/ 100</span></p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Cloud className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-slate-400">{t.weatherCondition}</span>
          </div>
          <p className="text-lg font-bold text-slate-100">{weather.weatherDesc}</p>
          {!weather.success && (
            <p className="text-[10px] text-warning-400 mt-0.5">Live API data unavailable</p>
          )}
        </div>
        <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-slate-400">{t.soilHumidity}</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{weather.humidity !== null ? weather.humidity.toFixed(0) : '—'}<span className="text-sm font-normal text-slate-500">%</span></p>
        </div>
        <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-slate-400">{t.windSpeed}</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{weather.windSpeed !== null ? weather.windSpeed.toFixed(1) : '—'} <span className="text-sm font-normal text-slate-500">km/h</span></p>
        </div>
        <div className="bg-slate-800/60 backdrop-blur rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Phone className="w-4 h-4 text-success-400" />
            <span className="text-xs text-slate-400">{t.helpline}</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">1077</p>
          <p className="text-xs text-slate-500">NDRF</p>
        </div>
      </div>

      {riskScore !== null && riskScore >= 50 && (
        <div className="space-y-3">
          <div className="bg-danger-900/20 border border-danger-700/40 rounded-xl p-4 flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <p className="text-sm text-danger-200">{t.emergencySiren}</p>
          </div>
          <div className="bg-slate-900/80 rounded-xl p-4 border-l-4 border-danger-500">
            <p className="text-sm text-slate-300">
              <span className="text-danger-400 font-semibold">Automated Audio Warning:</span> "Attention villagers, water level is rising rapidly. Evacuate immediately via designated high-ground routes."
            </p>
          </div>
        </div>
      )}

      {broadcastLog.length > 0 && (
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-slate-100 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-primary-400" />
            {t.broadcastLogs}
            <span className="ml-auto text-xs text-slate-500">{broadcastLog.length} entries</span>
          </button>
          {showLogs && (
            <div className="px-4 pb-3 space-y-1.5 max-h-48 overflow-y-auto">
              {broadcastLog.slice(-5).reverse().map((log, i) => (
                <div key={i} className="text-xs text-slate-400 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700/30">
                  <span className="text-success-400">✓</span> {log}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
            <h3 className="text-base font-semibold text-slate-200 mb-3">{t.advisory} — {selectedName}</h3>
            <div className="bg-primary-900/20 border border-primary-700/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-slate-300">{alert.actionMsg}</p>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-400">Risk Level</span>
              <span className="text-xs font-bold text-slate-200 ml-auto">{riskScore !== null ? `${Math.min(riskScore, 100).toFixed(0)}%` : 'N/A'}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${riskScore !== null ? Math.min(riskScore, 100) : 0}%`, backgroundColor: alert.bgColor }}
              />
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
            <h3 className="text-base font-semibold text-slate-200 mb-3">{t.sitrep}</h3>
            <button
              onClick={downloadSitRep}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {t.downloadSitRep}
            </button>
          </div>
        </div>

        <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
          <h3 className="text-base font-semibold text-slate-200 mb-3">{t.reliefCamps}</h3>
          <div className="space-y-2">
            {reliefCamps.map((camp) => (
              <div key={camp.name} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                <div className="flex items-start gap-2">
                  <Home className="w-4 h-4 text-success-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{camp.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{camp.distance}</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${camp.status === 'OPEN' ? 'bg-success-900/40 text-success-400' : 'bg-warning-900/40 text-warning-400'}`}>
                      {camp.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-200 mb-1">{t.mapView} — {selectedName}</h3>
        <p className="text-xs text-slate-500 mb-3">{t.mapCaption}</p>
        <div className="rounded-xl overflow-hidden border border-slate-700/50 shadow-xl">
          <MapContainer center={[lat, lon]} zoom={13} style={{ height: '500px', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {riskZones.map((z, i) => (
              <CircleMarker
                key={i}
                center={[z.lat, z.lon]}
                radius={7}
                pathOptions={{ color: alert.markerColor, fillColor: alert.markerColor, fillOpacity: 0.7 }}
              >
                <Popup>Active Flood Risk Zone</Popup>
              </CircleMarker>
            ))}
            {camps.map(([name, cLat, cLon]) => (
              <Marker key={name} position={[cLat, cLon]} icon={homeIcon}>
                <Popup>{name}</Popup>
              </Marker>
            ))}
            <Polyline
              positions={evacPath}
              pathOptions={{ color: 'green', weight: 4, opacity: 0.8 }}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Route, Navigation, AlertTriangle, Home, Clock, MapPin, Info } from 'lucide-react'
import { type AppContext } from '../App'

interface ShelterTarget {
  name: string
  lat: number
  lon: number
  distance: string
  time: string
}

export default function SafeRouting({ ctx }: { ctx: AppContext }) {
  const { t, lat, lon, selectedName, alert, riskScore } = ctx

  const shelters: ShelterTarget[] = [
    { name: 'Govt Primary School (Relief Camp 1)', lat: lat + 0.005, lon: lon + 0.005, distance: '1.2 km', time: '~15 min walk' },
    { name: 'Panchayat Bhawan (Relief Camp 2)', lat: lat - 0.005, lon: lon - 0.005, distance: '2.5 km', time: '~30 min walk' },
    { name: 'Community Centre (Shelter Hub)', lat: lat + 0.008, lon: lon - 0.008, distance: '3.8 km', time: '~45 min walk' },
  ]

  const selectedShelter = shelters[0]
  const routePath: [number, number][] = [
    [lat, lon],
    [lat + 0.002, lon + 0.001],
    [lat + 0.0035, lon + 0.003],
    [selectedShelter.lat, selectedShelter.lon],
  ]

  const dangerZones = [
    { lat: lat + 0.001, lon: lon - 0.002, label: 'Waterlogged area' },
    { lat: lat - 0.003, lon: lon + 0.004, label: 'Blocked road' },
  ]

  const routePassesRisk = riskScore !== null && riskScore >= 50

  const userIcon = L.divIcon({ html: '<i class="fa fa-user" style="color:#2196f3;font-size:18px"></i>', className: '', iconSize: [24, 24] })
  const shelterIcon = L.divIcon({ html: '<i class="fa fa-home" style="color:#4caf50;font-size:18px"></i>', className: '', iconSize: [24, 24] })
  const dangerIcon = L.divIcon({ html: '<i class="fa fa-exclamation-triangle" style="color:#f44336;font-size:16px"></i>', className: '', iconSize: [24, 24] })

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Route className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.routingTitle}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">{t.routingDesc} — <span className="text-primary-400">{selectedName}</span></p>

        {/* Simulated data disclaimer */}
        <div className="bg-warning-900/20 border border-warning-700/30 rounded-lg p-3 mb-4 flex items-start gap-2">
          <Info className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-warning-300">
            Route guidance is based on <span className="font-bold">{t.simulatedData}</span> shelter locations. Real-time road conditions and live hazard data are not yet integrated. Do not rely solely on this routing during an actual emergency.
          </p>
        </div>

        {/* Route summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Navigation className="w-3.5 h-3.5 text-primary-400" />
              <span className="text-xs text-slate-500">{t.currentLocation}</span>
            </div>
            <p className="text-sm font-medium text-slate-200 truncate">{selectedName}</p>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Home className="w-3.5 h-3.5 text-success-400" />
              <span className="text-xs text-slate-500">{t.destination}</span>
            </div>
            <p className="text-sm font-medium text-slate-200 truncate">{selectedShelter.name.split('(')[0]}</p>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-primary-400" />
              <span className="text-xs text-slate-500">{t.estimatedDistance} / {t.estimatedTime}</span>
            </div>
            <p className="text-sm font-medium text-slate-200">{selectedShelter.distance} · {selectedShelter.time}</p>
          </div>
        </div>

        {/* Route warning */}
        {routePassesRisk && (
          <div className="bg-danger-900/20 border border-danger-700/40 rounded-lg p-3 mb-4 flex items-start gap-2 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-danger-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-danger-300 font-medium">{t.routeWarning}</p>
          </div>
        )}

        {/* Map */}
        <div className="rounded-xl overflow-hidden border border-slate-700/50 shadow-xl mb-4">
          <MapContainer center={[lat, lon]} zoom={14} style={{ height: '450px', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[lat, lon]} icon={userIcon}>
              <Popup>{t.currentLocation}: {selectedName}</Popup>
            </Marker>
            <Marker position={[selectedShelter.lat, selectedShelter.lon]} icon={shelterIcon}>
              <Popup>{selectedShelter.name}</Popup>
            </Marker>
            {dangerZones.map((dz, i) => (
              <CircleMarker key={i} center={[dz.lat, dz.lon]} radius={10} pathOptions={{ color: '#f44336', fillColor: '#f44336', fillOpacity: 0.4 }}>
                <Popup>{dz.label}</Popup>
              </CircleMarker>
            ))}
            {dangerZones.map((dz, i) => (
              <Marker key={`dz-${i}`} position={[dz.lat, dz.lon]} icon={dangerIcon}>
                <Popup>{dz.label}</Popup>
              </Marker>
            ))}
            <Polyline positions={routePath} pathOptions={{ color: '#4caf50', weight: 4, opacity: 0.8, dashArray: '10, 5' }} />
          </MapContainer>
        </div>

        {/* Danger zones list */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-danger-400" />
            {t.dangerZones}
          </h4>
          <div className="space-y-2">
            {dangerZones.map((dz, i) => (
              <div key={i} className="bg-danger-900/20 border border-danger-700/30 rounded-lg p-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-danger-400 flex-shrink-0" />
                <span className="text-sm text-danger-300">{dz.label}</span>
                <span className="ml-auto text-xs text-slate-500">{t.simulatedData}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shelter options */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">{t.destination}</h4>
          <div className="space-y-2">
            {shelters.map((s, i) => (
              <div key={i} className={`bg-slate-900/60 rounded-lg p-3 border ${i === 0 ? 'border-success-700/50' : 'border-slate-700/30'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{s.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.distance} · {s.time}</p>
                  </div>
                  {i === 0 && (
                    <span className="text-xs bg-success-900/40 text-success-400 px-2 py-0.5 rounded-full font-medium">Nearest</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

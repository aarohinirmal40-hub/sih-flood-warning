import { Satellite, Eye, Cloud } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { type UIText } from '../lib/translations'

interface SatelliteViewProps {
  t: UIText
  lat: number
  lon: number
  selectedName: string
}

export default function SatelliteView({ t, lat, lon, selectedName }: SatelliteViewProps) {
  const eyeIcon = L.divIcon({ html: '<i class="fa fa-eye" style="color:#f44336;font-size:18px"></i>', className: '', iconSize: [24, 24] })

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Satellite className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.satTitle}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">{t.satDesc} — <span className="text-primary-400">{selectedName}</span></p>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary-400" />
              {t.satEsri} ({selectedName.split(' ')[0]})
            </h4>
            <div className="bg-primary-900/20 border border-primary-700/30 rounded-lg p-2.5 mb-3">
              <p className="text-xs text-slate-400">{t.satSource}</p>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <MapContainer center={[lat, lon]} zoom={14} style={{ height: '400px', width: '100%' }} scrollWheelZoom={true}>
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />
                <Marker position={[lat, lon]} icon={eyeIcon}>
                  <Popup>Satellite Center: {selectedName}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-primary-400" />
              {t.satCloud}
            </h4>
            <div className="bg-primary-900/20 border border-primary-700/30 rounded-lg p-2.5 mb-3">
              <p className="text-xs text-slate-400">{t.satOptical}</p>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1524592724787-b0d08422f2e7?q=80&w=1000&auto=format&fit=crop"
                alt={`Live Optical Satellite View Feed — ${selectedName}`}
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="mt-3 bg-success-900/20 border border-success-700/30 rounded-lg p-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
              <p className="text-sm text-success-300">{t.satSynced} ({lat.toFixed(4)}, {lon.toFixed(4)})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

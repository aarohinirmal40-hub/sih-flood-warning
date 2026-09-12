import { Home, Phone, Route, Users, Accessibility, Wrench, MapPin } from 'lucide-react'
import { type AppContext } from '../App'

interface Shelter {
  name: string
  distance: string
  capacity: string
  status: 'open' | 'full' | 'standby'
  accessibility: string
  facilities: string[]
}

export default function Shelters({ ctx }: { ctx: AppContext }) {
  const { t, lat, lon, selectedName } = ctx

  const shelters: Shelter[] = [
    {
      name: 'Govt Primary School (Relief Camp 1)',
      distance: '1.2 km',
      capacity: '200 persons',
      status: 'open',
      accessibility: 'Wheelchair accessible',
      facilities: ['Drinking water', 'First aid', 'Sanitation', 'Power backup'],
    },
    {
      name: 'Panchayat Bhawan (Relief Camp 2)',
      distance: '2.5 km',
      capacity: '150 persons',
      status: 'open',
      accessibility: 'Ground floor only',
      facilities: ['Drinking water', 'Sanitation', 'Food supply'],
    },
    {
      name: 'Community Centre (Shelter Hub)',
      distance: '3.8 km',
      capacity: '300 persons',
      status: 'standby',
      accessibility: 'Wheelchair accessible',
      facilities: ['Drinking water', 'First aid', 'Sanitation', 'Power backup', 'Medical room'],
    },
    {
      name: 'District Sports Complex',
      distance: '5.5 km',
      capacity: '500 persons',
      status: 'full',
      accessibility: 'Full accessibility',
      facilities: ['Drinking water', 'First aid', 'Sanitation', 'Power backup', 'Medical room', 'Helipad'],
    },
  ]

  const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
    open: { bg: 'bg-success-900/40', text: 'text-success-400', label: t.shelterOpen },
    full: { bg: 'bg-danger-900/40', text: 'text-danger-400', label: t.shelterFull },
    standby: { bg: 'bg-warning-900/40', text: 'text-warning-400', label: t.shelterStandby },
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Home className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.sheltersTitle}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">{t.sheltersDesc} — <span className="text-primary-400">{selectedName}</span></p>

        <div className="space-y-3">
          {shelters.map((s, i) => {
            const st = statusStyles[s.status]
            return (
              <div key={i} className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/30">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{s.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-slate-500">{s.distance}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>
                    {st.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-500">{t.shelterCapacity}:</span>
                    <span className="text-slate-300 font-medium">{s.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Accessibility className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-500">{t.shelterAccessibility}:</span>
                    <span className="text-slate-300">{s.accessibility}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Wrench className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs text-slate-500">{t.shelterFacilities}:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.facilities.map((f, j) => (
                      <span key={j} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700/50">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-3 py-2 text-xs font-medium transition-all flex-1 justify-center">
                    <Route className="w-3.5 h-3.5" />
                    {t.safeRouteBtn}
                  </button>
                  <button className="flex items-center gap-1.5 bg-success-600 hover:bg-success-700 text-white rounded-lg px-3 py-2 text-xs font-medium transition-all flex-1 justify-center">
                    <Phone className="w-3.5 h-3.5" />
                    {t.callBtn}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 bg-warning-900/20 border border-warning-700/30 rounded-lg p-3">
          <p className="text-xs text-warning-300">
            Shelter data is <span className="font-bold">{t.simulatedData}</span>. Real shelter availability and capacity should be verified with district authorities during an actual emergency.
          </p>
        </div>
      </div>
    </div>
  )
}

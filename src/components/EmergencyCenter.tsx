import { Siren, Phone, MapPin, Share2, Home, Hospital, AlertTriangle, Info, Navigation } from 'lucide-react'
import { type AppContext } from '../App'

export default function EmergencyCenter({ ctx }: { ctx: AppContext }) {
  const { t, selectedName, lat, lon, riskScore, alert } = ctx

  const contacts = [
    { label: t.call112, number: '112', desc: 'Emergency', color: 'bg-danger-600 hover:bg-danger-700' },
    { label: t.call1077, number: '1077', desc: 'District Control Room', color: 'bg-primary-600 hover:bg-primary-700' },
    { label: t.call108, number: '108', desc: 'Ambulance', color: 'bg-success-600 hover:bg-success-700' },
  ]

  const handleShareLocation = () => {
    const text = `EMERGENCY: I need help. My location: ${selectedName} (${lat.toFixed(4)}, ${lon.toFixed(4)}). Risk level: ${riskScore !== null ? riskScore.toFixed(0) + '/100' : 'unknown'}.`
    if (navigator.share) {
      navigator.share({ text })
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* SOS button */}
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Siren className="w-5 h-5 text-danger-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.emergencyTitle}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-6">{t.emergencyDesc}</p>

        <div className="flex flex-col items-center mb-6">
          <button className="relative w-32 h-32 rounded-full bg-danger-600 hover:bg-danger-700 text-white flex items-center justify-center text-2xl font-bold shadow-2xl transition-all animate-pulse-ring">
            <span className="flex flex-col items-center">
              <Siren className="w-10 h-10 mb-1" />
              {t.sosBtn}
            </span>
          </button>
          <p className="text-xs text-slate-500 mt-3">Tap to send emergency alert</p>
        </div>

        {/* Current risk context */}
        {riskScore !== null && riskScore >= 50 && (
          <div className="bg-danger-900/20 border border-danger-700/40 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-danger-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-danger-300 font-medium">High risk detected in your area</p>
              <p className="text-xs text-slate-400 mt-0.5">{alert.actionMsg}</p>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <button
            onClick={handleShareLocation}
            className="flex flex-col items-center gap-2 bg-slate-900/60 hover:bg-slate-800 rounded-lg p-4 border border-slate-700/30 transition-all"
          >
            <Share2 className="w-6 h-6 text-primary-400" />
            <span className="text-xs font-medium text-slate-200 text-center">{t.shareLocation}</span>
          </button>
          <button className="flex flex-col items-center gap-2 bg-slate-900/60 hover:bg-slate-800 rounded-lg p-4 border border-slate-700/30 transition-all">
            <Home className="w-6 h-6 text-success-400" />
            <span className="text-xs font-medium text-slate-200 text-center">{t.nearestShelter}</span>
          </button>
          <button className="flex flex-col items-center gap-2 bg-slate-900/60 hover:bg-slate-800 rounded-lg p-4 border border-slate-700/30 transition-all">
            <Hospital className="w-6 h-6 text-danger-400" />
            <span className="text-xs font-medium text-slate-200 text-center">{t.nearestHospital}</span>
          </button>
        </div>

        {/* Rescue request */}
        <button className="w-full bg-danger-600 hover:bg-danger-700 text-white rounded-lg px-4 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 mb-4">
          <Siren className="w-4 h-4" />
          {t.rescueRequest}
        </button>
      </div>

      {/* Emergency contacts */}
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <h3 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-primary-400" />
          {t.emergencyContacts}
        </h3>
        <div className="space-y-3">
          {contacts.map((c) => (
            <a
              key={c.number}
              href={`tel:${c.number}`}
              className={`flex items-center justify-between ${c.color} text-white rounded-lg px-4 py-3 transition-all`}
            >
              <div>
                <p className="text-sm font-bold">{c.label}</p>
                <p className="text-xs opacity-80">{c.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{c.number}</span>
                <Phone className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Emergency instructions */}
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <h3 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary-400" />
          {t.emergencyInstructions}
        </h3>
        <div className="space-y-2.5">
          {[
            'Call 112 immediately if you are in immediate danger',
            'Move to higher ground if water is rising around you',
            'Do not walk or drive through flooded areas',
            'Keep your phone charged and stay connected',
            'Follow official evacuation orders without delay',
            'Help elderly, children, and disabled persons first',
          ].map((instruction, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-600/20 text-primary-400 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              {instruction}
            </div>
          ))}
        </div>
      </div>

      {/* Location info */}
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <h3 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary-400" />
          {t.currentLocation}
        </h3>
        <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/30">
          <p className="text-sm text-slate-200 font-medium">{selectedName}</p>
          <p className="text-xs text-slate-500 mt-1">{lat.toFixed(4)}, {lon.toFixed(4)}</p>
          {riskScore !== null && (
            <p className="text-xs text-slate-400 mt-1">{t.riskIndex}: {riskScore.toFixed(0)}/100</p>
          )}
        </div>
      </div>
    </div>
  )
}

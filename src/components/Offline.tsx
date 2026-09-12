import { Radio, Wifi, Battery, Signal, CheckCircle2, AlertTriangle, Clock, Phone, Home, ClipboardCheck, Siren, Info, CloudOff } from 'lucide-react'
import { type UIText } from '../lib/translations'

interface OfflineProps {
  t: UIText
}

const sensorNodes = [
  { id: 'NODE-CHIT-01', battery: '92% (Solar)', signal: 'Strong (LoRa)', ping: 'Just now', status: 'ok' },
  { id: 'NODE-CHIT-02', battery: '89% (Solar)', signal: 'Strong (LoRa)', ping: '3 secs ago', status: 'ok' },
  { id: 'NODE-CHIT-03', battery: '47% (Warning)', signal: 'Moderate', ping: '12 secs ago', status: 'warn' },
]

const savedContacts = [
  { name: 'District Control Room', number: '1077' },
  { name: 'Emergency', number: '112' },
  { name: 'Ambulance', number: '108' },
  { name: 'NDRF Command', number: '011-24363260' },
]

const savedShelters = [
  { name: 'Govt Primary School', distance: '1.2 km', status: 'OPEN' },
  { name: 'Panchayat Bhawan', distance: '2.5 km', status: 'OPEN' },
  { name: 'Community Centre', distance: '3.8 km', status: 'STANDBY' },
]

const sosInstructions = [
  'Call 112 or 1077 even without internet',
  'Send SMS to 1077 with your location if call fails',
  'Move to highest ground available',
  'Signal rescuers with a whistle or torch',
  'Stay visible — wear bright clothing',
  'Keep phone charged with power bank',
]

export default function Offline({ t }: OfflineProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Offline status banner */}
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.offlineModeTitle}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">{t.offlineModeDesc}</p>

        {/* Sync status */}
        <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/30 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudOff className="w-4 h-4 text-warning-400" />
              <span className="text-sm font-medium text-slate-200">{t.dataStateOffline}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.lastSynced}: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Last known warning */}
        <div className="bg-warning-900/20 border border-warning-700/30 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-warning-300 font-medium">Last Known Warning</p>
              <p className="text-xs text-slate-400 mt-1">
                Information shown below was last synced when internet was available. Real-time updates require an active connection. Treat all data as potentially stale.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Saved emergency contacts */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-success-400" />
              {t.savedContacts}
            </h4>
            <div className="space-y-2">
              {savedContacts.map((c) => (
                <a
                  key={c.number}
                  href={`tel:${c.number}`}
                  className="flex items-center justify-between bg-slate-900/60 rounded-lg p-3 border border-slate-700/30 hover:border-slate-600 transition-all"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-200">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.number}</p>
                  </div>
                  <Phone className="w-4 h-4 text-success-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Saved shelters */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Home className="w-4 h-4 text-primary-400" />
              {t.savedShelters}
            </h4>
            <div className="space-y-2">
              {savedShelters.map((s) => (
                <div key={s.name} className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.distance}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === 'OPEN' ? 'bg-success-900/40 text-success-400' : 'bg-warning-900/40 text-warning-400'}`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SOS instructions */}
        <div className="mt-5">
          <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <Siren className="w-4 h-4 text-danger-400" />
            {t.sosInstructions}
          </h4>
          <div className="space-y-2">
            {sosInstructions.map((inst, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-900/60 rounded-lg p-3 border border-slate-700/30">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-danger-600/20 text-danger-400 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-300">{inst}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LoRaWAN & IoT sensor health */}
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Wifi className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.loraTitle}</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 text-success-400" />
              {t.loraTitle}
            </h4>
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/30 font-mono text-xs text-slate-400 leading-relaxed">
              <pre className="whitespace-pre">{`[Water Level & Rain Sensors (ESP32)]
         │ (LoRaWAN 868MHz - 15km Range)
         ▼
[Local Village Gateway / Panchayat Siren Unit]
         │ (Automated Audio Broadcast / Horn)
         ▼
[Battery Backed RF Public Announcement Speakers]`}</pre>
            </div>
            <div className="mt-3 bg-success-900/20 border border-success-700/30 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-success-300">{t.loraDesc}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Battery className="w-4 h-4 text-primary-400" />
              {t.sensorHealth}
            </h4>
            <div className="space-y-2">
              {sensorNodes.map((node) => (
                <div key={node.id} className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-200">{node.id}</span>
                    {node.status === 'warn' ? (
                      <span className="text-xs bg-warning-900/40 text-warning-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Warning
                      </span>
                    ) : (
                      <span className="text-xs bg-success-900/40 text-success-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> OK
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-slate-500">Battery</p>
                      <p className={`font-medium ${node.status === 'warn' ? 'text-warning-400' : 'text-slate-300'}`}>{node.battery}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Signal</p>
                      <p className="text-slate-300 flex items-center gap-1"><Signal className="w-3 h-3" /> {node.signal}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Last Ping</p>
                      <p className="text-slate-300">{node.ping}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-3.5 h-3.5" />
              <span>Sensor data is {t.simulatedData} for demonstration.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

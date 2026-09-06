import { Radio, Wifi, Battery, Signal, CheckCircle2, AlertTriangle } from 'lucide-react'
import { type UIText } from '../lib/translations'

interface OfflineProps {
  t: UIText
}

const sensorNodes = [
  { id: 'NODE-CHIT-01', battery: '92% (Solar)', signal: 'Strong (LoRa)', ping: 'Just now', status: 'ok' },
  { id: 'NODE-CHIT-02', battery: '89% (Solar)', signal: 'Strong (LoRa)', ping: '3 secs ago', status: 'ok' },
  { id: 'NODE-CHIT-03', battery: '47% (Warning)', signal: 'Moderate', ping: '12 secs ago', status: 'warn' },
]

export default function Offline({ t }: OfflineProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.offlineTitle}</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-success-400" />
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
          </div>
        </div>
      </div>
    </div>
  )
}

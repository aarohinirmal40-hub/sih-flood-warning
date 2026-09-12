import { Bell, AlertTriangle, MapPin, Clock, Info, Route, Home, Siren, ChevronRight } from 'lucide-react'
import { type AppContext } from '../App'
import { type AlertLevel } from '../lib/risk'

interface AlertItem {
  level: AlertLevel
  severityLabel: string
  severityColor: string
  bgColor: string
  area: string
  time: string
  reason: string
  action: string
  evacuationUrgency: string
}

export default function SmartAlerts({ ctx }: { ctx: AppContext }) {
  const { t, alert, selectedName, riskScore, weather, riverLevel, dangerMark } = ctx

  const alerts: AlertItem[] = []

  if (riskScore !== null && riskScore >= 31) {
    const levelMap: Record<string, { label: string; color: string; bg: string }> = {
      red: { label: 'CRITICAL', color: 'text-danger-400', bg: 'bg-danger-900/30' },
      orange: { label: 'WARNING', color: 'text-warning-400', bg: 'bg-warning-900/30' },
      yellow: { label: 'WATCH', color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
    }
    const info = levelMap[alert.level] ?? levelMap.yellow

    const reasons: string[] = []
    if (weather.rain !== null && weather.rain > 0) reasons.push(`Live rainfall: ${weather.rain.toFixed(1)} mm/hr`)
    if (riverLevel !== null && dangerMark > 0) {
      const ratio = riverLevel / dangerMark
      if (ratio > 0.7) reasons.push(`River at ${(ratio * 100).toFixed(0)}% of danger mark`)
    }
    if (weather.humidity !== null && weather.humidity > 85) reasons.push(`Soil saturated (${weather.humidity.toFixed(0)}% humidity)`)

    const urgency = alert.level === 'red' ? 'IMMEDIATE — Evacuate now' : alert.level === 'orange' ? 'HIGH — Prepare to evacuate' : 'MODERATE — Stay alert'

    alerts.push({
      level: alert.level,
      severityLabel: info.label,
      severityColor: info.color,
      bgColor: info.bg,
      area: selectedName,
      time: new Date().toLocaleString(),
      reason: reasons.length > 0 ? reasons.join('; ') : 'Elevated risk conditions detected',
      action: alert.actionMsg,
      evacuationUrgency: urgency,
    })
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.alertsTitle}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">{t.alertsDesc} — <span className="text-primary-400">{selectedName}</span></p>

        {alerts.length === 0 ? (
          <div className="bg-success-900/20 border border-success-700/30 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success-900/40 mb-3">
              <Info className="w-7 h-7 text-success-400" />
            </div>
            <p className="text-sm text-success-300 font-medium">{t.noActiveAlerts}</p>
            {riskScore !== null && (
              <p className="text-xs text-slate-500 mt-2">{t.riskIndex}: {riskScore.toFixed(0)}/100</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((a, i) => (
              <div key={i} className={`${a.bgColor} border border-slate-700/50 rounded-xl p-4 animate-slide-in`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 ${a.severityColor}`} />
                    <span className={`text-sm font-bold ${a.severityColor}`}>{a.severityLabel}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.severityColor} bg-slate-900/50`}>
                    {a.evacuationUrgency}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-slate-500">{t.alertArea}:</span>
                    <span className="text-slate-200 font-medium">{a.area}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-slate-500">{t.alertTime}:</span>
                    <span className="text-slate-200">{a.time}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-xs">
                    <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500">{t.alertReason}: </span>
                      <span className="text-slate-300">{a.reason}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500">{t.alertAction}: </span>
                      <span className="text-slate-200">{a.action}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-3 py-2 text-xs font-medium transition-all">
                    <Route className="w-3.5 h-3.5" />
                    {t.findSafeRoute}
                  </button>
                  <button className="flex items-center gap-1.5 bg-success-600 hover:bg-success-700 text-white rounded-lg px-3 py-2 text-xs font-medium transition-all">
                    <Home className="w-3.5 h-3.5" />
                    {t.findShelter}
                  </button>
                  <button className="flex items-center gap-1.5 bg-danger-600 hover:bg-danger-700 text-white rounded-lg px-3 py-2 text-xs font-bold transition-all">
                    <Siren className="w-3.5 h-3.5" />
                    {t.sosBtn}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

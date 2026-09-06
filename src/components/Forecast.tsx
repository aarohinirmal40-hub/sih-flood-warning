import { TrendingUp, Clock, Calendar } from 'lucide-react'
import { useState } from 'react'
import { type UIText } from '../lib/translations'

interface ForecastProps {
  t: UIText
  riskScore: number
  rain: number
  selectedName: string
}

export default function Forecast({ t, riskScore, rain, selectedName }: ForecastProps) {
  const [forecastType, setForecastType] = useState<'24h' | '6h'>('24h')

  const hours24 = Array.from({ length: 12 }, (_, i) => `+${i * 2 + 2}h`)
  const baseCurve = [
    riskScore * 0.6, riskScore * 0.7, riskScore * 0.8, riskScore * 0.9,
    riskScore, riskScore * 1.1, riskScore * 0.9, riskScore * 0.8,
    riskScore * 0.7, riskScore * 0.6, riskScore * 0.5, riskScore * 0.4,
  ].map((x) => Math.min(Math.max(x, 10), 100))

  const hours6 = Array.from({ length: 6 }, (_, i) => `+${i + 1} Hr`)
  const forecast6 = Array.from({ length: 6 }, (_, i) => {
    const val = riskScore + (i * 3 * (rain > 20 ? 1 : -1))
    return Math.min(Math.max(val, 10), 100)
  })

  const chartData = forecastType === '24h' ? baseCurve : forecast6
  const chartLabels = forecastType === '24h' ? hours24 : hours6
  const maxVal = 100
  const chartHeight = 200
  const chartWidth = 600

  const points = chartData.map((val, i) => {
    const x = (i / (chartData.length - 1)) * chartWidth
    const y = chartHeight - (val / maxVal) * chartHeight
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.forecastTitle}</h3>
        </div>

        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setForecastType('24h')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${forecastType === '24h' ? 'bg-primary-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
          >
            <Calendar className="w-4 h-4" />
            {t.forecast24}
          </button>
          <button
            onClick={() => setForecastType('6h')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${forecastType === '6h' ? 'bg-primary-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
          >
            <Clock className="w-4 h-4" />
            {t.forecast6}
          </button>
        </div>

        {forecastType === '24h' ? (
          <>
            <h4 className="text-sm font-medium text-slate-300 mb-2">24-Hour Regional Risk Projection for {selectedName}</h4>
            <div className="bg-primary-900/20 border border-primary-700/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-slate-300">{t.forecast24Info}</p>
            </div>
          </>
        ) : (
          <>
            <h4 className="text-sm font-medium text-slate-300 mb-2">6-Hour Precision Runoff Nowcast for {selectedName}</h4>
            <div className="bg-danger-900/20 border border-danger-700/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-danger-200">{t.forecast6Alert}</p>
            </div>
          </>
        )}

        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/30">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} className="w-full" preserveAspectRatio="none" style={{ height: '230px' }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(33,150,243,0.4)" />
                <stop offset="100%" stopColor="rgba(33,150,243,0.02)" />
              </linearGradient>
            </defs>
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line x1="0" y1={chartHeight - (v / 100) * chartHeight} x2={chartWidth} y2={chartHeight - (v / 100) * chartHeight} stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
                <text x="4" y={chartHeight - (v / 100) * chartHeight - 4} fill="rgba(148,163,184,0.6)" fontSize="10">{v}</text>
              </g>
            ))}
            <polygon points={areaPoints} fill="url(#chartGrad)" />
            <polyline points={points} fill="none" stroke="#42a5f5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {chartData.map((val, i) => {
              const x = (i / (chartData.length - 1)) * chartWidth
              const y = chartHeight - (val / maxVal) * chartHeight
              return <circle key={i} cx={x} cy={y} r="3.5" fill="#42a5f5" />
            })}
            {chartLabels.map((label, i) => {
              const x = (i / (chartLabels.length - 1)) * chartWidth
              return <text key={i} x={x} y={chartHeight + 18} fill="rgba(148,163,184,0.7)" fontSize="10" textAnchor="middle">{label}</text>
            })}
          </svg>
          <div className="flex items-center justify-between mt-2 px-2">
            <span className="text-xs text-slate-500">Flood Risk Index (%)</span>
            <span className="text-xs text-slate-400">Peak: <span className="font-bold text-primary-400">{Math.max(...chartData).toFixed(0)}%</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}

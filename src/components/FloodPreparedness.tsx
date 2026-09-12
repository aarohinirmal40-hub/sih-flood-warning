import { ClipboardCheck, CheckSquare, Square, Droplets, Pill, FileText, Battery, MapPin, Package } from 'lucide-react'
import { useState } from 'react'
import { type UIText } from '../lib/translations'

interface FloodPreparednessProps {
  t: UIText
}

interface ChecklistItem {
  key: string
  label: string
  icon: typeof Droplets
}

const beforeFloodItems: ChecklistItem[] = [
  { key: 'documents', label: '', icon: FileText },
  { key: 'medicines', label: '', icon: Pill },
  { key: 'water', label: '', icon: Droplets },
  { key: 'emergencyKit', label: '', icon: Package },
  { key: 'powerBank', label: '', icon: Battery },
  { key: 'evacuation', label: '', icon: MapPin },
]

export default function FloodPreparedness({ t }: FloodPreparednessProps) {
  const [activePhase, setActivePhase] = useState<'before' | 'during' | 'after'>('before')
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const labels: Record<string, string> = {
    documents: t.checklistDocuments,
    medicines: t.checklistMedicines,
    water: t.checklistWater,
    emergencyKit: t.checklistEmergencyKit,
    powerBank: t.checklistPowerBank,
    evacuation: t.checklistEvacuation,
  }

  const items = beforeFloodItems.map((item) => ({
    ...item,
    label: labels[item.key],
  }))

  const toggleCheck = (key: string) => {
    setChecked({ ...checked, [key]: !checked[key] })
  }

  const duringFlood = [
    'Move to higher ground immediately when warned',
    'Do not walk or drive through flood waters',
    'Keep your phone charged and stay tuned to alerts',
    'Help elderly, children, and disabled persons',
    'Disconnect electrical appliances before water enters',
    'Keep emergency contacts and documents with you',
  ]

  const afterFlood = [
    'Wait for official all-clear before returning home',
    'Avoid flood water — it may be contaminated or electrically charged',
    'Check for structural damage before entering buildings',
    'Boil drinking water until supply is confirmed safe',
    'Document damage with photos for insurance claims',
    'Report hazards (broken power lines, gas leaks) to authorities',
  ]

  const phaseStyles: Record<string, { active: string; inactive: string }> = {
    before: { active: 'bg-primary-600 text-white', inactive: 'text-slate-400' },
    during: { active: 'bg-warning-600 text-white', inactive: 'text-slate-400' },
    after: { active: 'bg-success-600 text-white', inactive: 'text-slate-400' },
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardCheck className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.preparednessTitle}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">{t.preparednessDesc}</p>

        {/* Phase selector */}
        <div className="flex gap-2 mb-5">
          {(['before', 'during', 'after'] as const).map((phase) => {
            const labels: Record<string, string> = { before: t.beforeFlood, during: t.duringFlood, after: t.afterFlood }
            const st = phaseStyles[phase]
            return (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activePhase === phase ? st.active : `bg-slate-800 ${st.inactive} hover:bg-slate-700`}`}
              >
                {labels[phase]}
              </button>
            )
          })}
        </div>

        {/* Before flood — interactive checklist */}
        {activePhase === 'before' && (
          <div className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon
              const isChecked = checked[item.key]
              return (
                <button
                  key={item.key}
                  onClick={() => toggleCheck(item.key)}
                  className={`w-full flex items-center gap-3 rounded-lg p-3 border transition-all text-left ${isChecked ? 'bg-success-900/20 border-success-700/30' : 'bg-slate-900/60 border-slate-700/30 hover:border-slate-600'}`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-success-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600 flex-shrink-0" />
                  )}
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isChecked ? 'text-success-400' : 'text-slate-500'}`} />
                  <span className={`text-sm ${isChecked ? 'text-success-300 line-through' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
            <div className="mt-3 text-xs text-slate-500 text-center">
              {Object.values(checked).filter(Boolean).length} / {items.length} items checked
            </div>
          </div>
        )}

        {/* During flood */}
        {activePhase === 'during' && (
          <div className="space-y-2">
            {duringFlood.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-warning-900/10 border border-warning-700/20 rounded-lg p-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warning-600/20 text-warning-400 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-300">{tip}</span>
              </div>
            ))}
          </div>
        )}

        {/* After flood */}
        {activePhase === 'after' && (
          <div className="space-y-2">
            {afterFlood.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-success-900/10 border border-success-700/20 rounded-lg p-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-success-600/20 text-success-400 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-300">{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

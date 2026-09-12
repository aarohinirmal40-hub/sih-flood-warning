import { Heart, UserPlus, CheckCircle2, AlertCircle, Phone, X, User } from 'lucide-react'
import { useState } from 'react'
import { type UIText } from '../lib/translations'

interface FamilyMember {
  id: string
  name: string
  phone: string
  status: 'safe' | 'unknown' | 'needHelp'
  lastCheckIn: string | null
}

interface FamilySafetyProps {
  t: UIText
}

export default function FamilySafety({ t }: FamilySafetyProps) {
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'Demo Member', phone: '+91 98765 43210', status: 'unknown', lastCheckIn: null },
  ])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const handleAdd = () => {
    if (!newName.trim()) return
    setMembers([...members, {
      id: Date.now().toString(),
      name: newName.trim(),
      phone: newPhone.trim() || '—',
      status: 'unknown',
      lastCheckIn: null,
    }])
    setNewName('')
    setNewPhone('')
    setShowAddForm(false)
  }

  const handleRemove = (id: string) => {
    setMembers(members.filter((m) => m.id !== id))
  }

  const handleCheckIn = (id: string, status: 'safe' | 'needHelp') => {
    setMembers(members.map((m) =>
      m.id === id
        ? { ...m, status, lastCheckIn: new Date().toLocaleString() }
        : m
    ))
  }

  const statusConfig: Record<string, { bg: string; text: string; label: string; icon: typeof CheckCircle2 }> = {
    safe: { bg: 'bg-success-900/40', text: 'text-success-400', label: t.statusSafe, icon: CheckCircle2 },
    unknown: { bg: 'bg-slate-700/40', text: 'text-slate-400', label: t.statusUnknown, icon: AlertCircle },
    needHelp: { bg: 'bg-danger-900/40', text: 'text-danger-400', label: t.statusNeedHelp, icon: AlertCircle },
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-danger-400" />
            <h3 className="text-base font-semibold text-slate-200">{t.familyTitle}</h3>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {t.addFamilyMember}
          </button>
        </div>
        <p className="text-sm text-slate-400 mb-4">{t.familyDesc}</p>

        {/* Demo disclaimer */}
        <div className="bg-warning-900/20 border border-warning-700/30 rounded-lg p-3 mb-4">
          <p className="text-xs text-warning-300">
            Family Safety runs on local device data. Check-ins are stored locally and do not send real SMS or track live locations.
          </p>
        </div>

        {/* Add form */}
        {showAddForm && (
          <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/30 mb-4 animate-slide-in">
            <div className="grid md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t.familyName}</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Enter name..."
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t.familyPhone}</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="+91 ..."
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-3 py-2 text-sm font-medium transition-all"
              >
                Add Member
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg px-3 py-2 text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Member cards */}
        <div className="space-y-3">
          {members.map((m) => {
            const st = statusConfig[m.status]
            const StatusIcon = st.icon
            return (
              <div key={m.id} className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${st.bg} ${st.text} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {st.label}
                    </span>
                    <button
                      onClick={() => handleRemove(m.id)}
                      className="text-slate-600 hover:text-danger-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {m.lastCheckIn && (
                  <p className="text-xs text-slate-500 mb-3">Last check-in: {m.lastCheckIn}</p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCheckIn(m.id, 'safe')}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-success-600/20 hover:bg-success-600/30 text-success-400 border border-success-700/30 rounded-lg px-3 py-2 text-xs font-medium transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t.imSafe}
                  </button>
                  <button
                    onClick={() => handleCheckIn(m.id, 'needHelp')}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-danger-600/20 hover:bg-danger-600/30 text-danger-400 border border-danger-700/30 rounded-lg px-3 py-2 text-xs font-medium transition-all"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {t.emergencyCheckin}
                  </button>
                  {m.phone !== '—' && (
                    <a
                      href={`tel:${m.phone.replace(/\s/g, '')}`}
                      className="flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg px-3 py-2 text-xs transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {members.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Heart className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No family members added yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

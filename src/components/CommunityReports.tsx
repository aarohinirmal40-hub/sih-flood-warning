import { Camera, Send, Database, AlertCircle, CheckCircle2, Loader2, MapPin, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import { type UIText } from '../lib/translations'
import { fetchReports, insertReport, type FloodReport } from '../lib/supabase'

interface CommunityReportsProps {
  t: UIText
  selectedName: string
  lat: number
  lon: number
}

const reportCategories = [
  'Waterlogging',
  'Rising Water Level',
  'Blocked Road',
  'Damaged Bridge',
  'Rescue Required',
  'Other Emergency',
]

const severityLevels = [
  { value: 'Low', color: 'bg-success-900/40 text-success-400' },
  { value: 'Moderate', color: 'bg-yellow-900/40 text-yellow-400' },
  { value: 'High', color: 'bg-warning-900/40 text-warning-400' },
  { value: 'Critical', color: 'bg-danger-900/40 text-danger-400' },
]

export default function CommunityReports({ t, selectedName, lat, lon }: CommunityReportsProps) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState(selectedName)
  const [category, setCategory] = useState(reportCategories[0])
  const [severity, setSeverity] = useState('Moderate')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [reports, setReports] = useState<FloodReport[]>([])
  const [loadingReports, setLoadingReports] = useState(true)
  const [reportsError, setReportsError] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('All')

  useEffect(() => {
    setLocation(selectedName)
  }, [selectedName])

  const loadReports = async () => {
    setLoadingReports(true)
    setReportsError(null)
    try {
      const data = await fetchReports()
      setReports(data)
    } catch {
      setReportsError('Failed to load reports. Database connection error.')
    } finally {
      setLoadingReports(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !location.trim()) {
      setSubmitStatus('error')
      return
    }
    setSubmitting(true)
    setSubmitStatus('idle')
    try {
      await insertReport({
        name: name.trim(),
        location: location.trim(),
        issue: `${category} [${severity}]`,
        details: details.trim(),
      })
      setSubmitStatus('success')
      setName('')
      setDetails('')
      await loadReports()
    } catch {
      setSubmitStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredReports = filterCategory === 'All'
    ? reports
    : reports.filter((r) => r.issue.includes(filterCategory))

  const getSeverityColor = (issue: string): string => {
    if (issue.includes('Critical')) return 'bg-danger-900/40 text-danger-400'
    if (issue.includes('High')) return 'bg-warning-900/40 text-warning-400'
    if (issue.includes('Moderate')) return 'bg-yellow-900/40 text-yellow-400'
    return 'bg-success-900/40 text-success-400'
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Report form */}
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.reportsTitle}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">{t.reportsDesc}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">{t.reporterName}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="Enter your name..."
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">{t.reporterLoc}</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">{t.reportCategory}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              >
                {reportCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">{t.reportSeverity}</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              >
                {severityLevels.map((s) => <option key={s.value} value={s.value}>{s.value}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">{t.additionalDetails}</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
              placeholder="Describe what you see..."
            />
          </div>

          {submitStatus === 'success' && (
            <div className="bg-success-900/30 border border-success-700/50 rounded-lg p-3 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-success-400" />
              <p className="text-sm text-success-300">{t.submitSuccess}</p>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="bg-danger-900/30 border border-danger-700/50 rounded-lg p-3 flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-danger-400" />
              <p className="text-sm text-danger-300">{t.submitWarn}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-danger-600 hover:bg-danger-700 disabled:opacity-50 text-white rounded-lg px-4 py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? 'Submitting...' : t.submitBtn}
          </button>
        </form>
      </div>

      {/* Report feed */}
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary-400" />
            <h3 className="text-base font-semibold text-slate-200">{t.liveIncidents}</h3>
          </div>
          {reports.length > 0 && (
            <span className="text-xs text-slate-500">{filteredReports.length} reports</span>
          )}
        </div>

        {/* Category filter */}
        {reports.length > 0 && (
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <button
              onClick={() => setFilterCategory('All')}
              className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${filterCategory === 'All' ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              All
            </button>
            {reportCategories.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${filterCategory === c ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loadingReports ? (
          <div className="flex items-center justify-center py-8 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading reports...
          </div>
        ) : reportsError ? (
          <div className="flex items-center gap-2 bg-danger-900/20 border border-danger-700/40 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 text-danger-400" />
            <p className="text-sm text-danger-300">{reportsError}</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Database className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">{t.noReports}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredReports.map((r) => (
              <div key={r.id} className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/30">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-200">{r.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityColor(r.issue)}`}>
                    {r.issue}
                  </span>
                </div>
                <p className="text-xs text-slate-500 ml-5.5">{r.location}</p>
                {r.details && (
                  <p className="text-xs text-slate-400 mt-1 ml-5.5">{r.details}</p>
                )}
                <p className="text-[10px] text-slate-600 mt-1.5 ml-5.5">{new Date(r.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

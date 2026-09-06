import { Camera, Send, Database, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { type UIText } from '../lib/translations'
import { fetchReports, insertReport, type FloodReport } from '../lib/supabase'

interface SosReportProps {
  t: UIText
  selectedName: string
}

const hazardTypes = [
  'Nallah/River Blockage',
  'Landslide on Main Road',
  'Sudden Water Rise',
  'Bridge Structural Damage',
]

export default function SosReport({ t, selectedName }: SosReportProps) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState(selectedName)
  const [issue, setIssue] = useState(hazardTypes[0])
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [reports, setReports] = useState<FloodReport[]>([])
  const [loadingReports, setLoadingReports] = useState(true)
  const [reportsError, setReportsError] = useState<string | null>(null)

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
      await insertReport({ name: name.trim(), location: location.trim(), issue, details: details.trim() })
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

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.sosTitle}</h3>
        </div>

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
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{t.observedHazard}</label>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {hazardTypes.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
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

      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.liveIncidents}</h3>
        </div>

        {loadingReports ? (
          <div className="flex items-center justify-center py-8 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading reports...
          </div>
        ) : reportsError ? (
          <div className="flex items-center gap-2 bg-danger-900/20 border border-danger-700/40 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 text-danger-400" />
            <p className="text-sm text-danger-300">{reportsError}</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Database className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">{t.noReports}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-700/50">
                  <th className="pb-2 pr-3 font-medium">Name</th>
                  <th className="pb-2 pr-3 font-medium">Location</th>
                  <th className="pb-2 pr-3 font-medium">Hazard</th>
                  <th className="pb-2 pr-3 font-medium">Details</th>
                  <th className="pb-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                    <td className="py-2.5 pr-3 text-slate-200 font-medium">{r.name}</td>
                    <td className="py-2.5 pr-3 text-slate-400">{r.location}</td>
                    <td className="py-2.5 pr-3">
                      <span className="text-xs bg-danger-900/30 text-danger-400 px-2 py-0.5 rounded-full">{r.issue}</span>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-500 max-w-[200px] truncate">{r.details || '—'}</td>
                    <td className="py-2.5 text-slate-500 text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

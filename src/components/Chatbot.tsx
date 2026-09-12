import { Bot, Send, Info, AlertTriangle, ShieldCheck, Home, Siren, ClipboardCheck } from 'lucide-react'
import { useState } from 'react'
import { type UIText } from '../lib/translations'

interface ChatbotProps {
  t: UIText
  selectedName: string
  riskScore: number | null
  actionMsg: string
  rain: number | null
  riverLevel: number | null
}

interface ChatMessage {
  role: 'user' | 'bot'
  text: string
  isLiveData?: boolean
}

export default function Chatbot({ t, selectedName, riskScore, actionMsg, rain, riverLevel }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')

  const getResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase()

    if (q.match(/is my area|area at risk|current risk|risk level|what.*risk/)) {
      if (riskScore === null) {
        return {
          role: 'bot',
          text: `Live weather data for ${selectedName} is currently unavailable. Risk status cannot be determined. Please try again when the API is available.`,
        }
      }
      const level = riskScore >= 81 ? 'CRITICAL' : riskScore >= 61 ? 'WARNING' : riskScore >= 31 ? 'WATCH' : 'SAFE'
      return {
        role: 'bot',
        text: `[LIVE DATA] Risk score for ${selectedName}: ${riskScore.toFixed(0)}/100 — Level: ${level}. ${actionMsg}`,
        isLiveData: true,
      }
    }

    if (q.match(/what should i do|what.*do now|action|advisory/)) {
      if (riskScore === null) {
        return { role: 'bot', text: `Weather data is unavailable for ${selectedName}. I cannot recommend specific actions without live data. In general, stay alert and monitor official channels.` }
      }
      return {
        role: 'bot',
        text: `[LIVE DATA] Based on current risk (${riskScore.toFixed(0)}/100) for ${selectedName}: ${actionMsg}`,
        isLiveData: true,
      }
    }

    if (q.match(/shelter|camp|where.*safe|relief/)) {
      return {
        role: 'bot',
        text: `[SIMULATED DATA] Nearest relief shelters: Govt Primary School (1.2 km, OPEN), Panchayat Bhawan (2.5 km, OPEN), Community Centre (3.8 km, STANDBY). Use the Shelters tab for full details and routing.`,
      }
    }

    if (q.match(/evacuat|how.*evacuate|route|escape/)) {
      return {
        role: 'bot',
        text: `[GENERAL GUIDANCE] Evacuation steps: 1) Move to higher ground immediately. 2) Avoid walking or driving through flood water. 3) Follow the green safe route on the Safe Routing tab. 4) Help elderly and children first. 5) Carry your emergency kit and documents.`,
      }
    }

    if (q.match(/rescue|help me|emergency|sos|save/)) {
      return {
        role: 'bot',
        text: `[EMERGENCY] Call 112 immediately for rescue. Share your location with rescuers. If possible, move to higher ground and wait. Use the Emergency Center tab for one-tap SOS and rescue request.`,
      }
    }

    if (q.match(/checklist|prepare|prepared|kit|before flood|safety checklist/)) {
      return {
        role: 'bot',
        text: `[GENERAL GUIDANCE] Flood preparedness checklist: 1) Waterproof documents bag. 2) 7-day medicine supply. 3) 3L drinking water per person. 4) Emergency kit (first aid, torch, whistle). 5) Phone & power bank charged. 6) Know your evacuation route. Visit the Preparedness tab for interactive checklists.`,
      }
    }

    if (q.match(/helpline|number|call|contact|ndrf|police|ambulance/)) {
      return {
        role: 'bot',
        text: `[GENERAL GUIDANCE] Emergency contacts: 112 (Emergency), 1077 (District Control Room), 108 (Ambulance), NDRF Command: 011-24363260.`,
      }
    }

    if (q.match(/rain|rainfall|weather|temperature|humidity/)) {
      const rainText = rain !== null ? `${rain.toFixed(1)} mm/hr` : 'unavailable'
      const riverText = riverLevel !== null ? `${riverLevel}m` : 'unavailable'
      if (rain === null) {
        return { role: 'bot', text: `[UNAVAILABLE] Live weather data for ${selectedName} is currently unavailable. Please try again later.` }
      }
      return {
        role: 'bot',
        text: `[LIVE DATA] For ${selectedName} — Rainfall: ${rainText}, Est. water elevation: ${riverText}. Source: Open-Meteo API.`,
        isLiveData: true,
      }
    }

    if (q.match(/bridge|cross|safe.*cross/)) {
      return {
        role: 'bot',
        text: `[GENERAL GUIDANCE] Do not cross bridges or roads submerged in flood water. Even shallow fast-moving water can sweep you away. Wait for official clearance before crossing.`,
      }
    }

    return {
      role: 'bot',
      text: `[GENERAL GUIDANCE] I can help with: risk assessment for your area, evacuation guidance, shelter locations, emergency contacts, rescue instructions, and flood preparedness. Ask me any of these, or use the quick action buttons below.`,
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    const botMsg = getResponse(userMsg)
    setMessages([...messages, { role: 'user', text: userMsg }, botMsg])
    setInput('')
  }

  const quickQuestions = [
    { text: 'Is my area at risk?', icon: AlertTriangle },
    { text: 'What should I do now?', icon: ShieldCheck },
    { text: 'Find a shelter', icon: Home },
    { text: 'How do I evacuate?', icon: Info },
    { text: 'I need rescue', icon: Siren },
    { text: 'Flood safety checklist', icon: ClipboardCheck },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.chatbotTitle}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">{t.chatbotDesc} — <span className="text-primary-400">{selectedName}</span></p>

        {/* Data integrity disclaimer */}
        <div className="bg-slate-900/60 border border-slate-700/30 rounded-lg p-3 mb-4 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500">
            Responses are tagged: <span className="text-success-400 font-medium">[LIVE DATA]</span> from weather API, <span className="text-warning-400 font-medium">[SIMULATED DATA]</span> for demo shelter info, <span className="text-slate-400 font-medium">[GENERAL GUIDANCE]</span> for safety tips, <span className="text-danger-400 font-medium">[EMERGENCY]</span> for urgent actions.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {quickQuestions.map((q) => {
            const Icon = q.icon
            return (
              <button
                key={q.text}
                onClick={() => {
                  const botMsg = getResponse(q.text)
                  setMessages([...messages, { role: 'user', text: q.text }, botMsg])
                }}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg px-3 py-2 text-xs font-medium transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                {q.text}
              </button>
            )
          })}
        </div>

        {/* Chat area */}
        <div className="bg-slate-900/60 rounded-xl border border-slate-700/30 p-4 min-h-[300px] max-h-[400px] overflow-y-auto space-y-3 mb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-slate-500">
              <Bot className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Ask me about flood safety, risk, shelters, or evacuation...</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-white" /></div>}
                <div className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700/50'}`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.chatbotPlaceholder}
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
          <button
            onClick={handleSend}
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

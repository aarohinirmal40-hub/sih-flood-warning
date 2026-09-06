import { Bot, Send } from 'lucide-react'
import { useState } from 'react'
import { type UIText } from '../lib/translations'

interface ChatbotProps {
  t: UIText
  selectedName: string
  riskScore: number
  actionMsg: string
  rain: number
  riverLevel: number
}

interface ChatMessage {
  role: 'user' | 'bot'
  text: string
}

export default function Chatbot({ t, selectedName, riskScore, actionMsg, rain, riverLevel }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')

  const getResponse = (query: string): string => {
    const q = query.toLowerCase()
    if (q.match(/camp|shelter|where|near|school|hub/)) {
      return `Nearest operational relief camps are Govt Primary School (1.2 km) and Panchayat Bhawan (2.5 km). Follow the green safe transit corridor on the map.`
    }
    if (q.match(/safe|danger|risk|status|condition|flood/)) {
      return `Current risk score for ${selectedName} is ${riskScore.toFixed(0)}/100. ${actionMsg}`
    }
    if (q.match(/helpline|number|call|contact|ndrf|police|ambulance/)) {
      return `Emergency Helpline Directory: District Control Room: 1077, NDRF Command: 011-24363260, SDRF & Flood Helpline: 108.`
    }
    return `Based on live telemetry for ${selectedName}, current rainfall is ${rain.toFixed(1)} mm/hr and water elevation is ${riverLevel}m. Audio siren broadcast nodes are fully synchronized.`
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    const botMsg = getResponse(userMsg)
    setMessages([...messages, { role: 'user', text: userMsg }, { role: 'bot', text: botMsg }])
    setInput('')
  }

  const quickQuestions = [
    'Where is the nearest safe camp?',
    'Is it safe to cross the bridge?',
    'What is the current risk level?',
    'Emergency helpline numbers',
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-5 h-5 text-primary-400" />
          <h3 className="text-base font-semibold text-slate-200">{t.chatbotTitle}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">{t.chatbotDesc} — <span className="text-primary-400">{selectedName}</span></p>

        <div className="flex flex-wrap gap-2 mb-4">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => {
                const botMsg = getResponse(q)
                setMessages([...messages, { role: 'user', text: q }, { role: 'bot', text: botMsg }])
              }}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full px-3 py-1.5 transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/60 rounded-xl border border-slate-700/30 p-4 min-h-[300px] max-h-[400px] overflow-y-auto space-y-3 mb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-slate-500">
              <Bot className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Ask me anything about flood safety...</p>
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

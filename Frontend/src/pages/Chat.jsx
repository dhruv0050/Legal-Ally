import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    .font-serif-display { font-family: 'Cormorant Garamond', Georgia, serif; }
    .font-body          { font-family: 'DM Sans', system-ui, sans-serif; }
    @keyframes fadeUp   { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes pulseDot { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:.35; transform:scale(.7) } }
    @keyframes bounce   { 0%,60%,100% { transform:translateY(0); opacity:.35 } 30% { transform:translateY(-5px); opacity:1 } }
    .animate-msg-in  { animation: fadeUp .3s ease both; }
    .animate-pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
    .bounce-dot      { animation: bounce 1.2s ease-in-out infinite; }
    .bounce-dot-2    { animation: bounce 1.2s ease-in-out .2s infinite; }
    .bounce-dot-3    { animation: bounce 1.2s ease-in-out .4s infinite; }

    /* Thin scrollbar for messages */
    .thin-scroll { scrollbar-width: thin; scrollbar-color: #e7e5e4 transparent; }
    .thin-scroll::-webkit-scrollbar { width: 4px; }
    .thin-scroll::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 2px; }

    /* Prose markdown inside assistant bubble */
    .ai-prose h3 { font-family:'Cormorant Garamond',Georgia,serif; font-size:1.1rem; font-weight:500;
                   color:#1c1917; margin:1.1rem 0 .4rem; padding-bottom:.35rem;
                   border-bottom:1px solid #e7e5e4; }
    .ai-prose h3:first-child { margin-top:0; }
    .ai-prose h4 { font-family:'Cormorant Garamond',Georgia,serif; font-size:.95rem; font-weight:500;
                   color:#1c1917; margin:.9rem 0 .3rem; }
    .ai-prose p  { font-size:.875rem; font-weight:300; line-height:1.85; color:#57534e; margin-bottom:.7rem; }
    .ai-prose p:last-child { margin-bottom:0; }
    .ai-prose ul,
    .ai-prose ol  { padding-left:1.25rem; margin-bottom:.7rem; }
    .ai-prose li  { font-size:.875rem; font-weight:300; line-height:1.75; color:#57534e; margin-bottom:.2rem; }
    .ai-prose strong { font-weight:500; color:#1c1917; }
    .ai-prose code { font-family:'Courier New',monospace; font-size:.78rem;
                     background:#f5f5f4; color:#b45309; padding:.1rem .35rem;
                     border:1px solid #e7e5e4; }
  `}</style>
)

const PROMPTS = [
  { title: 'Motor Accident',   sub: 'What sections apply?' },
  { title: 'Property Dispute', sub: 'Understand your rights' },
  { title: 'Contract Breach',  sub: 'Legal remedies available' },
  { title: 'Consumer Rights',  sub: 'Defective product laws' },
]

export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [isLoading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef    = useRef(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { scrollToBottom() }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px'
    }
  }, [input])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg = { role: 'user', content: input.trim(), timestamp: new Date().toISOString() }
    setMessages(p => [...p, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:8000/api/chat', { query: userMsg.content })
      setMessages(p => [...p, {
        role: 'assistant',
        content: res.data.answer,
        sources: res.data.sources,
        timestamp: new Date().toISOString(),
      }])
    } catch {
      setMessages(p => [...p, {
        role: 'assistant',
        content: 'I encountered an issue connecting to the server. Please ensure the backend is running and try again.',
        isError: true,
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="font-body flex flex-col h-screen bg-stone-50 text-stone-900 overflow-hidden">
      <FontLoader />

      {/* ── HEADER ── */}
      <header className="flex-shrink-0 z-10 flex items-center justify-between
                         px-6 md:px-12 py-4
                         bg-stone-50/90 backdrop-blur-xl border-b border-stone-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-stone-500
                       text-xs font-medium tracking-widest uppercase
                       hover:border-amber-600 hover:text-amber-700 transition-all duration-200"
          >
            ← Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="font-serif-display text-xl font-medium text-stone-800
                       hover:text-amber-700 transition-colors duration-200"
          >
            Legal<span className="text-amber-700"> Ally</span>
          </button>
        </div>
        {/* Clear */}
        
        <div>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-xs font-medium tracking-widest uppercase text-stone-400
                         hover:text-amber-700 transition-colors duration-200 px-3 py-2"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      {/* ── MESSAGES ── */}
      <main className="flex-1 overflow-y-auto thin-scroll">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center text-center pt-8 pb-6">
              <span className="text-amber-600/30 text-3xl tracking-[0.6em] mb-8 select-none">✦ ✦ ✦</span>

              <h2 className="font-serif-display font-light text-stone-800 leading-tight mb-4
                             text-4xl md:text-5xl">
                How may I<br /><em className="italic text-amber-700">assist you?</em>
              </h2>
              <p className="text-stone-500 text-sm font-light leading-[1.85] max-w-md mb-10">
                Describe your legal situation in plain language. I'll identify the relevant
                sections, statutes, and provide a clear analysis.
              </p>

              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {PROMPTS.map(({ title, sub }) => (
                  <button
                    key={title}
                    onClick={() => setInput(`I need help understanding ${title.toLowerCase()} laws.`)}
                    className="group relative text-left p-5 bg-white border border-stone-200
                               hover:border-amber-600 hover:bg-stone-50 hover:-translate-y-0.5
                               transition-all duration-200 overflow-hidden"
                  >
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600
                                     opacity-0 group-hover:opacity-100 group-hover:translate-x-0
                                     -translate-x-1 transition-all duration-200 text-sm">→</span>
                    <p className="font-serif-display text-base font-medium text-stone-800 mb-0.5">{title}</p>
                    <p className="text-stone-400 text-xs font-light">{sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg, i) => (
            <div key={i}
                 className={`flex mb-7 animate-msg-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end max-w-[65%]' : 'items-start max-w-[75%]'}`}>

                {/* Avatar + label */}
                <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center
                                    text-[0.55rem] font-semibold tracking-wide flex-shrink-0
                                    ${msg.role === 'user'
                                      ? 'bg-stone-900 text-stone-100'
                                      : 'bg-amber-600 text-white'}`}>
                    {msg.role === 'user' ? 'U' : 'LA'}
                  </span>
                  <span className="text-stone-400 text-[0.65rem] font-medium tracking-[0.12em] uppercase">
                    {msg.role === 'user' ? 'You' : 'Legal Ally'}
                  </span>
                </div>

                {/* Bubble */}
                <div className={`px-5 py-4 leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-stone-900 text-stone-100 text-sm font-light'
                    : msg.isError
                      ? 'bg-red-50 border border-red-200 text-red-700 text-sm font-light'
                      : 'bg-white border border-stone-200 text-stone-800'}`}>
                  {msg.role === 'user'
                    ? <span className="whitespace-pre-wrap">{msg.content}</span>
                    : (
                      <div className="ai-prose">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex mb-7 justify-start animate-msg-in">
              <div className="flex flex-col gap-2 items-start">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center
                                   text-[0.55rem] font-semibold text-white">LA</span>
                  <span className="text-stone-400 text-[0.65rem] font-medium tracking-[0.12em] uppercase">
                    Legal Ally
                  </span>
                </div>
                <div className="bg-white border border-stone-200 px-5 py-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 bounce-dot" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 bounce-dot-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 bounce-dot-3" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ── INPUT ── */}
      <footer className="flex-shrink-0 z-10 bg-stone-50/95 backdrop-blur-xl border-t border-stone-200
                         px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-white border border-stone-200
                          px-5 py-3.5 focus-within:border-amber-600
                          focus-within:shadow-[0_0_0_3px_rgba(180,83,9,0.08)]
                          transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKey}
              placeholder="Describe your legal situation…"
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none resize-none
                         text-stone-800 text-sm font-light leading-relaxed
                         placeholder:text-stone-400 min-h-[24px] max-h-40 overflow-y-auto thin-scroll"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center
                         bg-stone-900 text-stone-50 text-base
                         hover:bg-amber-700 hover:-translate-y-0.5
                         disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed
                         disabled:translate-y-0 transition-all duration-200"
            >
              →
            </button>
          </div>
          <p className="text-center text-stone-400 text-[0.65rem] tracking-[0.1em] uppercase mt-2.5">
            Enter to send · Shift + Enter for new line
          </p>
        </div>
      </footer>
    </div>
  )
}
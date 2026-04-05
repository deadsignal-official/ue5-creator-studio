import { useState, useRef, useEffect } from 'react'

const SYSTEM = `You are an expert Unreal Engine 5 development assistant inside "UE5 Creator Studio".
You have deep knowledge of UE5.7.4: Lumen, Nanite, PCG, Blueprints, C++, Materials, Sequencer, Niagara VFX, MetaSounds, Behavior Trees, EQS, UMG, multiplayer networking, performance optimization, and all game genres.
Give clear, practical, actionable answers. Use examples. Speak Dutch if the user speaks Dutch, English if English.`

const GROQ_MODELS = [
  { id: 'llama-3.3-70b-versatile', label: 'LLaMA 3.3 70B (Best)' },
  { id: 'llama-3.1-8b-instant', label: 'LLaMA 3.1 8B (Fast)' },
  { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
]

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: '👋 Hey! Ik ben je UE5 AI Assistent, aangedreven door Groq. Stel me alles over Unreal Engine 5 — Blueprints, levels, VFX, AI, materials, en meer! 🎮' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('groq_key') || '')
  const [tmpKey, setTmpKey] = useState('')
  const [model, setModel] = useState('llama-3.3-70b-versatile')
  const [keySet, setKeySet] = useState(() => !!localStorage.getItem('groq_key'))
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  const saveKey = () => {
    const k = tmpKey.trim()
    if (k.startsWith('gsk_')) {
      localStorage.setItem('groq_key', k)
      setApiKey(k)
      setKeySet(true)
      setTmpKey('')
    } else {
      alert('Ongeldige Groq API key. Een Groq key begint met "gsk_"')
    }
  }

  const send = async () => {
    if (!input.trim() || loading || !apiKey) return
    const userMsg = { role: 'user', content: input.trim() }
    const newMsgs = [...msgs, userMsg]
    setMsgs(newMsgs)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          messages: [
            { role: 'system', content: SYSTEM },
            ...newMsgs.map(m => ({ role: m.role, content: m.content }))
          ]
        })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error?.message || `HTTP ${res.status}`)
      }

      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || 'Geen antwoord ontvangen.'
      setMsgs([...newMsgs, { role: 'assistant', content: reply }])
    } catch (e) {
      setMsgs([...newMsgs, { role: 'assistant', content: `⚠️ Fout: ${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      <button className="ai-btn" onClick={() => setOpen(o => !o)} title="AI Assistent">
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div className="ai-panel">
          <div className="ai-hdr">
            <div className="ai-av">🤖</div>
            <div>
              <div className="ai-hdr-title">UE5 AI ASSISTENT</div>
              <div className="ai-hdr-sub">● Groq — {GROQ_MODELS.find(m => m.id === model)?.label}</div>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>

          {!keySet ? (
            <div className="key-box">
              <div className="key-title">🔑 Groq API Key vereist</div>
              <div className="key-desc">
                Haal gratis je key op via{' '}
                <a href="https://console.groq.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
                  console.groq.com
                </a>
              </div>
              <div className="key-row">
                <input type="password" value={tmpKey} onChange={e => setTmpKey(e.target.value)}
                  placeholder="gsk_..." onKeyDown={e => e.key === 'Enter' && saveKey()}
                  style={{ flex: 1, fontSize: 12, padding: '6px 8px' }} />
                <button className="btn btn-p" onClick={saveKey} style={{ padding: '6px 12px', fontSize: 11 }}>
                  Opslaan
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '6px 10px', background: 'var(--elevated)', borderBottom: '1px solid var(--border)' }}>
              <select value={model} onChange={e => setModel(e.target.value)}
                style={{ width: '100%', fontSize: 11, padding: '4px 6px', background: 'var(--card)' }}>
                {GROQ_MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </div>
          )}

          <div className="ai-msgs">
            {msgs.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role === 'user' ? 'u' : 'a'}`}>{m.content}</div>
            ))}
            {loading && <div className="ai-msg think">● Groq denkt na...</div>}
            <div ref={bottomRef} />
          </div>

          <div className="ai-inp-row">
            <textarea className="ai-inp" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={onKey} disabled={!keySet || loading}
              placeholder={keySet ? 'Stel een UE5 vraag...' : 'Voer eerst je Groq API key in...'} />
            <button className="ai-send" onClick={send} disabled={!keySet || loading || !input.trim()}>
              {loading ? '⏳' : '➤'}
            </button>
          </div>

          {keySet && (
            <div style={{ padding: '4px 10px 7px', fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--fc)' }}>
              <button onClick={() => { localStorage.removeItem('groq_key'); setApiKey(''); setKeySet(false) }}
                style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 10, textDecoration: 'underline' }}>
                API key verwijderen
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

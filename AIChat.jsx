import { useState, useRef, useEffect } from 'react'

const SYSTEM_PROMPT = `You are an expert Unreal Engine 5 development assistant inside the "UE5 Creator Studio" app.
You have deep knowledge of:
- Unreal Engine 5.7.4 features: Lumen, Nanite, PCG, Chaos Physics, MetaSounds, Verse
- Blueprint visual scripting (all node types, best practices, optimization)
- C++ for Unreal Engine development
- Level design and world building techniques
- Material and shader creation (HLSL, Material Functions)
- Animation Blueprints, Sequencer, Control Rig
- AI systems: Behavior Trees, Navigation, EQS
- Niagara VFX particle systems
- UMG widget design and UI/UX for games
- Multiplayer networking (Replication, RPC)
- Performance optimization and profiling
- Game design patterns for various genres

Always give clear, practical, actionable answers. Use code examples when relevant.
Format your responses clearly. Be concise but thorough. When discussing Blueprints, describe nodes by name.
Speak Dutch if the user speaks Dutch, English if the user speaks English.`

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hey! Ik ben je UE5 AI Assistent. Stel me alles over Unreal Engine 5, Blueprints, levels bouwen, VFX, AI, en meer! 🎮'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ue5_api_key') || '')
  const [tempKey, setTempKey] = useState('')
  const [keySet, setKeySet] = useState(() => !!localStorage.getItem('ue5_api_key'))
  const messagesRef = useRef(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, loading])

  const saveKey = () => {
    if (tempKey.trim().startsWith('sk-ant-')) {
      localStorage.setItem('ue5_api_key', tempKey.trim())
      setApiKey(tempKey.trim())
      setKeySet(true)
    } else {
      alert('Ongeldige API key. Een Anthropic key begint met "sk-ant-"')
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading || !apiKey) return

    const userMsg = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error?.message || 'API fout')
      }

      const data = await response.json()
      const assistantMsg = { role: 'assistant', content: data.content[0].text }
      setMessages([...newMessages, assistantMsg])
    } catch (err) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: `⚠️ Fout: ${err.message}. Controleer je API key.`
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <button className="ai-toggle" onClick={() => setOpen(o => !o)} title="AI Assistent">
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div className="ai-panel">
          <div className="ai-panel-header">
            <div className="ai-avatar">🤖</div>
            <div>
              <div className="ai-panel-title">UE5 AI ASSISTENT</div>
              <div className="ai-panel-sub">● Online — Claude Sonnet</div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16
            }}>✕</button>
          </div>

          {!keySet ? (
            <div className="api-key-banner">
              <div style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: 4 }}>🔑 API Key Vereist</div>
              <div>Voer je Anthropic API key in om de AI te activeren.</div>
              <div style={{ fontSize: 11, marginTop: 4, color: 'var(--text-muted)' }}>
                Haal hem op via <a href="https://console.anthropic.com" target="_blank" rel="noreferrer"
                  style={{ color: 'var(--accent)' }}>console.anthropic.com</a>
              </div>
              <div className="api-key-input-row">
                <input
                  type="password"
                  value={tempKey}
                  onChange={e => setTempKey(e.target.value)}
                  placeholder="sk-ant-..."
                  style={{ flex: 1, fontSize: 12, padding: '6px 8px' }}
                  onKeyDown={e => e.key === 'Enter' && saveKey()}
                />
                <button className="btn btn-primary" onClick={saveKey} style={{ padding: '6px 12px', fontSize: 11 }}>
                  Opslaan
                </button>
              </div>
            </div>
          ) : null}

          <div className="ai-messages" ref={messagesRef}>
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="ai-msg thinking">
                ● Denkt na...
              </div>
            )}
          </div>

          <div className="ai-input-row">
            <textarea
              className="ai-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={keySet ? 'Stel een UE5 vraag...' : 'Voer eerst API key in...'}
              disabled={!keySet || loading}
            />
            <button className="ai-send" onClick={sendMessage} disabled={!keySet || loading || !input.trim()}>
              {loading ? '⏳' : '➤'}
            </button>
          </div>

          {keySet && (
            <div style={{ padding: '4px 12px 8px', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)' }}>
              <button onClick={() => { localStorage.removeItem('ue5_api_key'); setApiKey(''); setKeySet(false); setTempKey('') }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 10, textDecoration: 'underline' }}>
                API key verwijderen
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

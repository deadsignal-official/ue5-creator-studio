import { useState } from 'react'
import { Card, SectionTitle, Badge, Toggle, Slider, PageHeader } from './UI.jsx'

// ══════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════
export function Dashboard({ setPage, toast }) {
  const templates = [
    { name: 'First Person Shooter', icon: '🔫', desc: 'FPS karakter, weapon systeem', page: 'blueprint' },
    { name: 'Third Person',          icon: '🧍', desc: 'TPS camera, movement setup', page: 'ai' },
    { name: 'Open World',            icon: '🌍', desc: 'World Partition, PCG foliage', page: 'world' },
    { name: 'Puzzle Game',           icon: '🧩', desc: 'Physics interaction systeem', page: 'blueprint' },
    { name: 'Racing Game',           icon: '🏎', desc: 'Vehicle physics, checkpoints', page: 'ai' },
    { name: 'Horror / Survival',     icon: '👻', desc: 'Atmosfeer, AI, tension', page: 'level' },
  ]
  const recent = ['MyFPS_Project', 'OpenWorld_v3', 'PuzzleGame_Final', 'HorrorDemo_Alpha']
  const stats = [['24', 'Assets'], ['6', 'Levels'], ['11', 'Blueprints'], ['4', 'VFX'], ['13', 'Materials'], ['8', 'Audio']]

  return (
    <div>
      <div style={{ marginBottom: 28, position: 'relative' }}>
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 200, height: 200,
          background: 'radial-gradient(circle, var(--accent-dim), transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--accent)', letterSpacing: 4, marginBottom: 6 }}>
          WELCOME TO
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: 2, lineHeight: 1.1 }}>
          UE5 CREATOR<br /><span style={{ color: 'var(--accent)' }}>STUDIO</span>
        </div>
        <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: 3, marginTop: 6 }}>
          UNREAL ENGINE 5.7.4 COMPANION APP
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3 mb-20">
        {stats.map(([n, l]) => (
          <div key={l} className="stat-box">
            <div className="stat-number">{n}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      {/* Templates */}
      <SectionTitle>Quick Start Templates</SectionTitle>
      <div className="grid-2 mb-20">
        {templates.map(t => (
          <div key={t.name} className="template-card" onClick={() => { toast('Template: ' + t.name); setPage(t.page) }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{t.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-primary)', letterSpacing: 1 }}>{t.name}</div>
            <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{t.desc}</div>
          </div>
        ))}
      </div>

      {/* Recent */}
      <SectionTitle>Recente Projecten</SectionTitle>
      <div className="flex-col">
        {recent.map(p => (
          <div key={p} onClick={() => toast('Project geopend: ' + p)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 8,
              cursor: 'pointer', transition: 'border-color 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <span style={{ fontFamily: 'var(--font-condensed)', fontSize: 13, color: 'var(--text-secondary)' }}>
              📁 {p}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)', letterSpacing: 1 }}>VANDAAG</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// LEVEL EDITOR
// ══════════════════════════════════════════════
export function LevelEditor({ toast }) {
  const [actors, setActors] = useState([
    { id: 1, name: 'DirectionalLight_Sun', type: 'Light', visible: true, x: 100, y: 60 },
    { id: 2, name: 'SM_LandscapeProxy', type: 'Mesh', visible: true, x: 180, y: 140 },
    { id: 3, name: 'PlayerStart', type: 'Actor', visible: true, x: 60, y: 180 },
    { id: 4, name: 'PostProcessVolume', type: 'Volume', visible: true, x: 240, y: 80 },
  ])
  const [selected, setSelected] = useState(null)
  const [tool, setTool] = useState('select')
  const [transform, setTransform] = useState({ px: 0, py: 0, pz: 0, rx: 0, ry: 0, rz: 0, sx: 1, sy: 1, sz: 1 })
  const tools = ['Select', 'Move', 'Rotate', 'Scale', 'Snap']
  const actorTypes = ['Static Mesh', 'Point Light', 'Spot Light', 'Sky Light', 'Camera', 'Trigger Box', 'NavMesh Bounds', 'Player Start', 'Atmospheric Fog', 'Sky Sphere']

  const addActor = (type) => {
    setActors(a => [...a, { id: Date.now(), name: type.replace(/ /g, '_') + '_' + a.length, type: type.split(' ')[0], visible: true, x: Math.random() * 250 + 20, y: Math.random() * 160 + 20 }])
    toast('Actor toegevoegd: ' + type)
  }

  return (
    <div>
      <PageHeader icon="🗺" title="Level Editor" subtitle="World composition & actor placement" />

      <div className="flex-row mb-12" style={{ flexWrap: 'wrap' }}>
        {tools.map(t => (
          <button key={t} className={`btn ${tool === t.toLowerCase() ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTool(t.toLowerCase())}>{t}</button>
        ))}
      </div>

      {/* Viewport */}
      <Card className="mb-12" style={{ padding: 0 }}>
        <div className="viewport" style={{ height: 280 }}>
          <span className="viewport-label">PERSPECTIVE · LIT</span>
          <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.12 }}>
            {[...Array(12)].map((_, i) => <line key={`v${i}`} x1={`${i * 8.33}%`} y1="0" x2={`${i * 8.33}%`} y2="100%" stroke="#4466ff" strokeWidth="0.5" />)}
            {[...Array(8)].map((_, i) => <line key={`h${i}`} x1="0" y1={`${i * 12.5}%`} x2="100%" y2={`${i * 12.5}%`} stroke="#4466ff" strokeWidth="0.5" />)}
          </svg>
          {/* Horizon gradient */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, #0a1a0a)' }} />
          {actors.filter(a => a.visible).map(a => (
            <div key={a.id} onClick={() => setSelected(a.id)}
              style={{
                position: 'absolute', left: a.x, top: a.y,
                background: selected === a.id ? 'var(--accent)' : 'var(--bg-elevated)',
                border: `1px solid ${selected === a.id ? 'var(--accent)' : 'var(--border-bright)'}`,
                borderRadius: 4, padding: '3px 8px', fontSize: 11,
                color: selected === a.id ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none',
                boxShadow: selected === a.id ? '0 0 10px var(--accent-glow)' : 'none',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-condensed)'
              }}>
              {a.type === 'Light' ? '💡' : a.type === 'Camera' ? '📷' : a.type === 'Volume' ? '🔷' : '⬜'} {a.name}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid-2 mb-12">
        {/* Actor Library */}
        <Card>
          <SectionTitle>Actor Plaatsen</SectionTitle>
          <div className="flex-col">
            {actorTypes.map(t => (
              <button key={t} className="btn btn-secondary" style={{ justifyContent: 'flex-start', textTransform: 'none', letterSpacing: 0 }}
                onClick={() => addActor(t)}>+ {t}</button>
            ))}
          </div>
        </Card>

        {/* Actor List */}
        <Card>
          <SectionTitle>Actors in Scene</SectionTitle>
          {actors.map(a => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '7px 0', borderBottom: '1px solid var(--border)'
            }}>
              <span style={{ color: selected === a.id ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-condensed)' }}
                onClick={() => setSelected(a.id)}>{a.name}</span>
              <div className="flex-row">
                <button onClick={() => setActors(actors.map(x => x.id === a.id ? { ...x, visible: !x.visible } : x))}
                  style={{ background: 'none', border: 'none', color: a.visible ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>
                  {a.visible ? '👁' : '🚫'}
                </button>
                <button onClick={() => { setActors(actors.filter(x => x.id !== a.id)); toast('Verwijderd') }}
                  style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: 13 }}>✕</button>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Transform */}
      <Card>
        <SectionTitle>Transform Controls</SectionTitle>
        <div className="grid-3 mb-12">
          {[['px','X','var(--red)'],['py','Y','#22c55e'],['pz','Z','var(--blue)']].map(([k,l,c]) => (
            <div key={k}>
              <div style={{ color: c, fontSize: 10, fontFamily: 'var(--font-condensed)', letterSpacing: 1, marginBottom: 4 }}>POS {l}</div>
              <input type="number" value={transform[k]} onChange={e => setTransform({...transform, [k]: e.target.value})} style={{ width: '100%' }} />
            </div>
          ))}
          {[['rx','RX'],['ry','RY'],['rz','RZ']].map(([k,l]) => (
            <div key={k}>
              <div style={{ color: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-condensed)', letterSpacing: 1, marginBottom: 4 }}>{l}</div>
              <input type="number" value={transform[k]} onChange={e => setTransform({...transform, [k]: e.target.value})} style={{ width: '100%' }} />
            </div>
          ))}
          {[['sx','SX'],['sy','SY'],['sz','SZ']].map(([k,l]) => (
            <div key={k}>
              <div style={{ color: '#fb923c', fontSize: 10, fontFamily: 'var(--font-condensed)', letterSpacing: 1, marginBottom: 4 }}>{l}</div>
              <input type="number" value={transform[k]} onChange={e => setTransform({...transform, [k]: e.target.value})} style={{ width: '100%' }} />
            </div>
          ))}
        </div>
        <button className="btn btn-primary w-full" onClick={() => toast('Transform opgeslagen!')}>Opslaan</button>
      </Card>
    </div>
  )
}

// ══════════════════════════════════════════════
// BLUEPRINT EDITOR
// ══════════════════════════════════════════════
export function BlueprintEditor({ toast }) {
  const [nodes, setNodes] = useState([
    { id: 1, type: 'Event BeginPlay', color: '#c0392b', x: 24, y: 50 },
    { id: 2, type: 'Print String', color: '#2471a3', x: 190, y: 50 },
    { id: 3, type: 'Branch', color: '#7d3c98', x: 190, y: 140 },
    { id: 4, type: 'Sequence', color: '#1a5276', x: 350, y: 80 },
  ])
  const [vars, setVars] = useState([
    { name: 'PlayerHealth', type: 'Float', value: '100.0' },
    { name: 'IsAlive', type: 'Boolean', value: 'True' },
    { name: 'Score', type: 'Integer', value: '0' },
    { name: 'SpawnLocation', type: 'Vector', value: '(0,0,0)' },
  ])
  const [newVarName, setNewVarName] = useState('')
  const [newVarType, setNewVarType] = useState('Float')
  const nodeLib = {
    'Events': ['BeginPlay','Tick','OnOverlap','OnHit','OnKeyPressed','OnDeath','Custom Event'],
    'Flow Control': ['Branch','For Loop','While Loop','Sequence','Gate','Multi Gate','Do Once'],
    'Variables': ['Get Bool','Set Bool','Get Float','Set Float','Get Int','Get Vector','Set Vector'],
    'Actions': ['Print String','Delay','Cast To','Spawn Actor','Destroy Actor','Get Player Pawn','Set Timer'],
    'Math': ['Add','Subtract','Multiply','Divide','Clamp','Lerp','Random Float','Random Int Range'],
  }
  const addNode = (type) => {
    const colors = { Events: '#c0392b', 'Flow Control': '#7d3c98', Variables: '#1e8449', Actions: '#2471a3', Math: '#784212' }
    const cat = Object.keys(nodeLib).find(k => nodeLib[k].includes(type)) || 'Actions'
    setNodes(n => [...n, { id: Date.now(), type, color: colors[cat] || '#2c3e50', x: Math.random() * 200 + 40, y: Math.random() * 120 + 40 }])
    toast('Node: ' + type)
  }

  return (
    <div>
      <PageHeader icon="🔷" title="Blueprint Editor" subtitle="Visual scripting system" />
      <div className="flex-row mb-12" style={{ flexWrap: 'wrap' }}>
        {['Compile ✓', 'Save', 'Debug', 'Zoom In', 'Zoom Out', 'Clear'].map(b => (
          <button key={b} className={`btn ${b.includes('Compile') ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => toast(b)}>{b}</button>
        ))}
      </div>

      {/* Canvas */}
      <Card className="mb-12" style={{ padding: 0 }}>
        <div className="viewport" style={{ height: 280, cursor: 'crosshair' }}>
          <span className="viewport-label">BLUEPRINT GRAPH — EVENT GRAPH</span>
          <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.08 }}>
            {[...Array(16)].map((_, i) => <line key={`v${i}`} x1={`${i * 6.25}%`} y1="0" x2={`${i * 6.25}%`} y2="100%" stroke="#88aaff" strokeWidth="0.5" />)}
            {[...Array(10)].map((_, i) => <line key={`h${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#88aaff" strokeWidth="0.5" />)}
            {/* Connections */}
            <line x1="130" y1="70" x2="190" y2="70" stroke="var(--accent)" strokeWidth="1.5" opacity="0.8" />
            <line x1="130" y1="70" x2="190" y2="155" stroke="#a855f7" strokeWidth="1.5" opacity="0.8" />
            <line x1="270" y1="155" x2="350" y2="100" stroke="#3b82f6" strokeWidth="1.5" opacity="0.8" />
          </svg>
          {nodes.map(n => (
            <div key={n.id} style={{
              position: 'absolute', left: n.x, top: n.y,
              background: n.color + 'dd', borderRadius: 6,
              padding: '8px 14px', fontSize: 11,
              color: '#fff', fontWeight: 600, whiteSpace: 'nowrap',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: `0 4px 12px ${n.color}44`,
              cursor: 'grab', userSelect: 'none',
              fontFamily: 'var(--font-condensed)', letterSpacing: 0.5
            }}>
              <div style={{ fontSize: 9, opacity: 0.6, marginBottom: 3 }}>⬤ ─────</div>
              {n.type}
              <div style={{ fontSize: 9, opacity: 0.6, marginTop: 3 }}>───── ⬤</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid-2">
        {/* Node Library */}
        <Card>
          <SectionTitle>Node Library</SectionTitle>
          {Object.entries(nodeLib).map(([cat, nodes_]) => (
            <div key={cat} className="mb-12">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--accent)', letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase' }}>{cat}</div>
              <div className="flex-col">
                {nodes_.map(n => (
                  <button key={n} className="btn btn-secondary" style={{ justifyContent: 'flex-start', textTransform: 'none', letterSpacing: 0, padding: '5px 8px' }}
                    onClick={() => addNode(n)}>＋ {n}</button>
                ))}
              </div>
            </div>
          ))}
        </Card>

        {/* Variables */}
        <Card>
          <SectionTitle>Variables</SectionTitle>
          <div className="flex-col mb-12">
            {vars.map((v, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
                background: 'var(--bg-elevated)', borderRadius: 6, border: '1px solid var(--border)'
              }}>
                <Badge color={v.type === 'Float' ? 'var(--blue)' : v.type === 'Boolean' ? 'var(--green)' : v.type === 'Vector' ? '#a855f7' : 'var(--accent)'}>
                  {v.type}
                </Badge>
                <span style={{ flex: 1, fontSize: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)' }}>{v.name}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)' }}>{v.value}</span>
              </div>
            ))}
          </div>
          <div className="flex-row mb-8">
            <input value={newVarName} onChange={e => setNewVarName(e.target.value)} placeholder="Variable naam"
              style={{ flex: 1 }} onKeyDown={e => e.key === 'Enter' && newVarName && (setVars([...vars, { name: newVarName, type: newVarType, value: '0' }]) || setNewVarName('') || toast('Variable aangemaakt!'))} />
            <select value={newVarType} onChange={e => setNewVarType(e.target.value)} style={{ background: 'var(--bg-surface)' }}>
              {['Float', 'Boolean', 'Integer', 'String', 'Vector', 'Actor', 'Object'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button className="btn btn-primary w-full" onClick={() => { if (newVarName) { setVars([...vars, { name: newVarName, type: newVarType, value: '0' }]); setNewVarName(''); toast('Variable aangemaakt!') } }}>
            + Voeg Variable Toe
          </button>
        </Card>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// MATERIAL EDITOR
// ══════════════════════════════════════════════
export function MaterialEditor({ toast }) {
  const [pbr, setPbr] = useState({ roughness: 45, metallic: 10, emissive: 0, opacity: 100, normalIntensity: 80 })
  const [color, setColor] = useState('#e85d04')
  const [preview, setPreview] = useState('sphere')
  const set = (k, v) => setPbr(p => ({ ...p, [k]: v }))
  const nodes = ['Texture Sample', 'Constant3Vector', 'Lerp', 'Multiply', 'Add', 'Fresnel', 'Normal Map', 'World Position Offset', 'Vertex Color', 'Camera Vector', 'Noise']

  return (
    <div>
      <PageHeader icon="🎨" title="Material Editor" subtitle="PBR material creation" />
      <Card className="mb-12">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <SectionTitle>Preview</SectionTitle>
          <div className="flex-row" style={{ marginLeft: 'auto' }}>
            {['sphere', 'cube', 'plane'].map(p => (
              <button key={p} className={`btn ${preview === p ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px', fontSize: 10 }} onClick={() => setPreview(p)}>{p}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150, gap: 24 }}>
          {preview === 'sphere' && (
            <div style={{
              width: 110, height: 110, borderRadius: '50%',
              background: `radial-gradient(circle at 35% 35%, ${color}, ${color}88 55%, #1a1a1a)`,
              boxShadow: `0 0 ${pbr.emissive / 2}px ${color}, 0 8px 24px #0008`,
              filter: `brightness(${0.7 + pbr.metallic / 200})`,
            }} />
          )}
          {preview === 'cube' && (
            <div style={{
              width: 90, height: 90,
              background: color,
              transform: 'perspective(300px) rotateX(20deg) rotateY(30deg)',
              boxShadow: `0 0 ${pbr.emissive / 2}px ${color}, inset -20px -20px 40px rgba(0,0,0,0.5)`,
            }} />
          )}
          {preview === 'plane' && (
            <div style={{
              width: 140, height: 80,
              background: `linear-gradient(135deg, ${color}, ${color}88)`,
              borderRadius: 6,
              transform: 'perspective(300px) rotateX(30deg)',
              boxShadow: `0 0 ${pbr.emissive / 2}px ${color}`,
            }} />
          )}
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)', marginBottom: 6 }}>BASE COLOR</div>
            <input type="color" value={color} onChange={e => setColor(e.target.value)}
              style={{ width: 60, height: 40, border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
          </div>
        </div>
      </Card>
      <div className="grid-2 mb-12">
        <Card>
          <SectionTitle>PBR Properties</SectionTitle>
          {Object.entries(pbr).map(([k, v]) => (
            <Slider key={k} label={k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1')} value={v} onChange={val => set(k, val)} />
          ))}
        </Card>
        <Card>
          <SectionTitle>Material Nodes</SectionTitle>
          <div className="flex-col">
            {nodes.map(n => (
              <button key={n} className="btn btn-secondary" style={{ justifyContent: 'flex-start', textTransform: 'none', letterSpacing: 0, fontSize: 11 }}
                onClick={() => toast('Node: ' + n)}>＋ {n}</button>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <div className="flex-row">
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => toast('Material opgeslagen!')}>💾 Opslaan</button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => toast('Material Instance aangemaakt!')}>⊕ Material Instance</button>
          <button className="btn btn-secondary" onClick={() => toast('Exporteren...')}>Export</button>
        </div>
      </Card>
    </div>
  )
}

// ══════════════════════════════════════════════
// SEQUENCER
// ══════════════════════════════════════════════
export function Sequencer({ toast }) {
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const tracks = [
    { name: '🎥 Master Camera', kfs: [0, 30, 60, 90] },
    { name: '🧍 Hero_Character', kfs: [10, 40, 70] },
    { name: '💡 LightRig_A', kfs: [0, 50, 100] },
    { name: '🔊 Music_Cinematic', kfs: [0, 100] },
    { name: '⚡ Event_CutEnd', kfs: [95] },
  ]

  return (
    <div>
      <PageHeader icon="🎬" title="Sequencer" subtitle="Cinematic timeline editor" />
      <Card className="mb-12">
        <div className="flex-row mb-16">
          <button className={`btn ${playing ? 'btn-ghost' : 'btn-primary'}`} onClick={() => { setPlaying(p => !p); toast(playing ? 'Gestopt' : 'Afspelen') }}>
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
          <button className="btn btn-secondary" onClick={() => { setPlaying(false); setTime(0) }}>⏹ Stop</button>
          <button className="btn btn-secondary" style={{ color: 'var(--red)', borderColor: 'var(--red)' }} onClick={() => toast('REC gestart!')}>⏺ Record</button>
          <input type="range" min={0} max={100} value={time} onChange={e => setTime(Number(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--accent)', minWidth: 45 }}>
            {String(Math.floor(time * 0.3)).padStart(2,'0')}:{String(Math.floor((time*0.3%1)*60)).padStart(2,'0')}
          </span>
        </div>

        {/* Ruler */}
        <div className="flex-row mb-8">
          <div style={{ width: 132 }} />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
            {[0,25,50,75,100].map(t => <span key={t} style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>{t}</span>)}
          </div>
        </div>

        {tracks.map(track => (
          <div key={track.name} className="timeline-track">
            <div className="track-label">{track.name}</div>
            <div className="track-bar">
              <div style={{ position: 'absolute', left: '3%', right: '3%', top: '30%', height: '40%', background: 'var(--accent-dim)', borderRadius: 2 }} />
              {track.kfs.map((kf, i) => (
                <div key={i} style={{
                  position: 'absolute', left: `${kf}%`, top: '10%',
                  width: 8, height: '80%', background: 'var(--accent)',
                  borderRadius: 2, transform: 'translateX(-50%)', cursor: 'pointer',
                  boxShadow: '0 0 6px var(--accent-glow)'
                }} />
              ))}
              <div style={{ position: 'absolute', left: `${time}%`, top: 0, width: 1, height: '100%', background: '#fff', opacity: 0.8 }} />
            </div>
          </div>
        ))}
      </Card>

      <div className="grid-2">
        <Card>
          <SectionTitle>Track Toevoegen</SectionTitle>
          {['Camera Track','Actor Track','Light Track','Audio Track','Event Track','Fade Track','Subtitle Track'].map(t => (
            <button key={t} className="btn btn-secondary w-full mb-8" style={{ justifyContent: 'flex-start', textTransform: 'none', letterSpacing: 0 }}
              onClick={() => toast(t + ' toegevoegd!')}>+ {t}</button>
          ))}
        </Card>
        <Card>
          <SectionTitle>Render & Export</SectionTitle>
          {['Export MP4 (4K)','Export PNG Sequence','Render High Res','Bake Camera Anim','Export voor Premiere'].map(e => (
            <button key={e} className="btn btn-secondary w-full mb-8" style={{ justifyContent: 'flex-start', textTransform: 'none', letterSpacing: 0 }}
              onClick={() => toast(e)}>🎬 {e}</button>
          ))}
          <button className="btn btn-primary w-full" onClick={() => toast('Renderen gestart!')}>🚀 Start Render</button>
        </Card>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// AI & GAMEPLAY
// ══════════════════════════════════════════════
export function AIGameplay({ toast }) {
  const [walkSpeed, setWalkSpeed] = useState(600)
  const [jumpHeight, setJumpHeight] = useState(420)
  const [gravity, setGravity] = useState(980)
  const [navMesh, setNavMesh] = useState(true)
  const [eqs, setEqs] = useState(false)
  const [bbKeys, setBbKeys] = useState([
    { name: 'TargetActor', type: 'Object' },
    { name: 'IsChasing', type: 'Bool' },
    { name: 'LastKnownPos', type: 'Vector' },
    { name: 'AttackRange', type: 'Float' },
  ])
  const inputs = [{ a: 'Jump', k: 'Space' },{ a: 'Fire', k: 'LMB' },{ a: 'Sprint', k: 'L-Shift' },{ a: 'Crouch', k: 'L-Ctrl' },{ a: 'Interact', k: 'E' },{ a: 'Aim', k: 'RMB' }]

  return (
    <div>
      <PageHeader icon="🤖" title="AI & Gameplay" subtitle="Behavior trees, navigation & game systems" />
      <div className="grid-2 mb-12">
        <Card>
          <SectionTitle>Behavior Tree</SectionTitle>
          <div style={{ background: 'var(--bg-base)', borderRadius: 8, padding: 14, marginBottom: 10, minHeight: 130 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <div style={{ background: '#7d3c98', borderRadius: 6, padding: '5px 16px', color: '#fff', fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>ROOT</div>
            </div>
            <svg width="100%" height="20" style={{ overflow: 'visible' }}>
              <line x1="50%" y1="0" x2="20%" y2="20" stroke="var(--border-bright)" strokeWidth="1" />
              <line x1="50%" y1="0" x2="50%" y2="20" stroke="var(--border-bright)" strokeWidth="1" />
              <line x1="50%" y1="0" x2="80%" y2="20" stroke="var(--border-bright)" strokeWidth="1" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 4 }}>
              {['Patrol','Chase','Attack'].map(n => (
                <div key={n} style={{ background: '#1a5276', borderRadius: 5, padding: '5px 12px', color: '#ddd', fontSize: 11, fontFamily: 'var(--font-condensed)', letterSpacing: 1 }}>{n}</div>
              ))}
            </div>
          </div>
          {['Selector','Sequence','Task Node','Decorator','Service','Patrol','Wait','Attack'].map(n => (
            <button key={n} className="btn btn-secondary mb-8" style={{ fontSize: 11, padding: '4px 8px', textTransform: 'none', letterSpacing: 0 }}
              onClick={() => toast('BT: ' + n)}>+ {n}</button>
          ))}
        </Card>
        <Card>
          <SectionTitle>Blackboard Keys</SectionTitle>
          <div className="flex-col mb-12">
            {bbKeys.map((k, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', background: 'var(--bg-elevated)', borderRadius: 6, border: '1px solid var(--border)' }}>
                <Badge color={k.type === 'Bool' ? 'var(--green)' : k.type === 'Vector' ? 'var(--blue)' : k.type === 'Float' ? 'var(--accent)' : '#a855f7'}>{k.type}</Badge>
                <span style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)' }}>{k.name}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary w-full" onClick={() => { setBbKeys([...bbKeys, { name: 'NewKey_' + bbKeys.length, type: 'Bool' }]); toast('BB Key aangemaakt!') }}>
            + Voeg Key Toe
          </button>
        </Card>
      </div>

      <div className="grid-2 mb-12">
        <Card>
          <SectionTitle>Character Movement</SectionTitle>
          <Slider label="Walk Speed (cm/s)" value={walkSpeed} onChange={setWalkSpeed} min={100} max={2000} />
          <Slider label="Jump Z Velocity" value={jumpHeight} onChange={setJumpHeight} min={100} max={2000} />
          <Slider label="Gravity Scale" value={gravity} onChange={setGravity} min={100} max={2000} />
          <Toggle value={navMesh} onChange={setNavMesh} label="NavMesh Bounds Volume" />
          <Toggle value={eqs} onChange={setEqs} label="EQS (Environment Query)" />
        </Card>
        <Card>
          <SectionTitle>Input Bindings</SectionTitle>
          <div className="flex-col">
            {inputs.map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg-elevated)', borderRadius: 6, border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-condensed)' }}>{b.a}</span>
                <Badge color="var(--accent)">{b.k}</Badge>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost w-full" style={{ marginTop: 8 }} onClick={() => toast('Input binding toegevoegd!')}>+ Binding Toevoegen</button>
        </Card>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// NIAGARA VFX
// ══════════════════════════════════════════════
export function NiagaraVFX({ toast }) {
  const [emitters, setEmitters] = useState([
    { id: 1, name: 'Fire_Core', type: 'Sprite', active: true, color: '#f97316' },
    { id: 2, name: 'Smoke_Trail', type: 'Ribbon', active: true, color: '#888' },
    { id: 3, name: 'Ember_Sparks', type: 'Mesh', active: false, color: '#facc15' },
  ])
  const [spawn, setSpawn] = useState(80)
  const [life, setLife] = useState(3)
  const [vel, setVel] = useState(250)
  const [size, setSize] = useState(15)
  const [tick, setTick] = useState(0)
  const presets = ['🔥 Fire','💨 Smoke','💧 Water','💥 Explosion','✨ Magic Aura','🌧 Rain','❄️ Snow','⚡ Lightning','🌊 Ocean Spray','🌀 Tornado']

  // Animate preview
  useState(() => {
    const i = setInterval(() => setTick(t => t + 1), 150)
    return () => clearInterval(i)
  })

  return (
    <div>
      <PageHeader icon="✨" title="Niagara VFX" subtitle="Particle systems & visual effects" />
      <div className="grid-2 mb-12">
        <Card>
          <SectionTitle>Emitters</SectionTitle>
          <div className="flex-col mb-12">
            {emitters.map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--bg-elevated)', borderRadius: 6, border: `1px solid ${e.active ? e.color + '44' : 'var(--border)'}` }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.active ? 'var(--green)' : 'var(--red)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)' }}>{e.name}</span>
                <Badge color={e.color}>{e.type}</Badge>
                <button onClick={() => setEmitters(emitters.map(x => x.id === e.id ? { ...x, active: !x.active } : x))}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>
                  {e.active ? '⏸' : '▶'}
                </button>
              </div>
            ))}
          </div>
          {['Sprite', 'Mesh', 'Ribbon', 'Beam'].map(t => (
            <button key={t} className="btn btn-secondary w-full mb-8" style={{ textTransform: 'none', letterSpacing: 0, justifyContent: 'flex-start' }}
              onClick={() => { setEmitters(e => [...e, { id: Date.now(), name: t + '_Emitter', type: t, active: true, color: 'var(--accent)' }]); toast('Emitter: ' + t) }}>
              + {t} Emitter
            </button>
          ))}
        </Card>
        <Card>
          <SectionTitle>Preview</SectionTitle>
          <div style={{ height: 180, background: 'var(--bg-base)', borderRadius: 8, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            {[...Array(25)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${40 + Math.sin((i + tick * 0.3) * 0.7) * 18}%`,
                bottom: `${((i * 7 + tick * 2) % 100)}%`,
                width: (size / 25 * 3 + 2),
                height: (size / 25 * 3 + 2),
                borderRadius: '50%',
                background: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#facc15' : '#dc2626',
                opacity: Math.max(0.1, 1 - ((i * 7 + tick * 2) % 100) / 100),
                filter: 'blur(0.5px)',
              }} />
            ))}
            <span style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 9, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>LIVE PREVIEW</span>
          </div>
        </Card>
      </div>

      <Card className="mb-12">
        <SectionTitle>Emitter Modules</SectionTitle>
        <div className="grid-2">
          <Slider label="Spawn Rate (/s)" value={spawn} onChange={setSpawn} min={1} max={500} />
          <Slider label="Lifetime (s)" value={life} onChange={setLife} min={1} max={10} />
          <Slider label="Initial Velocity" value={vel} onChange={setVel} min={0} max={1000} />
          <Slider label="Particle Size" value={size} onChange={setSize} min={1} max={100} />
        </div>
      </Card>

      <Card>
        <SectionTitle>VFX Presets</SectionTitle>
        <div className="grid-4">
          {presets.map(p => (
            <button key={p} className="btn btn-secondary" style={{ padding: '10px 6px', textTransform: 'none', letterSpacing: 0, fontSize: 11, flexDirection: 'column', height: 56 }}
              onClick={() => toast('Preset: ' + p)}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              {p}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ══════════════════════════════════════════════
// AUDIO
// ══════════════════════════════════════════════
export function AudioSystem({ toast }) {
  const [vol, setVol] = useState(80)
  const [pitch, setPitch] = useState(100)
  const [atten, setAtten] = useState(800)
  const [playing, setPlaying] = useState(null)
  const sounds = [
    { name: 'Orchestral_Main_Theme.wav', type: 'Music', dur: '4:12', color: '#9333ea' },
    { name: 'Footstep_Grass_01.wav', type: 'SFX', dur: '0:01', color: 'var(--accent)' },
    { name: 'Explosion_Heavy.wav', type: 'SFX', dur: '0:04', color: 'var(--red)' },
    { name: 'Forest_Ambience_Loop.wav', type: 'Ambient', dur: '5:00', color: 'var(--green)' },
    { name: 'UI_Button_Click.wav', type: 'UI', dur: '0:00', color: 'var(--blue)' },
    { name: 'Wind_Cave_Reverb.wav', type: 'Ambient', dur: '3:20', color: 'var(--green)' },
  ]
  const cueNodes = ['Sound Wave','Random','Modulator','Mixer','Delay','Concat','Loop','Switch on Int','Envelope']

  return (
    <div>
      <PageHeader icon="🔊" title="Audio Systeem" subtitle="Sound design & MetaSounds" />
      <Card className="mb-12">
        <SectionTitle>Sound Library</SectionTitle>
        <div className="flex-col mb-12">
          {sounds.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <button onClick={() => setPlaying(playing === i ? null : i)} style={{
                width: 28, height: 28, borderRadius: '50%',
                background: playing === i ? 'var(--green)' : 'var(--accent)',
                border: 'none', color: '#fff', cursor: 'pointer', fontSize: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>{playing === i ? '⏹' : '▶'}</button>
              <span style={{ flex: 1, fontSize: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)' }}>{s.name}</span>
              <Badge color={s.color}>{s.type}</Badge>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-display)', minWidth: 32 }}>{s.dur}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" onClick={() => toast('Importeren...')}>📁 Audio Importeren</button>
      </Card>

      <div className="grid-2">
        <Card>
          <SectionTitle>3D Audio Instellingen</SectionTitle>
          <Slider label="Master Volume" value={vol} onChange={setVol} />
          <Slider label="Pitch Shift" value={pitch} onChange={setPitch} min={50} max={200} />
          <Slider label="Attenuation Distance" value={atten} onChange={setAtten} min={100} max={10000} />
          {['Loop','Spatialized 3D','Reverb','Doppler Effect','Occlusion'].map(o => (
            <Toggle key={o} value={false} onChange={() => toast(o)} label={o} />
          ))}
        </Card>
        <Card>
          <SectionTitle>Sound Cue Editor</SectionTitle>
          <div className="flex-col">
            {cueNodes.map(n => (
              <button key={n} className="btn btn-secondary" style={{ justifyContent: 'flex-start', textTransform: 'none', letterSpacing: 0 }}
                onClick={() => toast('Cue Node: ' + n)}>+ {n}</button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// WORLD BUILDING
// ══════════════════════════════════════════════
export function WorldBuilding({ toast }) {
  const [tod, setTod] = useState(14)
  const [clouds, setClouds] = useState(35)
  const [fog, setFog] = useState(15)
  const [wave, setWave] = useState(25)
  const [pcgDensity, setPcgDensity] = useState(55)
  const [landscapeTool, setLandscapeTool] = useState('raise')
  const [lumen, setLumen] = useState(true)
  const [volumetric, setVolumetric] = useState(true)

  const skyColor = tod < 5 || tod > 21 ? '#02020d' : tod < 7 ? '#c2410c' : tod < 9 ? '#1d4ed8' : tod > 19 ? '#7c2d12' : '#2563eb'
  const sunX = (tod / 24) * 80 + 10
  const lsTools = ['Raise','Lower','Smooth','Flatten','Erode','Paint Terrain']

  return (
    <div>
      <PageHeader icon="🌍" title="World Building" subtitle="Landscape, sky & procedural generation" />

      {/* Sky Preview */}
      <Card className="mb-12" style={{ padding: 0 }}>
        <div style={{
          height: 120, borderRadius: 10, position: 'relative', overflow: 'hidden',
          background: `linear-gradient(to bottom, ${skyColor}, ${skyColor}aa 60%, #1a2e1a 80%, #0f1f0f)`,
          transition: 'background 0.5s'
        }}>
          <div style={{ position: 'absolute', top: 18, left: `${sunX}%`, transition: 'left 0.3s', fontSize: 26 }}>
            {tod < 5 || tod > 21 ? '🌙' : tod < 7 || tod > 19 ? '🌅' : '☀️'}
          </div>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute', top: 10 + i * 10,
              left: `${15 + i * 14}%`, width: 55, height: 16,
              background: `rgba(255,255,255,${clouds / 500})`,
              borderRadius: 8, filter: 'blur(4px)'
            }} />
          ))}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
            background: 'linear-gradient(transparent, #0f1f0f)',
            display: 'flex', alignItems: 'flex-end', padding: '0 12px 6px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--accent)', letterSpacing: 2 }}>
              {tod}:00 — {tod < 6 ? 'NACHT' : tod < 12 ? 'OCHTEND' : tod < 18 ? 'MIDDAG' : tod < 21 ? 'AVOND' : 'NACHT'}
            </span>
          </div>
        </div>
      </Card>

      <div className="grid-2 mb-12">
        <Card>
          <SectionTitle>Sky & Atmosfeer</SectionTitle>
          <Slider label="Tijd van Dag (uur)" value={tod} onChange={setTod} min={0} max={23} />
          <Slider label="Wolkendichtheid %" value={clouds} onChange={setClouds} />
          <Slider label="Mist Dichtheid" value={fog} onChange={setFog} />
          <Toggle value={lumen} onChange={setLumen} label="Lumen GI ingeschakeld" />
          <Toggle value={volumetric} onChange={setVolumetric} label="Volumetrische Wolken" />
        </Card>
        <Card>
          <SectionTitle>Water Systeem</SectionTitle>
          {['Ocean','River','Lake','Waterfall','Swamp'].map(w => (
            <button key={w} className="btn btn-secondary w-full mb-8" style={{ justifyContent: 'flex-start', textTransform: 'none', letterSpacing: 0 }}
              onClick={() => toast(w + ' toegevoegd!')}>💧 {w}</button>
          ))}
          <Slider label="Golfhoogte" value={wave} onChange={setWave} />
        </Card>
      </div>

      <Card className="mb-12">
        <SectionTitle>Landscape Tools</SectionTitle>
        <div className="flex-row mb-12" style={{ flexWrap: 'wrap' }}>
          {lsTools.map(t => (
            <button key={t} className={`btn ${landscapeTool === t.toLowerCase().split(' ')[0] ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setLandscapeTool(t.toLowerCase().split(' ')[0])}>{t}</button>
          ))}
        </div>
        <div style={{ background: 'var(--bg-base)', height: 80, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-bright)' }}>
          <span style={{ fontFamily: 'var(--font-condensed)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2 }}>LANDSCAPE CANVAS — TOOL: {landscapeTool.toUpperCase()}</span>
        </div>
      </Card>

      <Card>
        <SectionTitle>Procedurele Content Generatie (PCG)</SectionTitle>
        <Slider label="Vegetatiedichtheid %" value={pcgDensity} onChange={setPcgDensity} />
        <div className="flex-row" style={{ flexWrap: 'wrap', gap: 6 }}>
          {['🌲 Bomen','🪨 Rotsen','🌿 Gras','🌾 Struiken','🌸 Bloemen','🍄 Paddenstoelen','🌵 Cactus'].map(v => (
            <button key={v} className="btn btn-secondary" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11 }}
              onClick={() => toast(v + ' PCG actief!')}>+ {v}</button>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ══════════════════════════════════════════════
// ASSET MANAGER
// ══════════════════════════════════════════════
export function AssetManager({ toast }) {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [favs, setFavs] = useState([])
  const filters = ['All','Meshes','Textures','Materials','Blueprints','Audio','VFX','Animations']
  const assets = [
    { name: 'SM_Rock_Cluster_01', type: 'Meshes', size: '2.4 MB', icon: '⬜' },
    { name: 'T_Bark_Diffuse_D', type: 'Textures', size: '8.1 MB', icon: '🟫' },
    { name: 'M_Water_Dynamic', type: 'Materials', size: '0.4 MB', icon: '💧' },
    { name: 'BP_Enemy_Patrol', type: 'Blueprints', size: '1.1 MB', icon: '🔷' },
    { name: 'SFX_Wind_Loop', type: 'Audio', size: '0.9 MB', icon: '🔊' },
    { name: 'NS_FireTorch', type: 'VFX', size: '0.6 MB', icon: '✨' },
    { name: 'SM_Tree_Pine_Large', type: 'Meshes', size: '6.2 MB', icon: '🌲' },
    { name: 'T_Sky_HDRI_Sunset', type: 'Textures', size: '18 MB', icon: '🌅' },
    { name: 'M_Stone_PBR_Wet', type: 'Materials', size: '0.5 MB', icon: '🔮' },
    { name: 'BP_FPS_Character', type: 'Blueprints', size: '2.2 MB', icon: '🧍' },
    { name: 'ANM_Walk_Cycle', type: 'Animations', size: '0.3 MB', icon: '🎭' },
    { name: 'ANM_Jump_Loop', type: 'Animations', size: '0.2 MB', icon: '🎭' },
  ]
  const filtered = assets.filter(a => (filter === 'All' || a.type === filter) && a.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <PageHeader icon="📦" title="Asset Manager" subtitle="Asset browser, import & organization" />
      <div className="flex-row mb-12">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Zoek assets..." style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={() => toast('Importeren...')}>📁 Import</button>
        <button className="btn btn-secondary" onClick={() => toast('Nieuw aanmaken...')}>＋ Nieuw</button>
      </div>
      <div className="flex-row mb-16" style={{ flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '5px 12px', fontSize: 11 }} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="grid-2">
        {filtered.map((a, i) => (
          <Card key={i} hoverable onClick={() => toast('Geopend: ' + a.name)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{a.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <Badge color="var(--blue)">{a.type}</Badge>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)' }}>{a.size}</span>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); setFavs(favs.includes(a.name) ? favs.filter(f => f !== a.name) : [...favs, a.name]) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: favs.includes(a.name) ? 'var(--accent)' : 'var(--text-muted)' }}>
                {favs.includes(a.name) ? '⭐' : '☆'}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// UI BUILDER
// ══════════════════════════════════════════════
export function UIBuilder({ toast }) {
  const [widgets, setWidgets] = useState([
    { id: 1, type: 'Button', label: 'Play Game', x: 110, y: 100, w: 120, h: 38, color: '#f97316' },
    { id: 2, type: 'Text', label: 'Score: 0', x: 16, y: 16, w: 90, h: 22, color: '#fff' },
    { id: 3, type: 'ProgressBar', label: 'HP', x: 16, y: 44, w: 180, h: 16, color: '#22c55e' },
    { id: 4, type: 'Image', label: '🗡 Icon', x: 16, y: 70, w: 40, h: 40, color: '#facc15' },
  ])
  const [pSize, setPSize] = useState('desktop')
  const wTypes = ['Button','Text Block','Image','Progress Bar','Slider','Checkbox','Border','Input Field','List View','Canvas Panel']
  const canvasW = pSize === 'mobile' ? 210 : pSize === 'tablet' ? 280 : 350

  const addWidget = (type) => {
    setWidgets(w => [...w, { id: Date.now(), type, label: type, color: 'var(--blue)', x: Math.random() * 100 + 40, y: Math.random() * 80 + 40, w: 100, h: 30 }])
    toast('Widget: ' + type)
  }

  return (
    <div>
      <PageHeader icon="🖥" title="UI Builder" subtitle="UMG widget designer" />
      <div className="flex-row mb-12">
        {['mobile','tablet','desktop'].map(s => (
          <button key={s} className={`btn ${pSize === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPSize(s)}>
            {s === 'mobile' ? '📱' : s === 'tablet' ? '💻' : '🖥'} {s}
          </button>
        ))}
        <button className="btn btn-ghost" style={{ marginLeft: 'auto' }} onClick={() => toast('Blueprint gekoppeld!')}>🔗 Koppel Blueprint</button>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <Card style={{ minWidth: 140, flex: '0 0 140px' }}>
          <SectionTitle>Widgets</SectionTitle>
          <div className="flex-col">
            {wTypes.map(w => (
              <button key={w} className="btn btn-secondary" style={{ justifyContent: 'flex-start', textTransform: 'none', letterSpacing: 0, fontSize: 11 }}
                onClick={() => addWidget(w)}>+ {w}</button>
            ))}
          </div>
        </Card>

        <div style={{ flex: 1 }}>
          <Card style={{ padding: 0, marginBottom: 12 }}>
            <div style={{ width: canvasW, margin: '0 auto', height: 240, background: '#111', position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-bright)', transition: 'width 0.3s' }}>
              {widgets.map(w => (
                <div key={w.id} onClick={() => toast('Geselecteerd: ' + w.label)} style={{
                  position: 'absolute', left: Math.min(w.x, canvasW - w.w - 4), top: w.y,
                  width: w.w, height: w.h, borderRadius: w.type === 'ProgressBar' ? 3 : 6,
                  background: w.type === 'ProgressBar' ? 'transparent' : w.color + '25',
                  border: `1px solid ${w.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: w.type === 'ProgressBar' ? 'flex-start' : 'center',
                  color: w.color, fontSize: 11, cursor: 'pointer', userSelect: 'none',
                  fontFamily: 'var(--font-condensed)', overflow: 'hidden'
                }}>
                  {w.type === 'ProgressBar'
                    ? <div style={{ width: '65%', height: '100%', background: w.color, borderRadius: 3, transition: 'width 0.3s' }} />
                    : w.label}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle>Hierarchy</SectionTitle>
            <div className="flex-col">
              {widgets.map((w, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 8px', background: 'var(--bg-elevated)', borderRadius: 5, border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)' }}>⬜ {w.label}</span>
                  <div className="flex-row">
                    <Badge>{w.type}</Badge>
                    <button onClick={() => { setWidgets(widgets.filter(x => x.id !== w.id)); toast('Verwijderd') }}
                      style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// PROJECT SETTINGS
// ══════════════════════════════════════════════
export function ProjectSettings({ toast }) {
  const [s, setS] = useState({
    name: 'My UE5 Game', version: '1.0.0', company: 'My Studio',
    quality: 'Epic', fps: 60,
    lumen: true, nanite: true, raytracing: false, vsync: true,
    bloom: true, motionblur: false, dof: true, vignette: true, ssr: true,
    bloomInt: 50, temp: 6500, contrast: 50, saturation: 100, exposure: 0,
    buildConfig: 'Development',
  })
  const set = (k, v) => setS(prev => ({ ...prev, [k]: v }))
  const platforms = [
    { id: 'win', label: 'Windows', icon: '🖥' },
    { id: 'android', label: 'Android', icon: '📱' },
    { id: 'ios', label: 'iOS', icon: '🍎' },
    { id: 'ps5', label: 'PlayStation 5', icon: '🎮' },
    { id: 'xbox', label: 'Xbox Series X', icon: '🎮' },
    { id: 'switch', label: 'Nintendo Switch', icon: '🕹' },
  ]
  const [targets, setTargets] = useState(['win'])
  const toggleTarget = (id) => setTargets(t => t.includes(id) ? t.filter(x => x !== id) : [...t, id])

  return (
    <div>
      <PageHeader icon="⚙️" title="Project Settings" subtitle="Engine configuration & packaging" />

      <Card className="mb-12">
        <SectionTitle>Algemeen</SectionTitle>
        <div className="grid-2 mb-12">
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)', letterSpacing: 1, marginBottom: 4 }}>PROJECTNAAM</div>
            <input value={s.name} onChange={e => set('name', e.target.value)} style={{ width: '100%' }} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)', letterSpacing: 1, marginBottom: 4 }}>STUDIO NAAM</div>
            <input value={s.company} onChange={e => set('company', e.target.value)} style={{ width: '100%' }} />
          </div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)', letterSpacing: 1, marginBottom: 8 }}>RENDERING KWALITEIT</div>
          <div className="flex-row" style={{ flexWrap: 'wrap' }}>
            {['Low','Medium','High','Epic','Cinematic'].map(q => (
              <button key={q} className={`btn ${s.quality === q ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: 11, padding: '5px 12px' }}
                onClick={() => set('quality', q)}>{q}</button>
            ))}
          </div>
        </div>
        <Slider label="Doel FPS" value={s.fps} onChange={v => set('fps', v)} min={30} max={240} />
      </Card>

      <Card className="mb-12">
        <SectionTitle>Rendering Technologieën</SectionTitle>
        <div className="grid-2">
          <Toggle value={s.lumen} onChange={v => set('lumen', v)} label="Lumen Global Illumination" />
          <Toggle value={s.nanite} onChange={v => set('nanite', v)} label="Nanite Geometry" />
          <Toggle value={s.raytracing} onChange={v => set('raytracing', v)} label="Ray Tracing (RTX)" />
          <Toggle value={s.vsync} onChange={v => set('vsync', v)} label="VSync" />
          <Toggle value={s.ssr} onChange={v => set('ssr', v)} label="Screen Space Reflections" />
        </div>
      </Card>

      <Card className="mb-12">
        <SectionTitle>Post Process Effects</SectionTitle>
        <div className="grid-2 mb-12">
          <Toggle value={s.bloom} onChange={v => set('bloom', v)} label="Bloom" />
          <Toggle value={s.motionblur} onChange={v => set('motionblur', v)} label="Motion Blur" />
          <Toggle value={s.dof} onChange={v => set('dof', v)} label="Depth of Field" />
          <Toggle value={s.vignette} onChange={v => set('vignette', v)} label="Vignette" />
        </div>
        <div className="grid-2">
          <Slider label="Bloom Intensiteit" value={s.bloomInt} onChange={v => set('bloomInt', v)} />
          <Slider label="Kleurtemperatuur K" value={s.temp} onChange={v => set('temp', v)} min={2000} max={12000} />
          <Slider label="Contrast" value={s.contrast} onChange={v => set('contrast', v)} />
          <Slider label="Saturatie" value={s.saturation} onChange={v => set('saturation', v)} />
          <Slider label="Belichting EV" value={s.exposure} onChange={v => set('exposure', v)} min={-5} max={5} />
        </div>
      </Card>

      <Card className="mb-12">
        <SectionTitle>Platform Targets</SectionTitle>
        <div className="grid-2">
          {platforms.map(p => (
            <div key={p.id} onClick={() => toggleTarget(p.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
              background: targets.includes(p.id) ? 'var(--accent-dim)' : 'var(--bg-elevated)',
              border: `1px solid ${targets.includes(p.id) ? 'var(--accent)' : 'var(--border)'}`,
              transition: 'all 0.15s'
            }}>
              <span style={{ fontSize: 18 }}>{p.icon}</span>
              <span style={{ fontFamily: 'var(--font-condensed)', fontSize: 12, color: targets.includes(p.id) ? 'var(--accent)' : 'var(--text-secondary)' }}>{p.label}</span>
              {targets.includes(p.id) && <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: 12 }}>✓</span>}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>Build & Packaging</SectionTitle>
        <div className="flex-row mb-16">
          {['Debug','Development','Shipping'].map(b => (
            <button key={b} className={`btn ${s.buildConfig === b ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => set('buildConfig', b)}>{b}</button>
          ))}
        </div>
        <div className="flex-row">
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => toast('Build gestart: ' + s.buildConfig + ' voor ' + targets.length + ' platform(s)')}>
            🚀 Build & Package
          </button>
          <button className="btn btn-secondary" onClick={() => toast('Instellingen opgeslagen!')}>💾 Opslaan</button>
        </div>
      </Card>
    </div>
  )
}

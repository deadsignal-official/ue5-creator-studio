import { useState } from 'react'
import AIChat from './components/AIChat.jsx'

// ─── SHARED UI ────────────────────────────────
function Card({ children, style, className = '', hov, onClick }) {
  return <div className={`card ${hov ? 'hov' : ''} ${className}`} style={style} onClick={onClick}>{children}</div>
}
function ST({ children }) { return <div className="stitle">{children}</div> }
function Badge({ children, color = 'var(--accent)' }) {
  return <span className="bdg" style={{ color, borderColor: color, background: color + '18' }}>{children}</span>
}
function Tog({ val, set, label }) {
  return (
    <div className="tgl-wrap">
      <div className="tgl-track" style={{ background: val ? 'var(--accent)' : 'var(--elevated)' }} onClick={() => set(!val)}>
        <div className="tgl-thumb" style={{ left: val ? 20 : 3 }} />
      </div>
      <span className="tgl-lbl">{label}</span>
    </div>
  )
}
function Sldr({ label, val, set, min = 0, max = 100 }) {
  return (
    <div className="sldr">
      <div className="sldr-row"><span className="sldr-lbl">{label}</span><span className="sldr-val">{val}</span></div>
      <input type="range" min={min} max={max} value={val} onChange={e => set(+e.target.value)} />
    </div>
  )
}
function PH({ icon, title, sub }) {
  return <div className="ph"><div className="ph-title">{icon && <span style={{ marginRight: 8 }}>{icon}</span>}{title}</div>{sub && <div className="ph-sub">{sub}</div>}</div>
}
function BtnRow({ children }) { return <div className="row" style={{ marginBottom: 12 }}>{children}</div> }

// ─── DASHBOARD ────────────────────────────────
function Dashboard({ setPage, toast }) {
  const tpls = [
    { n: 'First Person Shooter', i: '🔫', d: 'FPS met weapon systeem', p: 'blueprint' },
    { n: 'Third Person', i: '🧍', d: 'Camera & movement setup', p: 'ai' },
    { n: 'Open World', i: '🌍', d: 'World Partition & PCG', p: 'world' },
    { n: 'Puzzle Game', i: '🧩', d: 'Physics interaction', p: 'blueprint' },
    { n: 'Racing Game', i: '🏎', d: 'Vehicle physics', p: 'ai' },
    { n: 'Horror / Survival', i: '👻', d: 'Atmosfeer & AI tension', p: 'level' },
  ]
  const recent = ['MyFPS_Project', 'OpenWorld_v3', 'PuzzleGame_Final', 'HorrorDemo']
  const stats = [['24','Assets'],['6','Levels'],['11','Blueprints'],['5','VFX'],['13','Materials'],['9','Audio']]
  return (
    <div>
      <div style={{ marginBottom: 26 }}>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 10, color: 'var(--accent)', letterSpacing: 4, marginBottom: 5 }}>WELCOME TO</div>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 24, fontWeight: 900, color: 'var(--t1)', letterSpacing: 2, lineHeight: 1.1 }}>
          UE5 CREATOR<br /><span style={{ color: 'var(--accent)' }}>STUDIO</span>
        </div>
        <div style={{ fontFamily: 'var(--fc)', fontSize: 11, color: 'var(--t3)', letterSpacing: 3, marginTop: 5 }}>UNREAL ENGINE 5.7.4 COMPANION APP</div>
      </div>
      <div className="g3 mb16">
        {stats.map(([n, l]) => (
          <div key={l} className="stat"><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
        ))}
      </div>
      <ST>Quick Start Templates</ST>
      <div className="g2 mb20">
        {tpls.map(t => (
          <Card key={t.n} hov onClick={() => { toast('Template: ' + t.n); setPage(t.p) }}>
            <div style={{ fontSize: 24, marginBottom: 7 }}>{t.i}</div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: 10, color: 'var(--t1)', letterSpacing: 1 }}>{t.n}</div>
            <div style={{ fontFamily: 'var(--fc)', fontSize: 11, color: 'var(--t3)', marginTop: 3 }}>{t.d}</div>
          </Card>
        ))}
      </div>
      <ST>Recente Projecten</ST>
      <div className="col">
        {recent.map(p => (
          <div key={p} onClick={() => toast('Geopend: ' + p)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', transition: 'border-color .12s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <span style={{ fontFamily: 'var(--fc)', fontSize: 13, color: 'var(--t2)' }}>📁 {p}</span>
            <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--fc)', letterSpacing: 1 }}>VANDAAG</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── LEVEL EDITOR ─────────────────────────────
function LevelEditor({ toast }) {
  const [actors, setActors] = useState([
    { id: 1, n: 'DirectionalLight', t: 'Light', v: true, x: 90, y: 55 },
    { id: 2, n: 'SM_LandscapeProxy', t: 'Mesh', v: true, x: 200, y: 130 },
    { id: 3, n: 'PlayerStart', t: 'Actor', v: true, x: 55, y: 170 },
    { id: 4, n: 'PostProcessVolume', t: 'Volume', v: true, x: 260, y: 70 },
  ])
  const [sel, setSel] = useState(null)
  const [tool, setTool] = useState('select')
  const [tx, setTx] = useState({ px:0,py:0,pz:0,rx:0,ry:0,rz:0,sx:1,sy:1,sz:1 })
  const tools = ['Select','Move','Rotate','Scale','Snap']
  const addTypes = ['Static Mesh','Point Light','Spot Light','Sky Light','Camera','Trigger Box','NavMesh Bounds','Player Start','Sky Sphere','Fog Volume']
  const add = (type) => { setActors(a => [...a,{id:Date.now(),n:type.replace(/ /g,'_')+'_'+a.length,t:type.split(' ')[0],v:true,x:Math.random()*230+20,y:Math.random()*150+20}]); toast('Actor: '+type) }
  return (
    <div>
      <PH icon="🗺" title="Level Editor" sub="World composition & actor placement" />
      <BtnRow>{tools.map(t=><button key={t} className={`btn ${tool===t.toLowerCase()?'btn-p':'btn-s'}`} onClick={()=>setTool(t.toLowerCase())}>{t}</button>)}</BtnRow>
      <Card style={{padding:0,marginBottom:12}}>
        <div className="vp" style={{height:260}}>
          <span className="vp-lbl">PERSPECTIVE · LIT · UE5.7.4</span>
          <svg width="100%" height="100%" style={{position:'absolute',opacity:.1}}>
            {[...Array(12)].map((_,i)=><line key={'v'+i} x1={`${i*8.33}%`} y1="0" x2={`${i*8.33}%`} y2="100%" stroke="#4466ff" strokeWidth="0.5"/>)}
            {[...Array(8)].map((_,i)=><line key={'h'+i} x1="0" y1={`${i*12.5}%`} x2="100%" y2={`${i*12.5}%`} stroke="#4466ff" strokeWidth="0.5"/>)}
          </svg>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:60,background:'linear-gradient(transparent,#080a04)'}}/>
          {actors.filter(a=>a.v).map(a=>(
            <div key={a.id} onClick={()=>setSel(a.id)} style={{
              position:'absolute',left:a.x,top:a.y,
              background:sel===a.id?'var(--accent)':'var(--elevated)',
              border:`1px solid ${sel===a.id?'var(--accent)':'var(--border2)'}`,
              borderRadius:4,padding:'3px 8px',fontSize:11,
              color:sel===a.id?'#fff':'var(--t2)',cursor:'pointer',
              whiteSpace:'nowrap',userSelect:'none',fontFamily:'var(--fc)',
              boxShadow:sel===a.id?'0 0 10px var(--aglow)':'none',transition:'all .12s'
            }}>{a.t==='Light'?'💡':a.t==='Camera'?'📷':a.t==='Volume'?'🔷':'⬜'} {a.n}</div>
          ))}
        </div>
      </Card>
      <div className="g2 mb12">
        <Card><ST>Actor Plaatsen</ST><div className="col">{addTypes.map(t=><button key={t} className="btn btn-s w100" style={{justifyContent:'flex-start',textTransform:'none',letterSpacing:0}} onClick={()=>add(t)}>+ {t}</button>)}</div></Card>
        <Card><ST>Actors in Scene</ST>{actors.map(a=>(
          <div key={a.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--border)'}}>
            <span style={{color:sel===a.id?'var(--accent)':'var(--t2)',fontSize:12,cursor:'pointer',fontFamily:'var(--fc)'}} onClick={()=>setSel(a.id)}>{a.n}</span>
            <div style={{display:'flex',gap:6}}>
              <button onClick={()=>setActors(actors.map(x=>x.id===a.id?{...x,v:!x.v}:x))} style={{background:'none',border:'none',color:a.v?'var(--accent)':'var(--t3)',cursor:'pointer',fontSize:13}}>{a.v?'👁':'🚫'}</button>
              <button onClick={()=>{setActors(actors.filter(x=>x.id!==a.id));toast('Verwijderd')}} style={{background:'none',border:'none',color:'var(--red)',cursor:'pointer',fontSize:13}}>✕</button>
            </div>
          </div>
        ))}</Card>
      </div>
      <Card>
        <ST>Transform Controls</ST>
        <div className="g3 mb12">
          {[['px','POS X','var(--red)'],['py','POS Y','var(--green)'],['pz','POS Z','var(--blue)'],['rx','ROT X','var(--t2)'],['ry','ROT Y','var(--t2)'],['rz','ROT Z','var(--t2)'],['sx','SCL X','#fb923c'],['sy','SCL Y','#fb923c'],['sz','SCL Z','#fb923c']].map(([k,l,c])=>(
            <div key={k}><div style={{color:c,fontSize:10,fontFamily:'var(--fc)',letterSpacing:1,marginBottom:4}}>{l}</div><input type="number" value={tx[k]} onChange={e=>setTx({...tx,[k]:e.target.value})} /></div>
          ))}
        </div>
        <button className="btn btn-p w100" onClick={()=>toast('Transform opgeslagen!')}>Opslaan</button>
      </Card>
    </div>
  )
}

// ─── BLUEPRINT EDITOR ─────────────────────────
function BlueprintEditor({ toast }) {
  const [nodes, setNodes] = useState([
    {id:1,t:'Event BeginPlay',c:'#c0392b',x:20,y:45},{id:2,t:'Print String',c:'#2471a3',x:190,y:45},
    {id:3,t:'Branch',c:'#7d3c98',x:190,y:140},{id:4,t:'Sequence',c:'#1a5276',x:340,y:70},
  ])
  const [vars, setVars] = useState([
    {n:'PlayerHealth',t:'Float',v:'100.0'},{n:'IsAlive',t:'Boolean',v:'True'},{n:'Score',t:'Integer',v:'0'}
  ])
  const [vname,setVname]=useState('');const [vtype,setVtype]=useState('Float')
  const lib = {
    'Events':['BeginPlay','Tick','OnOverlap','OnHit','OnKeyPressed','Custom Event'],
    'Flow':['Branch','For Loop','While Loop','Sequence','Gate','Do Once'],
    'Variables':['Get Bool','Set Bool','Get Float','Set Float','Get Int','Get Vector'],
    'Actions':['Print String','Delay','Cast To','Spawn Actor','Destroy Actor','Get Player Pawn'],
    'Math':['Add','Subtract','Multiply','Divide','Clamp','Lerp','Random Float'],
  }
  const colors = {'Events':'#c0392b','Flow':'#7d3c98','Variables':'#1e8449','Actions':'#2471a3','Math':'#784212'}
  const addNode = (t) => { const cat=Object.keys(lib).find(k=>lib[k].includes(t))||'Actions'; setNodes(n=>[...n,{id:Date.now(),t,c:colors[cat]||'#2c3e50',x:Math.random()*180+40,y:Math.random()*110+40}]); toast('Node: '+t) }
  return (
    <div>
      <PH icon="🔷" title="Blueprint Editor" sub="Visual scripting system" />
      <BtnRow>
        <button className="btn btn-p" onClick={()=>toast('Compiled!')}>✓ Compile</button>
        {['Save','Debug','Zoom In','Zoom Out'].map(b=><button key={b} className="btn btn-s" onClick={()=>toast(b)}>{b}</button>)}
      </BtnRow>
      <Card style={{padding:0,marginBottom:12}}>
        <div className="vp" style={{height:260,cursor:'crosshair'}}>
          <span className="vp-lbl">EVENT GRAPH</span>
          <svg width="100%" height="100%" style={{position:'absolute',opacity:.08}}>
            {[...Array(14)].map((_,i)=><line key={'v'+i} x1={`${i*7.14}%`} y1="0" x2={`${i*7.14}%`} y2="100%" stroke="#88aaff" strokeWidth="0.5"/>)}
            {[...Array(10)].map((_,i)=><line key={'h'+i} x1="0" y1={`${i*10}%`} x2="100%" y2={`${i*10}%`} stroke="#88aaff" strokeWidth="0.5"/>)}
            <line x1="120" y1="65" x2="190" y2="65" stroke="var(--accent)" strokeWidth="1.5" opacity="0.8"/>
            <line x1="120" y1="65" x2="190" y2="155" stroke="#a855f7" strokeWidth="1.5" opacity="0.8"/>
            <line x1="270" y1="155" x2="340" y2="90" stroke="#3b82f6" strokeWidth="1.5" opacity="0.8"/>
          </svg>
          {nodes.map(n=>(
            <div key={n.id} style={{position:'absolute',left:n.x,top:n.y,background:n.c+'dd',borderRadius:6,padding:'7px 12px',fontSize:11,color:'#fff',fontWeight:600,whiteSpace:'nowrap',border:'1px solid rgba(255,255,255,.2)',boxShadow:`0 4px 12px ${n.c}44`,cursor:'grab',userSelect:'none',fontFamily:'var(--fc)',letterSpacing:.5}}>
              <div style={{fontSize:9,opacity:.6,marginBottom:2}}>⬤ ───</div>{n.t}<div style={{fontSize:9,opacity:.6,marginTop:2}}>─── ⬤</div>
            </div>
          ))}
        </div>
      </Card>
      <div className="g2">
        <Card><ST>Node Library</ST>{Object.entries(lib).map(([cat,ns])=>(
          <div key={cat} style={{marginBottom:10}}>
            <div style={{fontFamily:'var(--fd)',fontSize:8,color:'var(--accent)',letterSpacing:2,marginBottom:5,textTransform:'uppercase'}}>{cat}</div>
            <div className="col">{ns.map(n=><button key={n} className="btn btn-s" style={{justifyContent:'flex-start',textTransform:'none',letterSpacing:0,padding:'5px 8px',fontSize:11}} onClick={()=>addNode(n)}>＋ {n}</button>)}</div>
          </div>
        ))}</Card>
        <Card>
          <ST>Variables</ST>
          <div className="col mb12">{vars.map((v,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:7,padding:'7px 9px',background:'var(--elevated)',borderRadius:6,border:'1px solid var(--border2)'}}>
              <Badge color={v.t==='Float'?'var(--blue)':v.t==='Boolean'?'var(--green)':'var(--accent)'}>{v.t}</Badge>
              <span style={{flex:1,fontSize:12,fontFamily:'var(--fc)'}}>{v.n}</span>
              <span style={{fontSize:11,color:'var(--t3)',fontFamily:'var(--fc)'}}>{v.v}</span>
            </div>
          ))}</div>
          <div style={{display:'flex',gap:6,marginBottom:7}}>
            <input value={vname} onChange={e=>setVname(e.target.value)} placeholder="Naam" style={{flex:1}}/>
            <select value={vtype} onChange={e=>setVtype(e.target.value)} style={{width:90}}>
              {['Float','Boolean','Integer','String','Vector','Actor'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <button className="btn btn-p w100" onClick={()=>{if(vname){setVars([...vars,{n:vname,t:vtype,v:'0'}]);setVname('');toast('Variable aangemaakt!')}}}>+ Voeg Toe</button>
        </Card>
      </div>
    </div>
  )
}

// ─── MATERIAL EDITOR ──────────────────────────
function MaterialEditor({ toast }) {
  const [pbr,setPbr]=useState({roughness:45,metallic:10,emissive:0,opacity:100,normalStrength:80})
  const [color,setColor]=useState('#e85d04')
  const [prev,setPrev]=useState('sphere')
  const nodes=['Texture Sample','Constant3Vector','Lerp','Multiply','Add','Fresnel','Normal Map','World Position Offset','Vertex Color','Noise']
  return (
    <div>
      <PH icon="🎨" title="Material Editor" sub="PBR node-based material creation" />
      <Card style={{marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',marginBottom:14}}>
          <ST>Preview</ST>
          <div style={{display:'flex',gap:6,marginLeft:'auto'}}>
            {['sphere','cube','plane'].map(p=><button key={p} className={`btn ${prev===p?'btn-p':'btn-s'}`} style={{padding:'4px 10px',fontSize:10}} onClick={()=>setPrev(p)}>{p}</button>)}
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:140,gap:22}}>
          {prev==='sphere'&&<div style={{width:110,height:110,borderRadius:'50%',background:`radial-gradient(circle at 35% 35%, ${color}, ${color}88 55%, #1a1a1a)`,boxShadow:`0 0 ${pbr.emissive/2}px ${color}, 0 8px 24px #0008`}}/>}
          {prev==='cube'&&<div style={{width:90,height:90,background:color,transform:'perspective(300px) rotateX(20deg) rotateY(30deg)',boxShadow:`0 0 ${pbr.emissive/2}px ${color}, inset -20px -20px 40px rgba(0,0,0,.5)`}}/>}
          {prev==='plane'&&<div style={{width:140,height:80,background:`linear-gradient(135deg,${color},${color}88)`,borderRadius:6,transform:'perspective(300px) rotateX(30deg)',boxShadow:`0 0 ${pbr.emissive/2}px ${color}`}}/>}
          <div style={{textAlign:'center'}}><div style={{fontSize:11,color:'var(--t3)',fontFamily:'var(--fc)',marginBottom:6}}>BASE COLOR</div><input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{width:58,height:38,border:'1px solid var(--border2)',borderRadius:6,cursor:'pointer',background:'none'}}/></div>
        </div>
      </Card>
      <div className="g2 mb12">
        <Card><ST>PBR Properties</ST>{Object.entries(pbr).map(([k,v])=><Sldr key={k} label={k} val={v} set={val=>setPbr(p=>({...p,[k]:val}))}/>)}</Card>
        <Card><ST>Material Nodes</ST><div className="col">{nodes.map(n=><button key={n} className="btn btn-s" style={{justifyContent:'flex-start',textTransform:'none',letterSpacing:0,fontSize:11}} onClick={()=>toast('Node: '+n)}>＋ {n}</button>)}</div></Card>
      </div>
      <Card>
        <div className="row">
          <button className="btn btn-p" style={{flex:1}} onClick={()=>toast('Opgeslagen!')}>💾 Opslaan</button>
          <button className="btn btn-g" style={{flex:1}} onClick={()=>toast('Material Instance aangemaakt!')}>⊕ Instance</button>
        </div>
      </Card>
    </div>
  )
}

// ─── SEQUENCER ────────────────────────────────
function Sequencer({ toast }) {
  const [play,setPlay]=useState(false)
  const [time,setTime]=useState(0)
  const tracks=[{n:'🎥 Master Camera',k:[0,30,60,90]},{n:'🧍 Hero Character',k:[10,40,70]},{n:'💡 LightRig_A',k:[0,50,100]},{n:'🔊 Music_Theme',k:[0,100]},{n:'⚡ Event_End',k:[95]}]
  return (
    <div>
      <PH icon="🎬" title="Sequencer" sub="Cinematic timeline editor" />
      <Card style={{marginBottom:12}}>
        <div className="row mb16">
          <button className={`btn ${play?'btn-g':'btn-p'}`} onClick={()=>{setPlay(p=>!p);toast(play?'Gestopt':'Afspelen')}}>{play?'⏸ Pause':'▶ Play'}</button>
          <button className="btn btn-s" onClick={()=>{setPlay(false);setTime(0)}}>⏹ Stop</button>
          <button className="btn btn-s" style={{color:'var(--red)',borderColor:'var(--red)'}} onClick={()=>toast('REC!')}>⏺ Record</button>
          <input type="range" min={0} max={100} value={time} onChange={e=>setTime(+e.target.value)} style={{flex:1}}/>
          <span style={{fontFamily:'var(--fd)',fontSize:11,color:'var(--accent)',minWidth:40}}>{String(Math.floor(time*.3)).padStart(2,'0')}:{String(Math.floor((time*.3%1)*60)).padStart(2,'0')}</span>
        </div>
        <div style={{display:'flex',marginBottom:5}}>
          <div style={{width:122}}/>
          <div style={{flex:1,display:'flex',justifyContent:'space-between'}}>
            {[0,25,50,75,100].map(t=><span key={t} style={{fontSize:9,color:'var(--t3)',fontFamily:'var(--fd)'}}>{t}</span>)}
          </div>
        </div>
        {tracks.map(tr=>(
          <div key={tr.n} className="tl-track">
            <div className="tl-lbl">{tr.n}</div>
            <div className="tl-bar">
              <div style={{position:'absolute',left:'3%',right:'3%',top:'30%',height:'40%',background:'var(--adim)',borderRadius:2}}/>
              {tr.k.map((kf,i)=><div key={i} style={{position:'absolute',left:`${kf}%`,top:'10%',width:8,height:'80%',background:'var(--accent)',borderRadius:2,transform:'translateX(-50%)',cursor:'pointer',boxShadow:'0 0 5px var(--aglow)'}}/>)}
              <div style={{position:'absolute',left:`${time}%`,top:0,width:1,height:'100%',background:'#fff',opacity:.8}}/>
            </div>
          </div>
        ))}
      </Card>
      <div className="g2">
        <Card><ST>Track Toevoegen</ST><div className="col">
          {['Camera Track','Actor Track','Light Track','Audio Track','Event Track','Fade Track'].map(t=><button key={t} className="btn btn-s w100" style={{justifyContent:'flex-start',textTransform:'none',letterSpacing:0}} onClick={()=>toast(t+' toegevoegd!')}>+ {t}</button>)}
        </div></Card>
        <Card><ST>Export</ST><div className="col">
          {['MP4 4K Export','PNG Sequence','Render High-Res','Bake Camera Anim','Export Premiere'].map(e=><button key={e} className="btn btn-s w100" style={{justifyContent:'flex-start',textTransform:'none',letterSpacing:0}} onClick={()=>toast(e)}>🎬 {e}</button>)}
          <button className="btn btn-p w100" onClick={()=>toast('Renderen gestart!')}>🚀 Start Render</button>
        </div></Card>
      </div>
    </div>
  )
}

// ─── AI & GAMEPLAY ────────────────────────────
function AIGameplay({ toast }) {
  const [ws,setWs]=useState(600);const [jh,setJh]=useState(420);const [gv,setGv]=useState(980)
  const [nav,setNav]=useState(true);const [eqs,setEqs]=useState(false)
  const [bb,setBb]=useState([{n:'TargetActor',t:'Object'},{n:'IsChasing',t:'Bool'},{n:'LastKnownPos',t:'Vector'},{n:'AttackRange',t:'Float'}])
  const inputs=[{a:'Jump',k:'Space'},{a:'Fire',k:'LMB'},{a:'Sprint',k:'L-Shift'},{a:'Crouch',k:'L-Ctrl'},{a:'Interact',k:'E'},{a:'Aim',k:'RMB'}]
  const btNodes=['Selector','Sequence','Patrol Task','Chase Task','Attack Task','Wait','Is Visible?','Is In Range?']
  return (
    <div>
      <PH icon="🤖" title="AI & Gameplay" sub="Behavior trees, navigation & game systems" />
      <div className="g2 mb12">
        <Card>
          <ST>Behavior Tree</ST>
          <div style={{background:'var(--bg)',borderRadius:8,padding:12,marginBottom:10,minHeight:120}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:10}}><div style={{background:'#7d3c98',borderRadius:6,padding:'5px 16px',color:'#fff',fontSize:11,fontFamily:'var(--fd)',letterSpacing:1}}>ROOT</div></div>
            <div style={{display:'flex',justifyContent:'space-around'}}>
              {['Patrol','Chase','Attack'].map(n=><div key={n} style={{background:'#1a5276',borderRadius:5,padding:'5px 12px',color:'#ddd',fontSize:11,fontFamily:'var(--fc)',letterSpacing:1}}>{n}</div>)}
            </div>
          </div>
          <div className="row" style={{flexWrap:'wrap'}}>
            {btNodes.map(n=><button key={n} className="btn btn-s" style={{fontSize:11,padding:'4px 8px',textTransform:'none',letterSpacing:0}} onClick={()=>toast('BT: '+n)}>+ {n}</button>)}
          </div>
        </Card>
        <Card>
          <ST>Blackboard Keys</ST>
          <div className="col mb12">{bb.map((k,i)=>(
            <div key={i} style={{display:'flex',gap:8,alignItems:'center',padding:'6px 9px',background:'var(--elevated)',borderRadius:6,border:'1px solid var(--border2)'}}>
              <Badge color={k.t==='Bool'?'var(--green)':k.t==='Vector'?'var(--blue)':k.t==='Float'?'var(--accent)':'#a855f7'}>{k.t}</Badge>
              <span style={{fontSize:12,fontFamily:'var(--fc)'}}>{k.n}</span>
            </div>
          ))}</div>
          <button className="btn btn-p w100" onClick={()=>{setBb([...bb,{n:'NewKey_'+bb.length,t:'Bool'}]);toast('Key aangemaakt!')}}>+ Voeg Key Toe</button>
        </Card>
      </div>
      <div className="g2">
        <Card>
          <ST>Character Movement</ST>
          <Sldr label="Walk Speed (cm/s)" val={ws} set={setWs} min={100} max={2000}/>
          <Sldr label="Jump Z Velocity" val={jh} set={setJh} min={100} max={2000}/>
          <Sldr label="Gravity Scale" val={gv} set={setGv} min={100} max={2000}/>
          <Tog val={nav} set={setNav} label="NavMesh Bounds Volume"/>
          <Tog val={eqs} set={setEqs} label="EQS (Environment Query)"/>
        </Card>
        <Card>
          <ST>Input Bindings</ST>
          <div className="col">
            {inputs.map((b,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 10px',background:'var(--elevated)',borderRadius:6,border:'1px solid var(--border2)'}}>
                <span style={{fontSize:12,fontFamily:'var(--fc)'}}>{b.a}</span><Badge color="var(--accent)">{b.k}</Badge>
              </div>
            ))}
          </div>
          <button className="btn btn-g w100 mt8" onClick={()=>toast('Binding toegevoegd!')}>+ Binding Toevoegen</button>
        </Card>
      </div>
    </div>
  )
}

// ─── NIAGARA VFX ──────────────────────────────
function NiagaraVFX({ toast }) {
  const [emitters,setEmitters]=useState([{id:1,n:'Fire_Core',t:'Sprite',on:true,c:'#f97316'},{id:2,n:'Smoke_Trail',t:'Ribbon',on:true,c:'#888'},{id:3,n:'Ember_Sparks',t:'Mesh',on:false,c:'#facc15'}])
  const [spawn,setSpawn]=useState(80);const [life,setLife]=useState(3);const [vel,setVel]=useState(250);const [sz,setSz]=useState(15)
  const [tick,setTick]=useState(0)
  const presets=['🔥 Fire','💨 Smoke','💧 Water','💥 Explosion','✨ Magic','🌧 Rain','❄️ Snow','⚡ Lightning','🌊 Ocean','🌀 Tornado']
  useState(()=>{ const i=setInterval(()=>setTick(t=>t+1),120); return ()=>clearInterval(i) })
  return (
    <div>
      <PH icon="✨" title="Niagara VFX" sub="Particle systems & visual effects" />
      <div className="g2 mb12">
        <Card>
          <ST>Emitters</ST>
          <div className="col mb12">{emitters.map(e=>(
            <div key={e.id} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 9px',background:'var(--elevated)',borderRadius:6,border:`1px solid ${e.on?e.c+'44':'var(--border)'}`}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:e.on?'var(--green)':'var(--red)',flexShrink:0}}/>
              <span style={{flex:1,fontSize:12,fontFamily:'var(--fc)'}}>{e.n}</span>
              <Badge color={e.c}>{e.t}</Badge>
              <button onClick={()=>setEmitters(emitters.map(x=>x.id===e.id?{...x,on:!x.on}:x))} style={{background:'none',border:'none',color:'var(--t3)',cursor:'pointer',fontSize:13}}>{e.on?'⏸':'▶'}</button>
            </div>
          ))}</div>
          {['Sprite','Mesh','Ribbon','Beam'].map(t=><button key={t} className="btn btn-s w100 mb8" style={{textTransform:'none',letterSpacing:0,justifyContent:'flex-start'}} onClick={()=>{setEmitters(e=>[...e,{id:Date.now(),n:t+'_Emitter',t,on:true,c:'var(--accent)'}]);toast('Emitter: '+t)}}>+ {t} Emitter</button>)}
        </Card>
        <Card>
          <ST>Live Preview</ST>
          <div style={{height:180,background:'var(--bg)',borderRadius:8,position:'relative',overflow:'hidden',border:'1px solid var(--border2)'}}>
            {[...Array(25)].map((_,i)=>(
              <div key={i} style={{position:'absolute',left:`${40+Math.sin((i+tick*.25)*.7)*18}%`,bottom:`${((i*7+tick*2)%100)}%`,width:sz/25*3+2,height:sz/25*3+2,borderRadius:'50%',background:i%3===0?'#f97316':i%3===1?'#facc15':'#dc2626',opacity:Math.max(.1,1-((i*7+tick*2)%100)/100),filter:'blur(.5px)'}}/>
            ))}
            <span style={{position:'absolute',bottom:6,right:8,fontSize:9,color:'var(--accent)',fontFamily:'var(--fd)',letterSpacing:1}}>LIVE PREVIEW</span>
          </div>
        </Card>
      </div>
      <Card style={{marginBottom:12}}><ST>Emitter Modules</ST><div className="g2"><Sldr label="Spawn Rate (/s)" val={spawn} set={setSpawn} min={1} max={500}/><Sldr label="Lifetime (s)" val={life} set={setLife} min={1} max={10}/><Sldr label="Initial Velocity" val={vel} set={setVel} min={0} max={1000}/><Sldr label="Particle Size" val={sz} set={setSz} min={1} max={100}/></div></Card>
      <Card><ST>VFX Presets</ST><div className="g4">{presets.map(p=><button key={p} className="btn btn-s" style={{padding:'10px 4px',textTransform:'none',letterSpacing:0,fontSize:10,flexDirection:'column',height:52}} onClick={()=>toast('Preset: '+p)} onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border2)'}>{p}</button>)}</div></Card>
    </div>
  )
}

// ─── AUDIO ────────────────────────────────────
function AudioSystem({ toast }) {
  const [vol,setVol]=useState(80);const [pitch,setPitch]=useState(100);const [atten,setAtten]=useState(800)
  const [playing,setPlaying]=useState(null)
  const sounds=[{n:'Orchestral_Main_Theme.wav',t:'Music',d:'4:12',c:'#9333ea'},{n:'Footstep_Grass_01.wav',t:'SFX',d:'0:01',c:'var(--accent)'},{n:'Explosion_Heavy.wav',t:'SFX',d:'0:04',c:'var(--red)'},{n:'Forest_Ambience_Loop.wav',t:'Ambient',d:'5:00',c:'var(--green)'},{n:'UI_Button_Click.wav',t:'UI',d:'0:00',c:'var(--blue)'},{n:'Wind_Cave_Reverb.wav',t:'Ambient',d:'3:20',c:'var(--green)'}]
  const cueNodes=['Sound Wave','Random','Modulator','Mixer','Delay','Concat','Loop','Switch on Int']
  return (
    <div>
      <PH icon="🔊" title="Audio Systeem" sub="Sound design & MetaSounds" />
      <Card style={{marginBottom:12}}>
        <ST>Sound Library</ST>
        <div className="col mb12">{sounds.map((s,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 0',borderBottom:'1px solid var(--border)'}}>
            <button onClick={()=>setPlaying(playing===i?null:i)} style={{width:28,height:28,borderRadius:'50%',background:playing===i?'var(--green)':'var(--accent)',border:'none',color:'#fff',cursor:'pointer',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{playing===i?'⏹':'▶'}</button>
            <span style={{flex:1,fontSize:12,fontFamily:'var(--fc)'}}>{s.n}</span>
            <Badge color={s.c}>{s.t}</Badge>
            <span style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--fd)',minWidth:30}}>{s.d}</span>
          </div>
        ))}</div>
        <button className="btn btn-s" onClick={()=>toast('Importeren...')}>📁 Audio Importeren</button>
      </Card>
      <div className="g2">
        <Card><ST>3D Audio Instellingen</ST><Sldr label="Master Volume" val={vol} set={setVol}/><Sldr label="Pitch Shift" val={pitch} set={setPitch} min={50} max={200}/><Sldr label="Attenuation (cm)" val={atten} set={setAtten} min={100} max={10000}/>{['Loop','Spatialized 3D','Reverb','Doppler','Occlusion'].map(o=><Tog key={o} val={false} set={()=>toast(o)} label={o}/>)}</Card>
        <Card><ST>Sound Cue Nodes</ST><div className="col">{cueNodes.map(n=><button key={n} className="btn btn-s" style={{justifyContent:'flex-start',textTransform:'none',letterSpacing:0}} onClick={()=>toast('Cue Node: '+n)}>+ {n}</button>)}</div></Card>
      </div>
    </div>
  )
}

// ─── WORLD BUILDING ───────────────────────────
function WorldBuilding({ toast }) {
  const [tod,setTod]=useState(14);const [clouds,setClouds]=useState(35);const [fog,setFog]=useState(15)
  const [wave,setWave]=useState(25);const [pcg,setPcg]=useState(55);const [ltool,setLtool]=useState('raise')
  const [lumen,setLumen]=useState(true);const [vol,setVol]=useState(true)
  const sky=tod<5||tod>21?'#02020d':tod<7?'#c2410c':tod>19?'#7c2d12':'#2563eb'
  const lsTools=['Raise','Lower','Smooth','Flatten','Erode','Paint']
  return (
    <div>
      <PH icon="🌍" title="World Building" sub="Landscape, sky & procedural generation" />
      <Card style={{padding:0,marginBottom:12}}>
        <div style={{height:110,borderRadius:10,position:'relative',overflow:'hidden',background:`linear-gradient(to bottom, ${sky}, ${sky}aa 60%, #1a2e1a 80%, #0f1f0f)`,transition:'background .5s'}}>
          <div style={{position:'absolute',top:16,left:`${(tod/24)*78+10}%`,transition:'left .3s',fontSize:24}}>{tod<5||tod>21?'🌙':tod<7||tod>19?'🌅':'☀️'}</div>
          {[...Array(5)].map((_,i)=><div key={i} style={{position:'absolute',top:8+i*10,left:`${15+i*14}%`,width:52,height:14,background:`rgba(255,255,255,${clouds/500})`,borderRadius:8,filter:'blur(4px)'}}/>)}
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:32,background:'linear-gradient(transparent,#0f1f0f)',display:'flex',alignItems:'flex-end',padding:'0 12px 5px'}}>
            <span style={{fontFamily:'var(--fd)',fontSize:8,color:'var(--accent)',letterSpacing:2}}>{tod}:00 — {tod<6?'NACHT':tod<12?'OCHTEND':tod<18?'MIDDAG':tod<21?'AVOND':'NACHT'}</span>
          </div>
        </div>
      </Card>
      <div className="g2 mb12">
        <Card><ST>Sky & Atmosfeer</ST><Sldr label="Tijd van Dag (uur)" val={tod} set={setTod} min={0} max={23}/><Sldr label="Wolkendichtheid %" val={clouds} set={setClouds}/><Sldr label="Mist Dichtheid" val={fog} set={setFog}/><Tog val={lumen} set={setLumen} label="Lumen GI"/><Tog val={vol} set={setVol} label="Volumetrische Wolken"/></Card>
        <Card><ST>Water Systeem</ST><div className="col mb8">{['Ocean','River','Lake','Waterfall','Swamp'].map(w=><button key={w} className="btn btn-s w100" style={{justifyContent:'flex-start',textTransform:'none',letterSpacing:0}} onClick={()=>toast(w+' toegevoegd!')}>💧 {w}</button>)}</div><Sldr label="Golfhoogte" val={wave} set={setWave}/></Card>
      </div>
      <Card style={{marginBottom:12}}>
        <ST>Landscape Tools</ST>
        <div className="row mb12" style={{flexWrap:'wrap'}}>{lsTools.map(t=><button key={t} className={`btn ${ltool===t.toLowerCase()?'btn-p':'btn-s'}`} onClick={()=>setLtool(t.toLowerCase())}>{t}</button>)}</div>
        <div style={{background:'var(--bg)',height:70,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',border:'1px dashed var(--border2)'}}><span style={{fontFamily:'var(--fc)',fontSize:11,color:'var(--t3)',letterSpacing:2}}>LANDSCAPE CANVAS — {ltool.toUpperCase()}</span></div>
      </Card>
      <Card><ST>Procedurele Content (PCG)</ST><Sldr label="Vegetatiedichtheid %" val={pcg} set={setPcg}/><div className="row" style={{flexWrap:'wrap',gap:6}}>{['🌲 Bomen','🪨 Rotsen','🌿 Gras','🌾 Struiken','🌸 Bloemen','🍄 Paddenstoelen'].map(v=><button key={v} className="btn btn-s" style={{textTransform:'none',letterSpacing:0,fontSize:11}} onClick={()=>toast(v+' PCG actief!')}>+ {v}</button>)}</div></Card>
    </div>
  )
}

// ─── ASSET MANAGER ────────────────────────────
function AssetManager({ toast }) {
  const [filter,setFilter]=useState('All');const [search,setSearch]=useState('');const [favs,setFavs]=useState([])
  const filters=['All','Meshes','Textures','Materials','Blueprints','Audio','VFX','Animations']
  const assets=[{n:'SM_Rock_Cluster',t:'Meshes',s:'2.4 MB',i:'⬜'},{n:'T_Bark_Diffuse',t:'Textures',s:'8.1 MB',i:'🟫'},{n:'M_Water_Dynamic',t:'Materials',s:'0.4 MB',i:'💧'},{n:'BP_Enemy_Patrol',t:'Blueprints',s:'1.1 MB',i:'🔷'},{n:'SFX_Wind_Loop',t:'Audio',s:'0.9 MB',i:'🔊'},{n:'NS_FireTorch',t:'VFX',s:'0.6 MB',i:'✨'},{n:'SM_Tree_Pine',t:'Meshes',s:'6.2 MB',i:'🌲'},{n:'T_Sky_HDRI',t:'Textures',s:'18 MB',i:'🌅'},{n:'M_Stone_PBR',t:'Materials',s:'0.5 MB',i:'🔮'},{n:'BP_FPS_Character',t:'Blueprints',s:'2.2 MB',i:'🧍'},{n:'ANM_Walk_Cycle',t:'Animations',s:'0.3 MB',i:'🎭'},{n:'ANM_Jump',t:'Animations',s:'0.2 MB',i:'🎭'}]
  const filtered=assets.filter(a=>(filter==='All'||a.t===filter)&&a.n.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <PH icon="📦" title="Asset Manager" sub="Asset browser, import & organization" />
      <div className="row mb12"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Zoek assets..." style={{flex:1}}/><button className="btn btn-p" onClick={()=>toast('Importeren...')}>📁 Import</button></div>
      <div className="row mb16" style={{flexWrap:'wrap'}}>{filters.map(f=><button key={f} className={`btn ${filter===f?'btn-p':'btn-s'}`} style={{padding:'5px 11px',fontSize:11}} onClick={()=>setFilter(f)}>{f}</button>)}</div>
      <div className="g2">{filtered.map((a,i)=>(
        <Card key={i} hov onClick={()=>toast('Geopend: '+a.n)}>
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <span style={{fontSize:22,flexShrink:0}}>{a.i}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:'var(--fc)',fontSize:12,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.n}</div>
              <div style={{display:'flex',gap:6,marginTop:4}}><Badge color="var(--blue)">{a.t}</Badge><span style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--fc)'}}>{a.s}</span></div>
            </div>
            <button onClick={e=>{e.stopPropagation();setFavs(favs.includes(a.n)?favs.filter(f=>f!==a.n):[...favs,a.n])}} style={{background:'none',border:'none',cursor:'pointer',fontSize:16,color:favs.includes(a.n)?'var(--accent)':'var(--t3)'}}>
              {favs.includes(a.n)?'⭐':'☆'}
            </button>
          </div>
        </Card>
      ))}</div>
    </div>
  )
}

// ─── UI BUILDER ───────────────────────────────
function UIBuilder({ toast }) {
  const [widgets,setWidgets]=useState([{id:1,t:'Button',l:'Play Game',x:100,y:95,w:120,h:36,c:'#f97316'},{id:2,t:'Text',l:'Score: 0',x:14,y:14,w:90,h:22,c:'#fff'},{id:3,t:'ProgressBar',l:'HP',x:14,y:42,w:180,h:15,c:'#22c55e'},{id:4,t:'Image',l:'🗡',x:14,y:66,w:36,h:36,c:'#facc15'}])
  const [ps,setPs]=useState('desktop')
  const wTypes=['Button','Text Block','Image','Progress Bar','Slider','Checkbox','Border','Input Field','List View']
  const canW=ps==='mobile'?200:ps==='tablet'?275:340
  const add=(type)=>{setWidgets(w=>[...w,{id:Date.now(),t:type,l:type,c:'var(--blue)',x:Math.random()*90+30,y:Math.random()*80+35,w:100,h:28}]);toast('Widget: '+type)}
  return (
    <div>
      <PH icon="🖥" title="UI Builder" sub="UMG widget designer" />
      <div className="row mb12">
        {['mobile','tablet','desktop'].map(s=><button key={s} className={`btn ${ps===s?'btn-p':'btn-s'}`} onClick={()=>setPs(s)}>{s==='mobile'?'📱':s==='tablet'?'💻':'🖥'} {s}</button>)}
        <button className="btn btn-g" style={{marginLeft:'auto'}} onClick={()=>toast('Blueprint gekoppeld!')}>🔗 Koppel Blueprint</button>
      </div>
      <div style={{display:'flex',gap:11}}>
        <Card style={{minWidth:136,flex:'0 0 136px'}}><ST>Widgets</ST><div className="col">{wTypes.map(w=><button key={w} className="btn btn-s" style={{justifyContent:'flex-start',textTransform:'none',letterSpacing:0,fontSize:11}} onClick={()=>add(w)}>+ {w}</button>)}</div></Card>
        <div style={{flex:1}}>
          <Card style={{padding:0,marginBottom:11}}>
            <div style={{width:canW,margin:'0 auto',height:230,background:'#111',position:'relative',borderRadius:8,overflow:'hidden',border:'1px solid var(--border2)',transition:'width .3s'}}>
              {widgets.map(w=>(
                <div key={w.id} onClick={()=>toast('Geselecteerd: '+w.l)} style={{position:'absolute',left:Math.min(w.x,canW-w.w-4),top:w.y,width:w.w,height:w.h,borderRadius:w.t==='ProgressBar'?3:6,background:w.t==='ProgressBar'?'transparent':w.c+'22',border:`1px solid ${w.c}`,display:'flex',alignItems:'center',justifyContent:w.t==='ProgressBar'?'flex-start':'center',color:w.c,fontSize:11,cursor:'pointer',userSelect:'none',fontFamily:'var(--fc)',overflow:'hidden'}}>
                  {w.t==='ProgressBar'?<div style={{width:'65%',height:'100%',background:w.c,borderRadius:3}}/>:w.l}
                </div>
              ))}
            </div>
          </Card>
          <Card><ST>Hierarchy</ST><div className="col">{widgets.map((w,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 8px',background:'var(--elevated)',borderRadius:5,border:'1px solid var(--border2)'}}>
              <span style={{fontSize:12,fontFamily:'var(--fc)'}}>⬜ {w.l}</span>
              <div style={{display:'flex',gap:7}}><Badge>{w.t}</Badge><button onClick={()=>{setWidgets(widgets.filter(x=>x.id!==w.id));toast('Verwijderd')}} style={{background:'none',border:'none',color:'var(--red)',cursor:'pointer'}}>✕</button></div>
            </div>
          ))}</div></Card>
        </div>
      </div>
    </div>
  )
}

// ─── PROJECT SETTINGS ─────────────────────────
function ProjectSettings({ toast }) {
  const [s,setS]=useState({name:'My UE5 Game',company:'My Studio',quality:'Epic',fps:60,lumen:true,nanite:true,rt:false,vsync:true,bloom:true,mb:false,dof:true,vig:true,bloomI:50,temp:6500,contrast:50,sat:100,build:'Development'})
  const set=(k,v)=>setS(p=>({...p,[k]:v}))
  const plats=[{id:'win',l:'Windows',i:'🖥'},{id:'android',l:'Android',i:'📱'},{id:'ios',l:'iOS',i:'🍎'},{id:'ps5',l:'PS5',i:'🎮'},{id:'xbox',l:'Xbox Series X',i:'🎮'},{id:'switch',l:'Switch',i:'🕹'}]
  const [targets,setTargets]=useState(['win'])
  const tgl=(id)=>setTargets(t=>t.includes(id)?t.filter(x=>x!==id):[...t,id])
  return (
    <div>
      <PH icon="⚙️" title="Project Settings" sub="Engine configuration & packaging" />
      <Card style={{marginBottom:12}}>
        <ST>Algemeen</ST>
        <div className="g2 mb12">
          <div><div style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--fc)',letterSpacing:1,marginBottom:4}}>PROJECTNAAM</div><input value={s.name} onChange={e=>set('name',e.target.value)}/></div>
          <div><div style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--fc)',letterSpacing:1,marginBottom:4}}>STUDIO NAAM</div><input value={s.company} onChange={e=>set('company',e.target.value)}/></div>
        </div>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--fc)',letterSpacing:1,marginBottom:7}}>RENDERING KWALITEIT</div>
          <div className="row" style={{flexWrap:'wrap'}}>{['Low','Medium','High','Epic','Cinematic'].map(q=><button key={q} className={`btn ${s.quality===q?'btn-p':'btn-s'}`} style={{fontSize:11,padding:'5px 11px'}} onClick={()=>set('quality',q)}>{q}</button>)}</div>
        </div>
        <Sldr label="Doel FPS" val={s.fps} set={v=>set('fps',v)} min={30} max={240}/>
      </Card>
      <Card style={{marginBottom:12}}>
        <ST>Rendering Technologieën</ST>
        <div className="g2"><Tog val={s.lumen} set={v=>set('lumen',v)} label="Lumen GI"/><Tog val={s.nanite} set={v=>set('nanite',v)} label="Nanite Geometry"/><Tog val={s.rt} set={v=>set('rt',v)} label="Ray Tracing (RTX)"/><Tog val={s.vsync} set={v=>set('vsync',v)} label="VSync"/></div>
      </Card>
      <Card style={{marginBottom:12}}>
        <ST>Post Process</ST>
        <div className="g2 mb12"><Tog val={s.bloom} set={v=>set('bloom',v)} label="Bloom"/><Tog val={s.mb} set={v=>set('mb',v)} label="Motion Blur"/><Tog val={s.dof} set={v=>set('dof',v)} label="Depth of Field"/><Tog val={s.vig} set={v=>set('vig',v)} label="Vignette"/></div>
        <div className="g2"><Sldr label="Bloom Intensiteit" val={s.bloomI} set={v=>set('bloomI',v)}/><Sldr label="Kleurtemperatuur K" val={s.temp} set={v=>set('temp',v)} min={2000} max={12000}/><Sldr label="Contrast" val={s.contrast} set={v=>set('contrast',v)}/><Sldr label="Saturatie" val={s.sat} set={v=>set('sat',v)}/></div>
      </Card>
      <Card style={{marginBottom:12}}>
        <ST>Platform Targets</ST>
        <div className="g2">{plats.map(p=>(
          <div key={p.id} onClick={()=>tgl(p.id)} style={{display:'flex',alignItems:'center',gap:9,padding:'9px 12px',borderRadius:7,cursor:'pointer',background:targets.includes(p.id)?'var(--adim)':'var(--elevated)',border:`1px solid ${targets.includes(p.id)?'var(--accent)':'var(--border2)'}`,transition:'all .12s'}}>
            <span style={{fontSize:17}}>{p.i}</span>
            <span style={{fontFamily:'var(--fc)',fontSize:12,color:targets.includes(p.id)?'var(--accent)':'var(--t2)'}}>{p.l}</span>
            {targets.includes(p.id)&&<span style={{marginLeft:'auto',color:'var(--accent)',fontSize:12}}>✓</span>}
          </div>
        ))}</div>
      </Card>
      <Card>
        <ST>Build & Packaging</ST>
        <div className="row mb12">{['Debug','Development','Shipping'].map(b=><button key={b} className={`btn ${s.build===b?'btn-p':'btn-s'}`} onClick={()=>set('build',b)}>{b}</button>)}</div>
        <div className="row"><button className="btn btn-p" style={{flex:1}} onClick={()=>toast('Build gestart: '+s.build+' voor '+targets.length+' platforms')}>🚀 Build & Package</button><button className="btn btn-s" onClick={()=>toast('Opgeslagen!')}>💾 Opslaan</button></div>
      </Card>
    </div>
  )
}

// ─── NAV CONFIG ───────────────────────────────
const NAV = [
  {id:'dashboard',l:'Dashboard',i:'⊞'},
  {id:'level',l:'Level Editor',i:'🗺'},
  {id:'blueprint',l:'Blueprints',i:'🔷'},
  {id:'material',l:'Materials',i:'🎨'},
  {id:'sequencer',l:'Sequencer',i:'🎬'},
  {id:'ai',l:'AI & Gameplay',i:'🤖'},
  {id:'niagara',l:'Niagara VFX',i:'✨'},
  {id:'audio',l:'Audio',i:'🔊'},
  {id:'world',l:'World Building',i:'🌍'},
  {id:'assets',l:'Asset Manager',i:'📦'},
  {id:'ui',l:'UI Builder',i:'🖥'},
  {id:'settings',l:'Project Settings',i:'⚙️'},
]

// ─── MAIN APP ─────────────────────────────────
export default function App() {
  const [page, setPage] = useState('dashboard')
  const [drawer, setDrawer] = useState(false)
  const [msg, setMsg] = useState(null)
  const toast = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2800) }
  const p = { setPage, toast }
  const pages = {
    dashboard: <Dashboard {...p}/>, level: <LevelEditor {...p}/>, blueprint: <BlueprintEditor {...p}/>,
    material: <MaterialEditor {...p}/>, sequencer: <Sequencer {...p}/>, ai: <AIGameplay {...p}/>,
    niagara: <NiagaraVFX {...p}/>, audio: <AudioSystem {...p}/>, world: <WorldBuilding {...p}/>,
    assets: <AssetManager {...p}/>, ui: <UIBuilder {...p}/>, settings: <ProjectSettings {...p}/>,
  }
  const cur = NAV.find(n => n.id === page)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sb-logo"><div className="sb-title">UE5 CREATOR</div><div className="sb-sub">STUDIO V5.7.4</div></div>
        <nav className="sb-nav">
          {NAV.map(n => (
            <div key={n.id} className={`ni ${page===n.id?'on':''}`} onClick={() => setPage(n.id)}>
              <span className="ni-icon">{n.i}</span><span className="ni-lbl">{n.l}</span>
            </div>
          ))}
        </nav>
        <div className="sb-foot">
          <div className="sb-foot-text"><span style={{color:'var(--green)'}}>● Engine Online</span><br/>UE5.7.4 · Lumen ON · Nanite ON<br/>Groq AI aktief</div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="mh">
        <button className="mh-btn" onClick={() => setDrawer(true)}>☰</button>
        <div className="mh-title">UE5 CREATOR STUDIO</div>
        {cur && <div style={{fontFamily:'var(--fc)',fontSize:11,color:'var(--t3)'}}>{cur.i} {cur.l}</div>}
      </header>

      {/* Drawer */}
      {drawer && (
        <div className="dov" onClick={() => setDrawer(false)}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <div style={{padding:'0 16px 12px',borderBottom:'1px solid var(--border)',marginBottom:6}}>
              <div style={{fontFamily:'var(--fd)',fontSize:12,color:'var(--accent)',letterSpacing:2}}>UE5 CREATOR</div>
              <div style={{fontFamily:'var(--fc)',fontSize:10,color:'var(--t3)',letterSpacing:2}}>STUDIO V5.7.4</div>
            </div>
            {NAV.map(n => (
              <div key={n.id} className={`ni ${page===n.id?'on':''}`} onClick={() => { setPage(n.id); setDrawer(false) }}>
                <span className="ni-icon">{n.i}</span><span className="ni-lbl">{n.l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main */}
      <main className="main">
        <div key={page} className="page">{pages[page]}</div>
      </main>

      {/* Bottom Nav */}
      <nav className="bn">
        <div className="bn-inner">
          {NAV.slice(0,5).map(n=>(
            <div key={n.id} className={`bni ${page===n.id?'on':''}`} onClick={()=>setPage(n.id)}>
              <span style={{fontSize:17}}>{n.i}</span><span className="bni-lbl">{n.l.split(' ')[0]}</span>
            </div>
          ))}
          <div className="bni" onClick={()=>setDrawer(true)}>
            <span style={{fontSize:17}}>⋯</span><span className="bni-lbl">Meer</span>
          </div>
        </div>
      </nav>

      <AIChat />
      {msg && <div className="toast">{msg}</div>}
    </>
  )
}

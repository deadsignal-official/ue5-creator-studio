import { useState } from 'react'
import AIChat from './components/AIChat.jsx'
import { Toast } from './components/UI.jsx'
import {
  Dashboard, LevelEditor, BlueprintEditor, MaterialEditor,
  Sequencer, AIGameplay, NiagaraVFX, AudioSystem,
  WorldBuilding, AssetManager, UIBuilder, ProjectSettings
} from './components/pages/Pages.jsx'

const NAV = [
  { id: 'dashboard', label: 'Dashboard',        icon: '⊞' },
  { id: 'level',     label: 'Level Editor',      icon: '🗺' },
  { id: 'blueprint', label: 'Blueprints',         icon: '🔷' },
  { id: 'material',  label: 'Materials',          icon: '🎨' },
  { id: 'sequencer', label: 'Sequencer',          icon: '🎬' },
  { id: 'ai',        label: 'AI & Gameplay',      icon: '🤖' },
  { id: 'niagara',   label: 'Niagara VFX',        icon: '✨' },
  { id: 'audio',     label: 'Audio',              icon: '🔊' },
  { id: 'world',     label: 'World Building',     icon: '🌍' },
  { id: 'assets',    label: 'Asset Manager',      icon: '📦' },
  { id: 'ui',        label: 'UI Builder',         icon: '🖥' },
  { id: 'settings',  label: 'Project Settings',   icon: '⚙️' },
]

function NavItem({ item, active, onClick }) {
  return (
    <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="nav-icon">{item.icon}</span>
      <span className="nav-label">{item.label}</span>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)

  const toast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2800)
  }

  const props = { setPage, toast }

  const pages = {
    dashboard: <Dashboard {...props} />,
    level:     <LevelEditor {...props} />,
    blueprint: <BlueprintEditor {...props} />,
    material:  <MaterialEditor {...props} />,
    sequencer: <Sequencer {...props} />,
    ai:        <AIGameplay {...props} />,
    niagara:   <NiagaraVFX {...props} />,
    audio:     <AudioSystem {...props} />,
    world:     <WorldBuilding {...props} />,
    assets:    <AssetManager {...props} />,
    ui:        <UIBuilder {...props} />,
    settings:  <ProjectSettings {...props} />,
  }

  const current = NAV.find(n => n.id === page)

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-title">UE5 Creator</div>
          <div className="sidebar-logo-sub">Studio v5.7.4</div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(item => (
            <NavItem key={item.id} item={item} active={page === item.id} onClick={() => setPage(item.id)} />
          ))}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)', letterSpacing: 1, lineHeight: 1.6 }}>
            <div style={{ color: 'var(--green)', marginBottom: 2 }}>● Engine Online</div>
            UE5.7.4 · Lumen ON · Nanite ON
          </div>
        </div>
      </aside>

      {/* ─── MOBILE HEADER ─── */}
      <header className="mobile-header">
        <button className="hamburger" onClick={() => setDrawerOpen(true)}>☰</button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--accent)', letterSpacing: 2 }}>
          UE5 CREATOR
        </div>
        {current && (
          <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 11, color: 'var(--text-muted)' }}>
            {current.icon} {current.label}
          </div>
        )}
      </header>

      {/* ─── MOBILE DRAWER ─── */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '0 16px 12px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
              <div className="sidebar-logo-title" style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--accent)' }}>UE5 CREATOR STUDIO</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)', letterSpacing: 2 }}>v5.7.4</div>
            </div>
            {NAV.map(item => (
              <NavItem key={item.id} item={item} active={page === item.id}
                onClick={() => { setPage(item.id); setDrawerOpen(false) }} />
            ))}
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <main className="main-content">
        <div key={page} className="page-container">
          {pages[page]}
        </div>
      </main>

      {/* ─── BOTTOM NAV (mobile) ─── */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV.slice(0, 5).map(item => (
            <div key={item.id} className={`bottom-nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span className="bottom-nav-label">{item.label.split(' ')[0]}</span>
            </div>
          ))}
          <div className="bottom-nav-item" onClick={() => setDrawerOpen(true)}>
            <span style={{ fontSize: 18 }}>⋯</span>
            <span className="bottom-nav-label">Meer</span>
          </div>
        </div>
      </nav>

      {/* ─── AI CHAT ─── */}
      <AIChat />

      {/* ─── TOAST ─── */}
      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg(null)} />}
    </>
  )
}

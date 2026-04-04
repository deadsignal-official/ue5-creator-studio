// ─── CARD ───
export function Card({ children, style = {}, className = '', hoverable = false, onClick }) {
  return (
    <div
      className={`card ${hoverable ? 'hoverable' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// ─── SECTION TITLE ───
export function SectionTitle({ children }) {
  return <div className="section-title">{children}</div>
}

// ─── BADGE ───
export function Badge({ children, color = 'var(--accent)' }) {
  return (
    <span className="badge" style={{ color, borderColor: color, background: color + '18' }}>
      {children}
    </span>
  )
}

// ─── TOGGLE ───
export function Toggle({ value, onChange, label }) {
  return (
    <div className="toggle-wrap">
      <div
        className="toggle-track"
        style={{ background: value ? 'var(--accent)' : 'var(--bg-elevated)' }}
        onClick={() => onChange(!value)}
      >
        <div
          className="toggle-thumb"
          style={{ left: value ? 21 : 3 }}
        />
      </div>
      <span className="toggle-label">{label}</span>
    </div>
  )
}

// ─── SLIDER ───
export function Slider({ label, value, onChange, min = 0, max = 100 }) {
  return (
    <div className="slider-wrap">
      <div className="slider-row">
        <span className="slider-label">{label}</span>
        <span className="slider-val">{value}</span>
      </div>
      <input
        type="range"
        min={min} max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  )
}

// ─── PAGE HEADER ───
export function PageHeader({ icon, title, subtitle }) {
  return (
    <div className="page-header">
      <div className="page-title">{icon && <span style={{ marginRight: 10 }}>{icon}</span>}<span>{title}</span></div>
      {subtitle && <div className="page-sub">{subtitle}</div>}
    </div>
  )
}

// ─── TOAST ───
export function Toast({ msg, onClose }) {
  return (
    <div className="toast" onClick={onClose}>{msg}</div>
  )
}

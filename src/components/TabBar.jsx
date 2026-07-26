import React from 'react'

const TABS = [
  { key: 'calc', label: 'คำนวณ', ico: '🧮' },
  { key: 'log', label: 'ประวัติ', ico: '📋' },
  { key: 'strategy', label: 'ความคุ้มค่า', ico: '💡' },
  { key: 'settings', label: 'ตั้งค่า', ico: '⚙️' },
]

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button
          key={t.key}
          className={active === t.key ? 'active' : ''}
          onClick={() => onChange(t.key)}
        >
          <span className="ico">{t.ico}</span>
          {t.label}
        </button>
      ))}
    </nav>
  )
}

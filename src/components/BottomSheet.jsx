import React from 'react'

export default function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="grabber" />
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  )
}

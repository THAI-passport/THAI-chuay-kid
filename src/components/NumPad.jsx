import React from 'react'

// On-screen numeric keypad (zero-dropdown, big tap targets).
// value is a string; onChange receives the new string.
export default function NumPad({ value, onChange }) {
  const press = (key) => {
    if (key === 'del') {
      onChange(value.slice(0, -1))
      return
    }
    if (key === '.') {
      if (value.includes('.')) return
      onChange((value === '' ? '0' : value) + '.')
      return
    }
    // limit to 2 decimals
    if (value.includes('.') && value.split('.')[1].length >= 2) return
    // avoid leading zeros like 00
    if (value === '0' && key !== '.') {
      onChange(key)
      return
    }
    onChange(value + key)
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del']
  return (
    <div className="numpad">
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          className={k === 'del' ? 'del' : ''}
          onClick={() => press(k)}
          aria-label={k === 'del' ? 'ลบ' : k}
        >
          {k === 'del' ? '⌫' : k}
        </button>
      ))}
    </div>
  )
}

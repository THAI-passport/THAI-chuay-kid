// Formatting + date helpers (Thai locale).

export function formatBaht(n) {
  const v = Number(n) || 0
  // Show up to 2 decimals but drop trailing .00 for whole baht.
  const rounded = Math.round(v * 100) / 100
  const str = Number.isInteger(rounded)
    ? rounded.toLocaleString('th-TH')
    : rounded.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `฿${str}`
}

export function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

// Local YYYY-MM-DD (not UTC) so "today" matches the user's calendar day.
export function localDayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function localMonthKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function isSameDay(iso, ref = new Date()) {
  return localDayKey(new Date(iso)) === localDayKey(ref)
}

export function isSameMonth(iso, ref = new Date()) {
  return localMonthKey(new Date(iso)) === localMonthKey(ref)
}

export function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

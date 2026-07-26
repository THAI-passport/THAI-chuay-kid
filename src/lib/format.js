// Formatting + date helpers. All "day" / "month" boundaries are computed in
// Thailand time (Asia/Bangkok, UTC+7) so daily/monthly resets happen at Thai
// midnight regardless of the visitor's device timezone. This is fully
// client-side and works on static hosting like GitHub Pages.

export const TZ = 'Asia/Bangkok'

export function formatBaht(n) {
  const v = Number(n) || 0
  const rounded = Math.round(v * 100) / 100
  const str = Number.isInteger(rounded)
    ? rounded.toLocaleString('th-TH')
    : rounded.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `฿${str}`
}

export function formatTime(iso) {
  try {
    return new Intl.DateTimeFormat('th-TH', {
      timeZone: TZ,
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

// Bangkok-local YYYY-MM-DD for any Date (en-CA yields ISO ordering).
export function bangkokDayKey(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

// Bangkok-local YYYY-MM.
export function bangkokMonthKey(d = new Date()) {
  return bangkokDayKey(d).slice(0, 7)
}

// Bangkok-local HH:mm (24h) — used to default the back-dated time picker.
export function bangkokTimeHM(d = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

export function isSameDay(iso, ref = new Date()) {
  return bangkokDayKey(new Date(iso)) === bangkokDayKey(ref)
}

export function isSameMonth(iso, ref = new Date()) {
  return bangkokMonthKey(new Date(iso)) === bangkokMonthKey(ref)
}

export function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

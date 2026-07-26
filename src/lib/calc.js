// Core domain logic for the ไทยช่วยไทย 60/40 co-payment scheme.
// Government subsidises 60% of an item's price, the user pays 40%,
// but the government share can never exceed the remaining daily or
// monthly subsidy cap. Any price beyond what the subsidy covers is
// charged 100% to the user.

export const GOV_RATE = 0.6 // government share
export const USER_RATE = 0.4 // user share
export const MAX_DAILY = 200 // program cap: max gov subsidy per day (baht)

// Clamp a numeric string to the 0..MAX_DAILY range, keeping it editable.
export function clampDaily(str) {
  const cleaned = String(str).replace(/[^0-9.]/g, '')
  if (cleaned === '') return ''
  const n = Number(cleaned)
  if (Number.isNaN(n)) return ''
  return n > MAX_DAILY ? String(MAX_DAILY) : cleaned
}

// Round to 2 decimals (satang) avoiding binary float drift.
export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/**
 * Compute the 60/40 split for a single purchase.
 * @param {number} price           item price (baht)
 * @param {number} remainingDaily  remaining daily gov subsidy (baht)
 * @param {number} remainingMonthly remaining monthly gov subsidy (baht)
 */
export function computeSplit(price, remainingDaily, remainingMonthly) {
  const p = Math.max(0, Number(price) || 0)
  const cap = Math.max(0, Math.min(remainingDaily, remainingMonthly))

  const idealGov = p * GOV_RATE
  const govPaid = round2(Math.min(idealGov, cap))
  const userPaid = round2(p - govPaid)

  // Portion of the price that still earns a subsidy vs. the 100%-user excess.
  const subsidisedPrice = round2(Math.min(p, cap / GOV_RATE))
  const excessPrice = round2(p - subsidisedPrice)

  return {
    price: round2(p),
    govPaid,
    userPaid,
    subsidisedPrice,
    excessPrice,
    // true when the subsidy cap clipped the government share
    capReached: idealGov > cap && cap >= 0 && p > 0,
    cap: round2(cap),
  }
}

/**
 * Minimum price needed to completely deplete the remaining daily subsidy.
 * gov = 0.6 * price, so price = remaining / 0.6.
 */
export function maxOutPrice(remainingDaily) {
  const r = Math.max(0, Number(remainingDaily) || 0)
  return round2(r / GOV_RATE)
}

/**
 * Given available cash and the remaining subsidy cap, the most expensive
 * single item the user can afford.
 *   - While the item is fully within subsidy range, user pays 40%:
 *       price = cash / 0.4  (valid while gov share 0.6*price <= remaining)
 *   - Once the subsidy is exhausted, every extra baht of price costs 1 baht:
 *       price = cash + remaining
 */
export function pocketMoneyPower(cash, remaining) {
  const c = Math.max(0, Number(cash) || 0)
  const r = Math.max(0, Number(remaining) || 0)
  // Crossover: at price = c/0.4, gov share = 1.5*c. Stay in subsidy range while 1.5c <= r.
  const withinSubsidy = 1.5 * c <= r
  const price = withinSubsidy ? c / USER_RATE : c + r
  return round2(price)
}

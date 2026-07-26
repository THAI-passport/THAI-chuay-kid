import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isSameDay, isSameMonth, uuid, bangkokDayKey, bangkokMonthKey } from '../lib/format'
import { round2, MAX_DAILY, MONTHLY_CAP } from '../lib/calc'

const clampDailyNum = (v) => Math.min(MAX_DAILY, Math.max(0, round2(Number(v) || 0)))

// Persisted to localStorage under "thai-chuay-kid".
export const useStore = create(
  persist(
    (set, get) => ({
      preferences: {
        useLogging: true,
        onboarded: false,
      },
      limits: {
        // The remaining amounts the user entered at setup, plus the Bangkok
        // day/month those entries belong to. After the setup day/month passes,
        // the caps reset to the full program amounts (MAX_DAILY / MONTHLY_CAP).
        baseMonthly: 1000,
        baseDaily: 200,
        setupDay: bangkokDayKey(),
        setupMonth: bangkokMonthKey(),
      },
      transactions: [],

      completeOnboarding: ({ baseMonthly, baseDaily, useLogging }) =>
        set((s) => ({
          limits: {
            baseMonthly: round2(Number(baseMonthly) || 0),
            baseDaily: clampDailyNum(baseDaily),
            setupDay: bangkokDayKey(),
            setupMonth: bangkokMonthKey(),
          },
          preferences: { ...s.preferences, useLogging: !!useLogging, onboarded: true },
        })),

      // Editing limits re-anchors the setup day/month to "now": the entered
      // values represent the user's remaining as of this moment.
      setLimits: ({ baseMonthly, baseDaily }) =>
        set(() => ({
          limits: {
            baseMonthly: round2(Number(baseMonthly) || 0),
            baseDaily: clampDailyNum(baseDaily),
            setupDay: bangkokDayKey(),
            setupMonth: bangkokMonthKey(),
          },
        })),

      setUseLogging: (useLogging) =>
        set((s) => ({ preferences: { ...s.preferences, useLogging: !!useLogging } })),

      addTransaction: ({ itemName, totalPrice, userPaid, govPaid, timestamp }) =>
        set((s) => ({
          transactions: [
            {
              id: uuid(),
              itemName: (itemName || '').trim(),
              totalPrice: round2(totalPrice),
              userPaid: round2(userPaid),
              govPaid: round2(govPaid),
              timestamp: timestamp || new Date().toISOString(),
            },
            ...s.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      resetAll: () =>
        set(() => ({
          preferences: { useLogging: true, onboarded: false },
          limits: {
            baseMonthly: 1000,
            baseDaily: 200,
            setupDay: bangkokDayKey(),
            setupMonth: bangkokMonthKey(),
          },
          transactions: [],
        })),
    }),
    {
      name: 'thai-chuay-kid',
      version: 2,
      // v1 stored only baseMonthly/baseDaily. Anchor the setup day/month to
      // now so the entered remaining applies to the current period.
      migrate: (persisted, version) => {
        if (!persisted) return persisted
        if (version < 2) {
          persisted.limits = {
            baseMonthly: persisted?.limits?.baseMonthly ?? 1000,
            baseDaily: persisted?.limits?.baseDaily ?? 200,
            setupDay: bangkokDayKey(),
            setupMonth: bangkokMonthKey(),
          }
        }
        return persisted
      },
    }
  )
)

// ---- Derived selectors (computed, not stored) ----

// The active cap for the current Bangkok day/month: the entered "remaining"
// during the setup period, otherwise the full program cap (a fresh day/month).
export function selectCaps(limits, ref = new Date()) {
  const dailyCap = bangkokDayKey(ref) === limits.setupDay ? limits.baseDaily : MAX_DAILY
  const monthlyCap = bangkokMonthKey(ref) === limits.setupMonth ? limits.baseMonthly : MONTHLY_CAP
  return { dailyCap: round2(dailyCap), monthlyCap: round2(monthlyCap) }
}

export function selectRemaining(state) {
  const { limits, transactions, preferences } = state
  const { dailyCap, monthlyCap } = selectCaps(limits)

  if (!preferences.useLogging) {
    return {
      remainingDaily: dailyCap,
      remainingMonthly: monthlyCap,
      usedDaily: 0,
      usedMonthly: 0,
      dailyCap,
      monthlyCap,
    }
  }

  const usedDaily = transactions
    .filter((t) => isSameDay(t.timestamp))
    .reduce((sum, t) => sum + t.govPaid, 0)
  const usedMonthly = transactions
    .filter((t) => isSameMonth(t.timestamp))
    .reduce((sum, t) => sum + t.govPaid, 0)

  return {
    remainingDaily: round2(Math.max(0, dailyCap - usedDaily)),
    remainingMonthly: round2(Math.max(0, monthlyCap - usedMonthly)),
    usedDaily: round2(usedDaily),
    usedMonthly: round2(usedMonthly),
    dailyCap,
    monthlyCap,
  }
}

export function selectTodayTransactions(state) {
  return state.transactions.filter((t) => isSameDay(t.timestamp))
}

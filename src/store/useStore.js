import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isSameDay, isSameMonth, uuid } from '../lib/format'
import { round2, MAX_DAILY } from '../lib/calc'

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
        baseMonthly: 1000, // remaining monthly gov subsidy entered at setup
        baseDaily: 200, // remaining daily gov subsidy entered at setup
      },
      transactions: [],

      completeOnboarding: ({ baseMonthly, baseDaily, useLogging }) =>
        set((s) => ({
          limits: {
            baseMonthly: round2(Number(baseMonthly) || 0),
            baseDaily: clampDailyNum(baseDaily),
          },
          preferences: { ...s.preferences, useLogging: !!useLogging, onboarded: true },
        })),

      setLimits: ({ baseMonthly, baseDaily }) =>
        set(() => ({
          limits: {
            baseMonthly: round2(Number(baseMonthly) || 0),
            baseDaily: clampDailyNum(baseDaily),
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
          limits: { baseMonthly: 1000, baseDaily: 200 },
          transactions: [],
        })),
    }),
    {
      name: 'thai-chuay-kid',
      version: 1,
    }
  )
)

// ---- Derived selectors (computed, not stored) ----

export function selectRemaining(state) {
  const { limits, transactions, preferences } = state
  if (!preferences.useLogging) {
    return { remainingDaily: limits.baseDaily, remainingMonthly: limits.baseMonthly, usedDaily: 0, usedMonthly: 0 }
  }
  const usedDaily = transactions
    .filter((t) => isSameDay(t.timestamp))
    .reduce((sum, t) => sum + t.govPaid, 0)
  const usedMonthly = transactions
    .filter((t) => isSameMonth(t.timestamp))
    .reduce((sum, t) => sum + t.govPaid, 0)
  return {
    remainingDaily: round2(Math.max(0, limits.baseDaily - usedDaily)),
    remainingMonthly: round2(Math.max(0, limits.baseMonthly - usedMonthly)),
    usedDaily: round2(usedDaily),
    usedMonthly: round2(usedMonthly),
  }
}

export function selectTodayTransactions(state) {
  return state.transactions.filter((t) => isSameDay(t.timestamp))
}

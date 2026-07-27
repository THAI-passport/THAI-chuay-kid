import React, { useMemo, useState } from 'react'
import { useStore, selectTodayTransactions } from '../store/useStore'
import { computeSplit } from '../lib/calc'
import { formatBaht, formatTime, isSameDay, isSameMonth, bangkokDayKey, bangkokTimeHM } from '../lib/format'
import { selectCaps } from '../store/useStore'
import BottomSheet from './BottomSheet'

// Remaining caps as of an arbitrary reference datetime (for back-dated entries),
// using the same per-period reset rules and Thailand-time day/month boundaries.
function remainingAt(state, refDate) {
  const { limits, transactions } = state
  const { dailyCap, monthlyCap } = selectCaps(limits, refDate)
  const usedDaily = transactions
    .filter((t) => isSameDay(t.timestamp, refDate))
    .reduce((s, t) => s + t.govPaid, 0)
  const usedMonthly = transactions
    .filter((t) => isSameMonth(t.timestamp, refDate))
    .reduce((s, t) => s + t.govPaid, 0)
  return {
    remainingDaily: Math.max(0, dailyCap - usedDaily),
    remainingMonthly: Math.max(0, monthlyCap - usedMonthly),
  }
}

export default function TransactionLog() {
  const state = useStore()
  const addTransaction = useStore((s) => s.addTransaction)
  const deleteTransaction = useStore((s) => s.deleteTransaction)
  const today = selectTodayTransactions(state)

  const [open, setOpen] = useState(false)
  const [price, setPrice] = useState('')
  const [name, setName] = useState('')
  const [date, setDate] = useState(bangkokDayKey())
  const [time, setTime] = useState(bangkokTimeHM())

  // Interpret the picked date/time as Bangkok wall-clock (+07:00) so the entry
  // lands on the intended Thai day regardless of the device's timezone.
  const refIso = useMemo(() => {
    const d = new Date(`${date}T${time || '12:00'}:00+07:00`)
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
  }, [date, time])

  const priceNum = Number(price) || 0
  const preview = useMemo(() => {
    const { remainingDaily, remainingMonthly } = remainingAt(state, new Date(refIso))
    return computeSplit(priceNum, remainingDaily, remainingMonthly)
  }, [priceNum, refIso, state])

  const save = () => {
    if (priceNum <= 0) return
    addTransaction({
      itemName: name,
      totalPrice: preview.price,
      userPaid: preview.userPaid,
      govPaid: preview.govPaid,
      timestamp: refIso,
    })
    setOpen(false)
    setName('')
    setPrice('')
  }

  return (
    <div className="screen">
      <div className="card">
        <h2>ประวัติการใช้สิทธิ์วันนี้</h2>
        {today.length === 0 ? (
          <div className="empty">ยังไม่มีรายการวันนี้</div>
        ) : (
          today.map((t) => (
            <div className="tx" key={t.id}>
              <div className="tx-main">
                <div className="tx-name">{t.itemName || 'รายการไม่มีชื่อ'}</div>
                <div className="tx-time">
                  {formatTime(t.timestamp)} · {formatBaht(t.totalPrice)}
                </div>
              </div>
              <div className="tx-badge">
                <div className="gov">รัฐช่วยจ่าย {formatBaht(t.govPaid)}</div>
                <div className="you">คุณจ่ายเอง {formatBaht(t.userPaid)}</div>
              </div>
              <button
                className="tx-del"
                aria-label="ลบรายการ"
                onClick={() => deleteTransaction(t.id)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ height: 8 }} />
      <button className="btn ghost" onClick={() => setOpen(true)}>
        + เพิ่มรายการย้อนหลัง
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="เพิ่มรายการย้อนหลัง">
        <label className="field-label">ราคาสินค้า (บาท)</label>
        <input
          className="text-input"
          type="text"
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder="0"
          autoFocus
        />
        <div style={{ height: 12 }} />
        <label className="field-label">ชื่อสินค้า (ไม่บังคับ)</label>
        <input
          className="text-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="เช่น หมูปิ้ง"
        />
        <div style={{ height: 12 }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label className="field-label">วันที่</label>
            <input
              className="text-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="field-label">เวลา</label>
            <input
              className="text-input"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="split" style={{ marginTop: 14 }}>
          <div className="box gov">
            <div className="k">รัฐช่วยจ่าย</div>
            <div className="v">{formatBaht(preview.govPaid)}</div>
          </div>
          <div className="box user">
            <div className="k">คุณจ่ายเอง</div>
            <div className="v">{formatBaht(preview.userPaid)}</div>
          </div>
        </div>
        {preview.excessPrice > 0 && (
          <div className="excess-warn">
            เกินสิทธิ์ {formatBaht(preview.excessPrice)} — จ่ายเอง 100%
          </div>
        )}
        <div style={{ height: 14 }} />
        <button className="btn success" disabled={priceNum <= 0} onClick={save}>
          บันทึกรายการ
        </button>
      </BottomSheet>
    </div>
  )
}

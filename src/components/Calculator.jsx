import React, { useMemo, useState } from 'react'
import { useStore, selectRemaining } from '../store/useStore'
import { computeSplit } from '../lib/calc'
import { formatBaht } from '../lib/format'
import NumPad from './NumPad'
import BottomSheet from './BottomSheet'

export default function Calculator() {
  const state = useStore()
  const addTransaction = useStore((s) => s.addTransaction)
  const useLogging = state.preferences.useLogging
  const { remainingDaily, remainingMonthly } = selectRemaining(state)

  const [price, setPrice] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const priceNum = Number(price) || 0
  const split = useMemo(
    () => computeSplit(priceNum, remainingDaily, remainingMonthly),
    [priceNum, remainingDaily, remainingMonthly]
  )

  const canSave = priceNum > 0

  const confirmSave = () => {
    addTransaction({
      itemName,
      totalPrice: split.price,
      userPaid: split.userPaid,
      govPaid: split.govPaid,
    })
    setSheetOpen(false)
    setItemName('')
    setPrice('')
  }

  return (
    <div className="screen">
      <div className="card">
        <span className="field-label">ราคาสินค้า</span>
        <div className="price-display">
          <div className="amount">{formatBaht(priceNum)}</div>
          <div className="hint">กดตัวเลขเพื่อใส่ราคา</div>
        </div>

        <div className="split">
          <div className="box gov">
            <div className="k">รัฐช่วยจ่าย (60%)</div>
            <div className="v">{formatBaht(split.govPaid)}</div>
          </div>
          <div className="box user">
            <div className="k">คุณจ่ายเอง (40%)</div>
            <div className="v">{formatBaht(split.userPaid)}</div>
          </div>
        </div>

        {split.excessPrice > 0 && (
          <div className="excess-warn">
            เกินสิทธิ์ {formatBaht(split.excessPrice)} — ส่วนนี้คุณจ่ายเอง 100%
          </div>
        )}

        <NumPad value={price} onChange={setPrice} />
      </div>

      <div style={{ height: 8 }} />
      <button
        className="btn success"
        disabled={!canSave}
        onClick={() => (useLogging ? setSheetOpen(true) : confirmSave())}
      >
        บันทึกการใช้จ่าย
      </button>
      {!useLogging && (
        <div className="muted-note">
          ระบบบันทึกรายการปิดอยู่ — การคำนวณจะไม่ถูกเก็บ เปิดใช้งานได้ที่แท็บ “ตั้งค่า”
        </div>
      )}

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="บันทึกรายการ"
      >
        <label className="field-label">ชื่อสินค้า (ไม่บังคับ)</label>
        <input
          className="text-input"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="เช่น หมูปิ้ง, ข้าวมันไก่"
          autoFocus
        />
        <div className="split" style={{ marginTop: 14 }}>
          <div className="box gov">
            <div className="k">รัฐช่วยจ่าย</div>
            <div className="v">{formatBaht(split.govPaid)}</div>
          </div>
          <div className="box user">
            <div className="k">คุณจ่ายเอง</div>
            <div className="v">{formatBaht(split.userPaid)}</div>
          </div>
        </div>
        <div style={{ height: 14 }} />
        <button className="btn success" onClick={confirmSave}>
          บันทึกรายการ
        </button>
      </BottomSheet>
    </div>
  )
}

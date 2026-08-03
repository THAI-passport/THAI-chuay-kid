import React, { useMemo, useState } from 'react'
import { useStore, selectRemaining } from '../store/useStore'
import { maxOutPrice, computeSplit, MAX_DAILY, clampDaily } from '../lib/calc'
import { formatBaht } from '../lib/format'
import SegmentedControl from './SegmentedControl'

export default function Strategic() {
  const state = useStore()
  const { remainingDaily, remainingMonthly } = selectRemaining(state)
  const effectiveRemaining = Math.min(remainingDaily, remainingMonthly)

  const [mode, setMode] = useState('maxout')
  const [credit, setCredit] = useState('')

  // Max Out — uses the app's tracked remaining subsidy automatically.
  const maxOut = useMemo(() => maxOutPrice(effectiveRemaining), [effectiveRemaining])
  const maxOutSplit = useMemo(
    () => computeSplit(maxOut, remainingDaily, remainingMonthly),
    [maxOut, remainingDaily, remainingMonthly]
  )

  // "I have this much subsidy" — user enters their remaining gov subsidy
  // (สิทธิ์, capped at ฿200/day); we show the item price it can cover.
  const creditNum = Number(credit) || 0
  const item = useMemo(() => maxOutPrice(creditNum), [creditNum])
  const itemSplit = useMemo(
    () => computeSplit(item, creditNum, creditNum),
    [item, creditNum]
  )

  return (
    <div className="screen">
      <div className="card">
        <h2>คำนวณความคุ้มค่า</h2>
        <SegmentedControl
          options={[
            { value: 'maxout', label: 'ใช้สิทธิ์ให้คุ้ม' },
            { value: 'pocket', label: 'มีสิทธิ์เท่านี้' },
          ]}
          value={mode}
          onChange={setMode}
        />

        {mode === 'maxout' ? (
          <>
            <div className="muted-note" style={{ marginTop: 14 }}>
              ราคาสินค้าที่ทำให้ใช้สิทธิ์วันนี้หมดพอดี (สิทธิ์คงเหลือ {formatBaht(effectiveRemaining)})
            </div>
            <div className="result-big">
              <div className="k">ซื้อของราคาประมาณ</div>
              <div className="v">{formatBaht(maxOut)}</div>
            </div>
            <div className="split" style={{ marginTop: 12 }}>
              <div className="box gov">
                <div className="k">รัฐช่วยจ่าย</div>
                <div className="v">{formatBaht(maxOutSplit.govPaid)}</div>
              </div>
              <div className="box user">
                <div className="k">คุณจ่ายเอง</div>
                <div className="v">{formatBaht(maxOutSplit.userPaid)}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <label className="field-label" style={{ marginTop: 14 }}>
              สิทธิ์ที่มี (บาท)
            </label>
            <input
              className="text-input"
              type="text"
              inputMode="decimal"
              value={credit}
              onChange={(e) => setCredit(clampDaily(e.target.value))}
              placeholder="0"
            />
            <div className="muted-note">สูงสุด {MAX_DAILY} บาทต่อวัน</div>
            <div className="result-big">
              <div className="k">ซื้อของได้สูงสุดถึง</div>
              <div className="v">{formatBaht(item)}</div>
            </div>
            <div className="split" style={{ marginTop: 12 }}>
              <div className="box gov">
                <div className="k">รัฐช่วยจ่าย</div>
                <div className="v">{formatBaht(itemSplit.govPaid)}</div>
              </div>
              <div className="box user">
                <div className="k">คุณจ่ายเอง</div>
                <div className="v">{formatBaht(itemSplit.userPaid)}</div>
              </div>
            </div>
            <div className="muted-note">
              คำนวณจากสิทธิ์รัฐช่วยจ่ายที่คุณมี — รัฐช่วย 60% คุณจ่ายเอง 40%
            </div>
          </>
        )}
      </div>
    </div>
  )
}

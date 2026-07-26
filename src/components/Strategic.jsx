import React, { useMemo, useState } from 'react'
import { useStore, selectRemaining } from '../store/useStore'
import { maxOutPrice, pocketMoneyPower, computeSplit } from '../lib/calc'
import { formatBaht } from '../lib/format'
import SegmentedControl from './SegmentedControl'

export default function Strategic() {
  const state = useStore()
  const { remainingDaily, remainingMonthly } = selectRemaining(state)
  const effectiveRemaining = Math.min(remainingDaily, remainingMonthly)

  const [mode, setMode] = useState('maxout')
  const [cash, setCash] = useState('')

  const maxOut = useMemo(() => maxOutPrice(effectiveRemaining), [effectiveRemaining])
  const maxOutSplit = useMemo(
    () => computeSplit(maxOut, remainingDaily, remainingMonthly),
    [maxOut, remainingDaily, remainingMonthly]
  )

  const cashNum = Number(cash) || 0
  const power = useMemo(
    () => pocketMoneyPower(cashNum, effectiveRemaining),
    [cashNum, effectiveRemaining]
  )
  const powerSplit = useMemo(
    () => computeSplit(power, remainingDaily, remainingMonthly),
    [power, remainingDaily, remainingMonthly]
  )

  return (
    <div className="screen">
      <div className="card">
        <h2>คำนวณความคุ้มค่า</h2>
        <SegmentedControl
          options={[
            { value: 'maxout', label: 'ใช้สิทธิ์ให้คุ้ม' },
            { value: 'pocket', label: 'มีเงินเท่านี้' },
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
              เงินที่มีในกระเป๋า (บาท)
            </label>
            <input
              className="text-input"
              type="tel"
              inputMode="numeric"
              value={cash}
              onChange={(e) => setCash(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0"
            />
            <div className="result-big">
              <div className="k">ซื้อของได้สูงสุดถึง</div>
              <div className="v">{formatBaht(power)}</div>
            </div>
            <div className="split" style={{ marginTop: 12 }}>
              <div className="box gov">
                <div className="k">รัฐช่วยจ่าย</div>
                <div className="v">{formatBaht(powerSplit.govPaid)}</div>
              </div>
              <div className="box user">
                <div className="k">คุณจ่ายเอง</div>
                <div className="v">{formatBaht(powerSplit.userPaid)}</div>
              </div>
            </div>
            <div className="muted-note">
              รวมเงินสดของคุณกับสิทธิ์รัฐช่วยจ่ายที่เหลืออยู่ ({formatBaht(effectiveRemaining)})
            </div>
          </>
        )}
      </div>
    </div>
  )
}

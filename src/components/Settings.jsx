import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { clampDaily, MAX_DAILY } from '../lib/calc'

export default function Settings() {
  const state = useStore()
  const setLimits = useStore((s) => s.setLimits)
  const setUseLogging = useStore((s) => s.setUseLogging)
  const resetAll = useStore((s) => s.resetAll)

  const [monthly, setMonthly] = useState(String(state.limits.baseMonthly))
  const [daily, setDaily] = useState(String(state.limits.baseDaily))
  const [saved, setSaved] = useState(false)

  const save = () => {
    setLimits({ baseMonthly: Number(monthly) || 0, baseDaily: Number(daily) || 0 })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const confirmReset = () => {
    if (window.confirm('ล้างข้อมูลทั้งหมดและเริ่มตั้งค่าใหม่?')) resetAll()
  }

  return (
    <div className="screen">
      <div className="card">
        <h2>ตั้งค่าสิทธิ์</h2>
        <label className="field-label">สิทธิ์คงเหลือเดือนนี้ (บาท)</label>
        <input
          className="text-input"
          type="tel"
          inputMode="numeric"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value.replace(/[^0-9.]/g, ''))}
        />
        <div style={{ height: 12 }} />
        <label className="field-label">สิทธิ์คงเหลือวันนี้ (บาท)</label>
        <input
          className="text-input"
          type="tel"
          inputMode="numeric"
          value={daily}
          onChange={(e) => setDaily(clampDaily(e.target.value))}
        />
        <div className="muted-note">สูงสุด {MAX_DAILY} บาทต่อวัน</div>
        <div style={{ height: 14 }} />
        <button className="btn" onClick={save}>
          {saved ? 'บันทึกแล้ว ✓' : 'บันทึกการตั้งค่า'}
        </button>
      </div>

      <div className="card">
        <div className="toggle-row">
          <div>
            <div style={{ fontWeight: 600 }}>ระบบบันทึกรายการ</div>
            <div className="muted-note" style={{ marginTop: 2 }}>
              คำนวณสิทธิ์คงเหลือให้อัตโนมัติจากรายการที่บันทึก
            </div>
          </div>
          <button
            type="button"
            className={`switch ${state.preferences.useLogging ? 'on' : ''}`}
            aria-label="สลับระบบบันทึกรายการ"
            onClick={() => setUseLogging(!state.preferences.useLogging)}
          />
        </div>
      </div>

      <div className="card">
        <button className="btn danger" onClick={confirmReset}>
          ล้างข้อมูลทั้งหมด
        </button>
        <div className="muted-note">
          ข้อมูลทั้งหมดถูกเก็บในเครื่องของคุณเท่านั้น (localStorage) ไม่มีการส่งออกไปยังเซิร์ฟเวอร์
        </div>
      </div>
    </div>
  )
}

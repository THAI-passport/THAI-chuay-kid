import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { clampDaily, MAX_DAILY } from '../lib/calc'

export default function Onboarding() {
  const completeOnboarding = useStore((s) => s.completeOnboarding)
  const [monthly, setMonthly] = useState('1000')
  const [daily, setDaily] = useState('200')
  const [useLogging, setUseLogging] = useState(true)

  const submit = () => {
    completeOnboarding({
      baseMonthly: Number(monthly) || 0,
      baseDaily: Number(daily) || 0,
      useLogging,
    })
  }

  return (
    <div className="app-frame">
      <div className="app">
        <div className="app-header">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <span className="r" />
              <span className="w" />
              <span className="b" />
              <span className="w" />
              <span className="r" />
            </div>
            <h1>
              <span className="brand-en">THAI</span>
              <span className="brand-th">ช่วยคิด</span>
            </h1>
          </div>
          <div className="sub">ตั้งค่าสิทธิ์ ไทยช่วยไทย 60/40 ของคุณ</div>
        </div>
        <div className="screen">
          <div className="card">
            <h2>สิทธิ์คงเหลือของคุณตอนนี้</h2>
            <label className="field-label">สิทธิ์คงเหลือเดือนนี้ (บาท)</label>
            <input
              className="text-input"
              type="tel"
              inputMode="numeric"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="1000"
            />
            <div style={{ height: 12 }} />
            <label className="field-label">สิทธิ์คงเหลือวันนี้ (บาท)</label>
            <input
              className="text-input"
              type="tel"
              inputMode="numeric"
              value={daily}
              onChange={(e) => setDaily(clampDaily(e.target.value))}
              placeholder="200"
            />
            <div className="muted-note">สูงสุด {MAX_DAILY} บาทต่อวัน</div>
          </div>

          <div className="card">
            <div className="banner">
              แนะนำให้เปิดระบบบันทึกรายการ เพื่อให้ระบบคำนวณสิทธิ์คงเหลือรายวันและรายเดือนให้อัตโนมัติ
              โดยข้อมูลจะถูกเก็บไว้ในเครื่องของคุณเท่านั้น
            </div>
            <div style={{ height: 12 }} />
            <div className="toggle-row">
              <span style={{ fontWeight: 600 }}>เปิดระบบบันทึกรายการ</span>
              <button
                type="button"
                className={`switch ${useLogging ? 'on' : ''}`}
                aria-label="สลับระบบบันทึกรายการ"
                onClick={() => setUseLogging((v) => !v)}
              />
            </div>
          </div>

          <div style={{ height: 8 }} />
          <button className="btn" onClick={submit}>
            เริ่มใช้งาน
          </button>
        </div>
      </div>
    </div>
  )
}

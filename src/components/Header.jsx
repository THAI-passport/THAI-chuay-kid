import React from 'react'
import { useStore, selectRemaining } from '../store/useStore'
import { formatBaht } from '../lib/format'

export default function Header() {
  const state = useStore()
  const { remainingDaily, remainingMonthly, dailyCap, monthlyCap } = selectRemaining(state)

  const pct = (rem, cap) => (cap > 0 ? Math.max(0, Math.min(100, (rem / cap) * 100)) : 0)

  return (
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
      <div className="sub">ไทยช่วยไทย 60/40</div>
      <div className="balances">
        <div className="balance">
          <div className="label">สิทธิ์คงเหลือวันนี้</div>
          <div className="value">{formatBaht(remainingDaily)}</div>
          <div className="bar">
            <span style={{ width: `${pct(remainingDaily, dailyCap)}%` }} />
          </div>
        </div>
        <div className="balance">
          <div className="label">สิทธิ์คงเหลือเดือนนี้</div>
          <div className="value">{formatBaht(remainingMonthly)}</div>
          <div className="bar">
            <span style={{ width: `${pct(remainingMonthly, monthlyCap)}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

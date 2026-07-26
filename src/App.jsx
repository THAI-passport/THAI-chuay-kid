import React, { useState } from 'react'
import { useStore } from './store/useStore'
import Onboarding from './components/Onboarding'
import Header from './components/Header'
import TabBar from './components/TabBar'
import Calculator from './components/Calculator'
import TransactionLog from './components/TransactionLog'
import Strategic from './components/Strategic'
import Settings from './components/Settings'

export default function App() {
  const onboarded = useStore((s) => s.preferences.onboarded)
  const [tab, setTab] = useState('calc')

  if (!onboarded) return <Onboarding />

  return (
    <div className="app-frame">
      <div className="app">
        <Header />
        {tab === 'calc' && <Calculator />}
        {tab === 'log' && <TransactionLog />}
        {tab === 'strategy' && <Strategic />}
        {tab === 'settings' && <Settings />}
        <TabBar active={tab} onChange={setTab} />
      </div>
    </div>
  )
}

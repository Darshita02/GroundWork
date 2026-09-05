import React, { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import ScorePanel from './components/ScorePanel.jsx'
import Ledger from './components/Ledger.jsx'
import AddTransaction from './components/AddTransaction.jsx'

const USER_ID = 'meena_r'

export default function App() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)

  const loadScore = () => {
    fetch(`http://localhost:8000/score/${USER_ID}`)
      .then(res => {
        if (!res.ok) throw new Error('Request failed')
        return res.json()
      })
      .then(setProfile)
      .catch(err => setError(err.message))
  }

  useEffect(() => {
    loadScore()
  }, [])

  if (error) return <p style={{ padding: 40 }}>Couldn't load score: {error}</p>
  if (!profile) return <p style={{ padding: 40 }}>Loading score…</p>

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 24px 80px' }}>
      <Header profile={profile} />
      <ScorePanel profile={profile} />
      <AddTransaction userId={USER_ID} onScoreUpdate={setProfile} />
      <Ledger entries={profile.ledger} />
    </div>
  )
}
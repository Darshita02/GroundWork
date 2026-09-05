import React, { useState } from 'react'

export default function AddTransaction({ userId, onScoreUpdate }) {
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('credit')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!desc || !amount) return
    setSubmitting(true)
    try {
      const today = new Date().toISOString().slice(0, 10)
      const res = await fetch(`http://localhost:8000/transactions/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: today,
          desc,
          amount: type === 'debit' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
          type
        })
      })
      if (!res.ok) throw new Error('Failed to add transaction')
      const updated = await res.json()
      onScoreUpdate(updated)
      setDesc('')
      setAmount('')
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section style={{ padding: '24px 0', borderTop: '1px solid var(--rule)' }}>
      <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--ink-soft)' }}>
        Add a transaction — watch the score respond
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Description (e.g. Daily UPI collections)"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          style={{
            flex: '1 1 240px',
            padding: '8px 10px',
            border: '1px solid var(--rule)',
            borderRadius: 6,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            background: 'white'
          }}
        />
        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{
            width: 110,
            padding: '8px 10px',
            border: '1px solid var(--rule)',
            borderRadius: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            background: 'white'
          }}
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          style={{
            padding: '8px 10px',
            border: '1px solid var(--rule)',
            borderRadius: 6,
            fontSize: 14,
            background: 'white'
          }}
        >
          <option value="credit">Credit (income)</option>
          <option value="debit">Debit (expense)</option>
        </select>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            padding: '8px 16px',
            background: 'var(--sprout)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? 'Updating…' : 'Add & recalculate'}
        </button>
      </div>
    </section>
  )
}
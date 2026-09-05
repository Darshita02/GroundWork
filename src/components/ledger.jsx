import React from 'react'
export default function Ledger({ entries }) {
  return (
    <section style={{ padding: '32px 0' }}>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--ink-soft)' }}>
        Recent activity feeding the score
      </p>
      <div>
        {entries.map((e, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '110px 1fr 100px',
            gap: 16,
            padding: '12px 0',
            borderTop: '1px solid var(--rule)',
            fontSize: 14
          }}>
            <span className="mono" style={{ color: 'var(--ink-soft)' }}>{e.date}</span>
            <span>{e.desc}</span>
            <span className="mono" style={{
              textAlign: 'right',
              color: e.type === 'credit' ? 'var(--sprout)' : 'var(--ink-soft)'
            }}>
              {e.type === 'credit' ? '+' : ''}₹{Math.abs(e.amount).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
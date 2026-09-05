import React from 'react'
export default function ScorePanel({ profile }) {
  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      gap: '48px',
      alignItems: 'start',
      padding: '40px 0',
      borderBottom: '1px solid var(--rule)'
    }}>
      <div>
        <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--ink-soft)' }}>
          Groundwork score
        </p>
        <p className="mono" style={{
          fontSize: 72,
          fontWeight: 500,
          margin: 0,
          color: 'var(--gold)',
          lineHeight: 1
        }}>
          {profile.score}
        </p>
        <p style={{ margin: '10px 0 0', fontSize: 14, color: 'var(--sprout)' }}>
          {profile.scoreLabel}
        </p>
        <p style={{ margin: '18px 0 0', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, maxWidth: 220 }}>
          Built from {profile.monthsTracked} months of real transaction behavior —
          no bureau file required.
        </p>
      </div>

      <div>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--ink-soft)' }}>
          What this score is built on
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {profile.factors.map((f, i) => (
            <div key={f.id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 60px',
              alignItems: 'center',
              gap: 16,
              padding: '14px 0',
              borderTop: i === 0 ? 'none' : '1px solid var(--rule)'
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 15 }}>{f.label}</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-soft)', maxWidth: 480 }}>
                  {f.detail}
                </p>
              </div>
              <p className="mono" style={{
                margin: 0,
                textAlign: 'right',
                fontSize: 15,
                color: f.weight < 0 ? 'var(--clay)' : 'var(--sprout)'
              }}>
                {f.weight > 0 ? '+' : ''}{f.weight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
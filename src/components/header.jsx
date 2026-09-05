import React from 'react'
export default function Header({ profile }) {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingTop: 40
    }}>
      <div>
        <p className="serif" style={{
          fontSize: 28,
          margin: 0,
          fontWeight: 500,
          letterSpacing: '-0.01em'
        }}>
          Groundwork
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--ink-soft)' }}>
          Credit visibility, built from real activity — not a bureau file.
        </p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: 0, fontSize: 15 }}>{profile.name}</p>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-soft)' }}>{profile.role}</p>
      </div>
    </header>
  )
}
import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="card" style={{ width: 380 }}>
        <h1
          style={{
            textAlign: 'center',
            marginBottom: 24,
            fontSize: '2rem',
            background: 'linear-gradient(120deg, var(--accent-1), var(--accent-2))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          TeamUp
        </h1>
        {children}
      </div>
    </div>
  );
}

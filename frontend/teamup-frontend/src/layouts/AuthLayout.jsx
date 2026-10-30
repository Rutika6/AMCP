import React from 'react';

export default function AuthLayout({ children }) {
  return <div className="auth-page"><div className="auth-card"><h1>TeamUp</h1>{children}</div></div>;
}

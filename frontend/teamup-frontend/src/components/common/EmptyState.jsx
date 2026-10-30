import React from 'react';

export default function EmptyState({ title, children, action }) {
  return <div className="empty-state"><h3>{title}</h3>{children && <p className="muted">{children}</p>}{action}</div>;
}

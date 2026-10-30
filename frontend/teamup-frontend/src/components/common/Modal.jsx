import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return <div className="modal-backdrop" onMouseDown={onClose}>
    <section className="modal-panel" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 18 }}><h2 style={{ margin: 0 }}>{title}</h2><button type="button" className="btn btn-secondary" onClick={onClose} aria-label="Close dialog">Close</button></div>
      {children}
    </section>
  </div>;
}

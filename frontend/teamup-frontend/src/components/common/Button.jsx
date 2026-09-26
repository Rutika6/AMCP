import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
    >
      {children}
    </button>
  );
}

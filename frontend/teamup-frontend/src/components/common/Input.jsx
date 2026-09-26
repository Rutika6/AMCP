import React from 'react';

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  min,
}) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        style={{
          width: '100%',
          borderColor: error ? 'var(--color-danger)' : undefined,
        }}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

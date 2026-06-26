import React from 'react';

export function Button({ children, onClick, type = 'button', disabled = false, style = {} }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#0066cc',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontSize: '1rem',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  style = {},
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      style={{
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '1rem',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    />
  );
}

export function Badge({ children, type = 'default', style = {} }) {
  const typeStyles = {
    default: { backgroundColor: '#e0e0e0', color: '#333' },
    success: { backgroundColor: '#4caf50', color: '#fff' },
    warning: { backgroundColor: '#ff9800', color: '#fff' },
    error: { backgroundColor: '#f44336', color: '#fff' },
    info: { backgroundColor: '#2196f3', color: '#fff' },
  };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '16px',
        fontSize: '0.875rem',
        fontWeight: '600',
        ...typeStyles[type],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '90%',
          padding: '2rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}

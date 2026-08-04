import React from 'react';

const Input = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className={`input-wrapper ${className}`} style={{ marginBottom: '1rem' }}>
      {label && (
        <label htmlFor={id} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-main)' }}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={`input-field ${error ? 'input-error' : ''}`}
        style={{ ...(error ? { borderColor: '#ef4444' } : {}) }}
        {...props}
      />
      {error && (
        <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;

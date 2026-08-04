import React from 'react';

const Spinner = ({ size = 'md', color = 'var(--color-primary)' }) => {
  const sizeMap = {
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px'
  };

  const spinnerStyle = {
    width: sizeMap[size],
    height: sizeMap[size],
    border: `3px solid ${color}40`,
    borderTopColor: color,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: 'inline-block'
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle} role="status" aria-label="Loading..." />
    </>
  );
};

export default Spinner;

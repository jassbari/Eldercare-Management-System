import React from 'react';

const Skeleton = ({ width = '100%', height = '20px', borderRadius = 'var(--radius-md)', className = '' }) => {
  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .skeleton-loader {
            background: #f6f7f8;
            background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
            background-size: 1000px 100%;
            animation: shimmer 2s infinite linear forwards;
          }
        `}
      </style>
      <div 
        className={`skeleton-loader ${className}`}
        style={{ width, height, borderRadius }}
      />
    </>
  );
};

export default Skeleton;

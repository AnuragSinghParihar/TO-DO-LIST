import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner-ring">
        <div></div><div></div><div></div><div></div>
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

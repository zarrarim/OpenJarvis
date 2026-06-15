import React, { useEffect } from 'react';
import { useStore } from '../store/store';
import './ErrorDisplay.css';

function ErrorDisplay({ error }) {
  const { clearError } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      clearError();
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, clearError]);

  return (
    <div className="error-display">
      <span className="error-icon">⚠️</span>
      <span className="error-text">{error}</span>
      <button className="error-close" onClick={clearError}>✕</button>
    </div>
  );
}

export default ErrorDisplay;

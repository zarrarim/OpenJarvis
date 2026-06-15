import React from 'react';
import { useStore } from '../store/store';
import './VoiceButton.css';

function VoiceButton() {
  const { isListening, isProcessing, startListening, stopListening } = useStore();

  const handleMouseDown = () => {
    if (!isProcessing) {
      startListening();
    }
  };

  const handleMouseUp = () => {
    stopListening();
  };

  const handleTouchStart = () => {
    if (!isProcessing) {
      startListening();
    }
  };

  const handleTouchEnd = () => {
    stopListening();
  };

  return (
    <button
      className={`voice-button ${isListening ? 'listening' : ''} ${isProcessing ? 'disabled' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={isProcessing}
      title="Press and hold to speak"
    >
      <div className="voice-button-inner">
        <span className="microphone-icon">🎤</span>
      </div>
      <div className="voice-button-ring"></div>
      <div className="voice-button-ring-2"></div>
    </button>
  );
}

export default VoiceButton;

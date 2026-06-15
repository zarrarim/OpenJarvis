import React from 'react';
import './TranscriptDisplay.css';

function TranscriptDisplay({ transcript }) {
  if (!transcript) return null;

  return (
    <div className="transcript-display">
      <span className="transcript-label">Hearing:</span>
      <span className="transcript-text">{transcript}</span>
    </div>
  );
}

export default TranscriptDisplay;

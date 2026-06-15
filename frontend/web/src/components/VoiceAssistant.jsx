import React, { useEffect } from 'react';
import { useStore } from '../store/store';
import VoiceButton from './VoiceButton';
import MessageDisplay from './MessageDisplay';
import TranscriptDisplay from './TranscriptDisplay';
import ErrorDisplay from './ErrorDisplay';
import './VoiceAssistant.css';

function VoiceAssistant() {
  const {
    isListening,
    isProcessing,
    isSpeaking,
    messages,
    transcript,
    error,
    serverConnected,
    initializeSpeechRecognition,
  } = useStore();

  useEffect(() => {
    initializeSpeechRecognition();
  }, [initializeSpeechRecognition]);

  return (
    <div className="voice-assistant">
      <div className="voice-assistant-header">
        <div className="logo-section">
          <h1>🎤 Jarvis</h1>
          <p className="subtitle">Voice-First AI Assistant</p>
        </div>
        <div className="status-indicators">
          <div className={`status-dot ${serverConnected ? 'connected' : 'disconnected'}`}></div>
          <span className="status-text">{serverConnected ? 'Connected' : 'Offline'}</span>
        </div>
      </div>

      <div className="voice-assistant-content">
        <MessageDisplay messages={messages} />
        
        <div className="voice-controls">
          <VoiceButton />
          
          {isListening && <div className="listening-indicator">🎤 Listening...</div>}
          {isProcessing && <div className="processing-indicator">⏳ Processing...</div>}
          {isSpeaking && <div className="speaking-indicator">🔊 Speaking...</div>}
        </div>

        <TranscriptDisplay transcript={transcript} />
      </div>

      {error && <ErrorDisplay error={error} />}

      <div className="voice-assistant-footer">
        <p>Click the microphone button and speak naturally. Your voice will be transcribed and processed by Jarvis.</p>
      </div>
    </div>
  );
}

export default VoiceAssistant;

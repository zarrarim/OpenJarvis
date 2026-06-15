import React, { useEffect, useRef } from 'react';
import './MessageDisplay.css';

function MessageDisplay({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="messages-empty">
        <p>👋 Welcome to Jarvis!</p>
        <p>Press and hold the microphone button to speak.</p>
      </div>
    );
  }

  return (
    <div className="messages-container">
      {messages.map((msg, idx) => (
        <div key={idx} className={`message message-${msg.type}`}>
          <div className="message-content">{msg.text}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageDisplay;

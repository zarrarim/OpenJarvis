import React, { useEffect } from 'react';
import VoiceAssistant from './components/VoiceAssistant';
import { useStore } from './store/store';
import './App.css';

function App() {
  const { initializeConnection } = useStore();

  useEffect(() => {
    initializeConnection();
  }, [initializeConnection]);

  return (
    <div className="app-container">
      <VoiceAssistant />
    </div>
  );
}

export default App;

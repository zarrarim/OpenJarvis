import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const useStore = create((set, get) => ({
  // State
  messages: [],
  isListening: false,
  isProcessing: false,
  isSpeaking: false,
  recognition: null,
  synthesis: window.speechSynthesis,
  transcript: '',
  error: null,
  serverConnected: false,

  // Initialize connection
  initializeConnection: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      set({ serverConnected: response.status === 200 });
    } catch (err) {
      console.error('Server connection failed:', err);
      set({ serverConnected: false });
    }
  },

  // Initialize speech recognition
  initializeSpeechRecognition: () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => set({ isListening: true });
      recognition.onend = () => set({ isListening: false });
      recognition.onerror = (event) => set({ error: event.error });
      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            set({ transcript });
            get().processVoiceInput(transcript);
          } else {
            interim += transcript;
          }
        }
        if (interim) set({ transcript: interim });
      };

      set({ recognition });
      return recognition;
    }
    set({ error: 'Speech Recognition not supported in this browser' });
    return null;
  },

  // Start listening
  startListening: () => {
    const { recognition } = get();
    if (!recognition) {
      get().initializeSpeechRecognition();
    }
    get().recognition?.start();
  },

  // Stop listening
  stopListening: () => {
    get().recognition?.stop();
  },

  // Process voice input
  processVoiceInput: async (voiceText) => {
    set({ isProcessing: true, transcript: '' });
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: voiceText,
        agent: 'orchestrator',
        stream: false,
      });

      const assistantMessage = response.data.response;
      set((state) => ({
        messages: [...state.messages, 
          { type: 'user', text: voiceText },
          { type: 'assistant', text: assistantMessage }
        ],
        isProcessing: false,
      }));

      // Speak the response
      get().speakText(assistantMessage);
    } catch (err) {
      set({ error: err.message, isProcessing: false });
      get().speakText('Sorry, I encountered an error. Please try again.');
    }
  },

  // Text-to-speech
  speakText: (text) => {
    const { synthesis } = get();
    if (!synthesis) return;

    // Cancel any ongoing speech
    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => set({ isSpeaking: true });
    utterance.onend = () => set({ isSpeaking: false });
    utterance.onerror = (event) => set({ error: `Speech error: ${event.error}` });

    synthesis.speak(utterance);
  },

  // Clear messages
  clearMessages: () => set({ messages: [], error: null }),

  // Clear error
  clearError: () => set({ error: null }),
}));

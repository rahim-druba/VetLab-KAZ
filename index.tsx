import React from 'react';
import ReactDOM from 'react-dom/client';
import { setDefaultBaseUrls } from '@google/genai';
import App from './App';

// In dev, use Vite proxy to avoid CORS "Failed to fetch" when calling Gemini API
if (import.meta.env.DEV && typeof window !== 'undefined') {
  setDefaultBaseUrls({ geminiUrl: window.location.origin + '/api/gemini' });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

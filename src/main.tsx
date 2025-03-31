
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure dark/light mode persistence
const darkModePreference = localStorage.getItem('darkMode');
if (darkModePreference === 'true' || 
    (!darkModePreference && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
}

// Initialize app
createRoot(document.getElementById("root")!).render(<App />);

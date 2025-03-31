
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure dark/light mode persistence
const darkModePreference = localStorage.getItem('darkMode');
if (darkModePreference === 'true') {
  document.documentElement.classList.add('dark');
} else if (darkModePreference === 'false') {
  document.documentElement.classList.remove('dark');
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  // If no preference is stored but system prefers dark
  document.documentElement.classList.add('dark');
  localStorage.setItem('darkMode', 'true');
}

// Initialize app
createRoot(document.getElementById("root")!).render(<App />);

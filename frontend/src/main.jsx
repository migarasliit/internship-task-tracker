import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast' // For beautiful notifications
import { ThemeProvider } from './context/ThemeContext.jsx' // Import ThemeProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider> 
    <AuthProvider>
      <App />
      <Toaster position="top-right" /> {/* This makes toast notifications appear */}
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
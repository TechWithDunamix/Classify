import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@fontsource/roboto'; // Defaults to weight 400
import '@fontsource/roboto/700.css'; // Weight 700
import '@fontsource/rubik'; // Defaults to weight 400
import '@fontsource/rubik/500.css'; // Weight 500
import '@fontsource/rubik/700.css'; // Weight 700

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import '@fontsource/roboto'; // Defaults to weight 400
import '@fontsource/roboto/700.css'; // Weight 700
import '@fontsource/rubik'; // Defaults to weight 400
import '@fontsource/rubik/500.css'; // Weight 500
import '@fontsource/rubik/700.css'; // Weight 700

const removeLoader = () => {
  const loader = document.getElementById('load');
  if (loader) {
    loader.style.transition = 'opacity 0.5s ease';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
    }, 500); // Match the timeout with the transition duration
  }
};

// Create a root for your React app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app and ensure removeLoader is called after rendering
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Call removeLoader after the React app has been mounted
removeLoader();

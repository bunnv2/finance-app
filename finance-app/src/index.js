import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
const subscribeUser = require('./utils/push-notifications').subscribeUser;
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
        // Tutaj możesz również zainicjować subskrypcję
        subscribeUser();
      })
      .catch(function(error) {
        console.log('Service Worker registration failed:', error);
      });
  });
}

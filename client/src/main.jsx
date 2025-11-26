import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext';

// Import test utilities for development
if (import.meta.env.DEV) {
  import('./firebaseTest.js').then(module => {
    console.log('🔥 Firebase test utilities loaded');
  });
  import('./seedData.js').then(module => {
    console.log('🌱 Data seeder loaded');
  });
  import('./firebaseConfig.js').then(module => {
    // Make Firebase functions available globally for testing
    window.firebaseUtils = {
      getCurrentUser: module.getCurrentUser,
      getDevices: module.getDevices,
      getDeviceLogs: module.getDeviceLogs,
      getAlerts: module.getAlerts,
      addDevice: module.addDevice,
      saveDeviceLog: module.saveDeviceLog,
      triggerAlert: module.triggerAlert
    };
    console.log('🔧 Firebase utilities available: window.firebaseUtils');
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)

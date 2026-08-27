import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#161626',
            color: '#fff',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#161626' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#161626' } },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);

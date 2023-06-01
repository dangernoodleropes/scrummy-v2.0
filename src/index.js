import React from 'react';
import App from './App.jsx';
import { createRoot } from 'react-dom/client';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = createRoot(document.getElementById('root'));

// before build replace CID with process.env.GOOGLE_CID

root.render(
  <GoogleOAuthProvider clientId={process.env.GOOGLE_CID}>
    <App />
  </GoogleOAuthProvider>
);

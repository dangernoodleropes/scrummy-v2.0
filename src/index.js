import React from 'react';
import App from './App.jsx';
import { createRoot } from 'react-dom/client';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = createRoot(document.getElementById('root'));

// before build replace CID with process.env.GOOGLE_CID

root.render(
  <GoogleOAuthProvider clientId='282798294214-5mc7j4rrojje9og14ga7i412r3kkoagf.apps.googleusercontent.com'>
    <App />
  </GoogleOAuthProvider>
);

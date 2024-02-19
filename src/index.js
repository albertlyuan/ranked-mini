import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import {AuthProvider} from 'react-auth-kit';

// amplify stuff
import { Amplify } from 'aws-amplify';
import config from './aws-exports.js';
Amplify.configure(config);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider authType = {'cookie'}
                  authName={'_auth'}
                  cookieDomain={window.location.hostname}
                  // cookieSecure={window.location.protocol === "https:"}
                  cookieSecure={false}
    >
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

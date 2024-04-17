import React from 'react';
import ReactDOM from 'react-dom/client';
import defaultEnv from './default-env';
import App from './App';
import { ErrorBoundary } from './common';
import initSync from './init-sync';

initSync();

ReactDOM.createRoot(document.getElementById(defaultEnv.rootElement)).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

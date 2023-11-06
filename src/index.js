import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Find the element in your HTML where you want to mount your React application
const container = document.getElementById('root');

// Create a root.
const root = createRoot(container);

// Initial render: Render the app into the root.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
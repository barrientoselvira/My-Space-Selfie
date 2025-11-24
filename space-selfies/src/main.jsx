// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// // src/main.jsx
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// import './index.css';

// import {
//   QueryClient,
//   QueryClientProvider,
// } from '@tanstack/react-query';

// // Create ONE QueryClient instance for the whole app.
// // This is where React Query keeps its cache and configuration.
// const queryClient = new QueryClient();

// // Standard Vite + React entry point.
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     {/* Make React Query available to the entire component tree. */}
//     <QueryClientProvider client={queryClient}>
//       <App />
//     </QueryClientProvider>
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/styles/app.scss';
import './assets/styles/index.scss';


// Entry point: render <App /> inside the #root element in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



import React from 'react'
import ReactDOM from 'react-dom/client'

// Aapka Hello World Component
const HelloWorld = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#646cff' }}>Hello World!</h1>
      <p>Welcome to the Zamin Project.</p>
    </div>
  );
};

// Rendering logic
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelloWorld />
  </React.StrictMode>
)
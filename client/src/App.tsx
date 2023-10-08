import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import WebSocketClient from './services/WebSocketService';

function App() {
  return (
    <>
      <WebSocketClient />
    </>
  );
}

export default App;

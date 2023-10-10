import './App.css';
import BackgroundMusic from './components/BackgroundMusic';
// import WebSocketClient from './services/WebSocketService';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SoloGame from './components/SoloGame';
import PVPGame from './components/PVPGame';
import DeckBuilder from './components/DeckBuilder';

function App() {
  return (
    <>
      <h1>Hello World!</h1>
      {/* <WebSocketClient /> */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/solo" element={<SoloGame />} />
          <Route path="/pvp" element={<PVPGame />} />
          <Route path="/deck" element={<DeckBuilder />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

import './App.css';
import ChatRoom from './components/ChatRoom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Chat from './components/Chat';
import SoloGame from './components/SoloGame';
import PVPGame from './components/PVPGame';
import DeckBuilder from './components/DeckBuilder';
import Settings from './components/Settings';
import Instructions from './components/Instructions';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/solo" element={<SoloGame />} />
          <Route path="/pvp" element={<PVPGame />} />
          <Route path="/deck" element={<DeckBuilder />} />
          <Route path="/chat-room" element={<ChatRoom />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

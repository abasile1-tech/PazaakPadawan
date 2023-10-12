import './App.css';
import Chat from './components/Chat';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SoloGame from './components/SoloGame';
import PVPGame from './components/PVPGame';
import DeckBuilder from './components/DeckBuilder';
// import Settings from './components/Settings';
import Instructions from './components/Instructions';
// import User from './components/User';
import Character from './components/Character';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/instructions" element={<Instructions />} />
          {/* <Route path="/user" element={<User />} /> */}
          <Route path="/character" element={<Character />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/solo" element={<SoloGame />} />
          <Route path="/pvp" element={<PVPGame />} />
          <Route path="/deck" element={<DeckBuilder />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

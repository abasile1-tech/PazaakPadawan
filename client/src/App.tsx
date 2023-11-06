import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SoloGame from './components/SoloGame';
import PVP from './containers/PVP';
import DeckBuilder from './components/DeckBuilder';
import Instructions from './components/Instructions';
import Character from './components/Character';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/character" element={<Character />} />
          <Route path="/solo" element={<SoloGame />} />
          <Route path="/pvp" element={<PVP />} />
          <Route path="/deck" element={<DeckBuilder />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

import './App.css';
// import WebSocketClient from './services/WebSocketService';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Chat from './components/Chat';

function App() {
  return (
    <>
      <h1>Hello World!</h1>
      {/* <WebSocketClient /> */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Chat" element={<Chat />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

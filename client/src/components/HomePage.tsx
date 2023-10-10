import BackgroundMusic from './BackgroundMusic';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let musicChoice: string = 'homePage';
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="home-page">
      <button className="menu-button" onClick={toggleMenu}>
        ☰
      </button>

      {isMenuOpen && (
        <div className="homepage">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/solo">Solo Game</Link>
            </li>
            <li>
              <Link to="/pvp">PVP Game</Link>
            </li>
            <li>
              <Link to="/deck">Deck Builder</Link>
            </li>
          </ul>
        </div>
      )}

      <div className="main-content">
        <h1>Welcome to Pazaak</h1>
        <p>
          Pazaak, a game dating back to Old Republic times, was a popular card
          game in which the goal was to come closest to 20 without going over.
        </p>
      </div>
      <BackgroundMusic musicChoice={musicChoice} />
    </div>
  );
}

export default HomePage;

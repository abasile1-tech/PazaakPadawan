import React, { useState } from 'react';
import { Link } from 'react-router-dom';
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <div className="headerdiv">
        <h1 className="headerh1">Pazaak!</h1>
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
      </div>
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
    </>
  );
}

export default Header;

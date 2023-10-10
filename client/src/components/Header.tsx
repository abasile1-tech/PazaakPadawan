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
        <div className="hamburger">
          <ul>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <Link to="/instructions">Instructions</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Header;

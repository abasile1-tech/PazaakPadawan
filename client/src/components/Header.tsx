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

        <div>
          <button className="menu-button" onClick={toggleMenu}>
            ☰
            <div>
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
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BackgroundMusic from './BackgroundMusic';

interface MusicChoiceProps {
  musicChoice: string;
}
function Header({ musicChoice }: MusicChoiceProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <div className="headerdiv">
        <h1 className="headerh1">Pazaak!</h1>
        <BackgroundMusic musicChoice={musicChoice} />
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

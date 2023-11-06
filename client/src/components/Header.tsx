import { useState } from 'react';
import { Link } from 'react-router-dom';
import BackgroundMusic from './BackgroundMusic';
import { MusicChoiceProps } from '../types';

function Header({ musicChoice }: MusicChoiceProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <div className="headerdiv">
        <Link to="/">
          <h1 className="headerh1">Pazaak!</h1>
        </Link>

        <div className="grouping_hamburger_music">
          <BackgroundMusic musicChoice={musicChoice} />
          <button className="menu-button" onClick={toggleMenu}>
            ☰
            <div>
              {isMenuOpen && (
                <nav className="hamburger">
                  <ul>
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/instructions">Instructions</Link>
                    </li>
                    <li>
                      <Link to="/solo">Solo</Link>
                    </li>
                    <li>
                      <Link to="/pvp">PvP</Link>
                    </li>
                    <li>
                      <Link to="/deck">Deck Builder</Link>
                    </li>
                    <li>
                      <Link to="/character">Characters</Link>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;

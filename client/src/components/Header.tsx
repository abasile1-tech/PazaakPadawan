import { useState } from 'react';
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
                      <Link to="/character">Choose Character</Link>
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

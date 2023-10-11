import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BackgroundMusic from './BackgroundMusic';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  //play different music based on pages
  const location = useLocation();
  const currentPage = location.pathname;
  let musicChoice = '';
  if (
    currentPage === '/' ||
    currentPage === '/deck' ||
    currentPage === '/settings'
  ) {
    musicChoice = 'homePage';
    console.log('This is home page music');
  } else {
    musicChoice = 'soloGame';
  }
  // homePage: openingTheme,"/"
  //   deckBuilder: openingTheme,"/deck"
  //   settingsPage: openingTheme,"/settings"
  //   soloGame: cantina,"/solo"
  //   pvpGame: cantina,"/pvp"

  //play different music based on pages
  return (
    <>
      <div className="headerdiv">
        <h1 className="headerh1">Pazaak!</h1>
        <div>
          <div>
            <BackgroundMusic musicChoice={musicChoice} />
          </div>
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

import Header from './Header';
import { Link } from 'react-router-dom';
import UserBarComponent from './UserBarComponent';
import homepagecard from '../assets/images/cards/HomepageCard.png';

function HomePage() {
  const musicChoice = 'homePage';

  return (
    <div className="home-page">
      <Header musicChoice={musicChoice} />
      <div className="userbar-container">
        <UserBarComponent />
      </div>

      <div className="main-content">
        <div id="home-page-text">
          <h1 data-testid="hero-heading">Pazaak Padawan</h1>
          <h2>
            Pazaak, a game dating back to Old Republic times, was a popular card
            game in which the goal was to come closest to 20 without going over.
          </h2>
        </div>
        <div>
          <img id="image-three-cards" src={homepagecard} alt="three cards" />
        </div>
      </div>

      <div className="buttons">
        <Link to="/solo">
          <button className="solo-button" data-testid="solo-game-button">
            Solo Game
          </button>
        </Link>
        <Link to="/pvp">
          <button className="pvp-button">PVP Game</button>
        </Link>
        <Link to="/deck">
          <button className="deck-button">Deck Builder</button>
        </Link>
        <Link to="/character">
          <button className="character-button">Characters </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;

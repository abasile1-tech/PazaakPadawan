import BackgroundMusic from './BackgroundMusic';
import Header from './Header';
import { Link } from 'react-router-dom';
// import User from './User';

function HomePage() {
  const musicChoice: string = 'homePage';

  return (
    <div className="home-page">
      <Header />
      <h2>User Bar Home Component</h2>

      <div className="main-content">
        <div id="home-page-text">
          <h1>Pazaak</h1>
          {/* <User /> */}

          <h2>
            Pazaak, a game dating back to Old Republic times, was a popular card
            game in which the goal was to come closest to 20 without going over.
          </h2>
        </div>
        <div>
          <img
            id="image-three-cards"
            src="src\assets\images\cards\HomepageCard.png"
            alt="three cards"
          />
        </div>
      </div>

      <div className="buttons">
        <Link to="/solo">
          <button className="solo-button">Solo</button>
        </Link>
        <Link to="/pvp">
          <button className="pvp-button">PVP</button>
        </Link>
        <Link to="/deck">
          <button className="deck-button">Deck Builder</button>
        </Link>
        <Link to="/character">
          <button className="character-button">Choose your character</button>
        </Link>
      </div>

      <BackgroundMusic musicChoice={musicChoice} />
    </div>
  );
}

export default HomePage;

import BackgroundMusic from './BackgroundMusic';
import Chat from './Chat';
import Header from './Header';

function HomePage() {
  let musicChoice: string = 'homePage';

  return (
    <div className="home-page">
      <Header />

      <div className="main-content">
        <h1>Welcome to Pazaak</h1>
        <p>
          Pazaak, a game dating back to Old Republic times, was a popular card
          game in which the goal was to come closest to 20 without going over.
        </p>
      </div>
      <BackgroundMusic musicChoice={musicChoice} />
      {<Chat />}
    </div>
  );
}

export default HomePage;

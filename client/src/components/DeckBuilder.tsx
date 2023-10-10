import BackgroundMusic from './BackgroundMusic';
import Header from './Header';

function DeckBuilder() {
  let musicChoice: string = 'deckBuilder';
  return (
    <>
      <Header />
      <h1>Deck Builder!</h1>
      <BackgroundMusic musicChoice={musicChoice} />
    </>
  );
}

export default DeckBuilder;

import Header from './Header';

function DeckBuilder() {
  const musicChoice = 'deckBuilder';
  return (
    <>
      <Header musicChoice={musicChoice} />
      <h1>Deck Builder!</h1>
    </>
  );
}

export default DeckBuilder;

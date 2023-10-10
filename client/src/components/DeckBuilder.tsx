import BackgroundMusic from './BackgroundMusic';

function DeckBuilder() {
  let musicChoice: string = 'deckBuilder';
  return (
    <>
      <h1>Deck Builder!</h1>
      <BackgroundMusic musicChoice={musicChoice} />
    </>
  );
}

export default DeckBuilder;

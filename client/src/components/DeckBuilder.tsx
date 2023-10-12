import Header from './Header';
import PopUp from './PopUP/PopUp';

function DeckBuilder() {
  const musicChoice = 'deckBuilder';
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {};
  //set up game turn + 1
  return (
    <>
      <Header musicChoice={musicChoice} />
      <h1>Deck Builder!</h1>
      {/* <PopUp popupType="welcome" /> */}
      <PopUp
        onClick={handleClick}
        title="test title"
        message="THE OPPONENT WINS THE SET."
      />
    </>
  );
}

export default DeckBuilder;

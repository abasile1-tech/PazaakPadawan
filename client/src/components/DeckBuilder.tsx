import Header from './Header';
import PopUp from './PopUP/PopUp';

function DeckBuilder() {
  const musicChoice = 'deckBuilder';
  const popupType = 'welcome';
  return (
    <>
      <Header musicChoice={musicChoice} />
      <h1>Deck Builder!</h1>
      {/* <PopUp popupType="welcome" /> */}
      <PopUp popupType={popupType} onClick={onClick} />
    </>
  );
}

export default DeckBuilder;

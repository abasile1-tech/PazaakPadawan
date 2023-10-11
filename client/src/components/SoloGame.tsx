import BackgroundMusic from './BackgroundMusic';
import Header from './Header';
import ScoreLights from './ScoreLights';
import Card from './Card';

function SoloGame() {
  let musicChoice: string = 'soloGame';
  let numGamesWonPlayer = 1;
  let numGamesWonOpponent = 2;
  return (
    <>
      <Header />
      <h1>Solo Game!</h1>
      <BackgroundMusic musicChoice={musicChoice} />
      <ScoreLights numGamesWon={numGamesWonPlayer} />
      <ScoreLights numGamesWon={numGamesWonOpponent} />
      <div className="cardsContainer">
        <Card value={-1} color="red" cardType="normal_card" />
        <Card value={+1} color="blue" cardType="normal_card" />
      </div>
    </>
  );
}

export default SoloGame;

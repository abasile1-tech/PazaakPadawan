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
      <div className="playerBoard">
        <div className="player1">
          <ScoreLights numGamesWon={numGamesWonPlayer} />
          <div
            className="cardsContainer"
            style={{ display: 'flex', flexWrap: 'wrap' }}
          >
            <Card value={-1} color="red" cardType="normal_card" />
            <Card value={+4} color="blue" cardType="normal_card" />
            <Card value={-2} color="red" cardType="normal_card" />
          </div>
          <div>
            <button>Stand</button>
            <button>End Turn</button>
          </div>
        </div>
        <div className="player2">
          <ScoreLights numGamesWon={numGamesWonOpponent} />
          <div
            className="cardsContainer"
            style={{ display: 'flex', flexWrap: 'wrap' }}
          >
            <Card value={+3} color="blue" cardType="normal_card" />
            <Card value={-6} color="red" cardType="normal_card" />
            <Card value={+5} color="blue" cardType="normal_card" />
          </div>
        </div>
      </div>
    </>
  );
}

export default SoloGame;

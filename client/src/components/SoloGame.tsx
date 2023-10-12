import BackgroundMusic from './BackgroundMusic';
import Header from './Header';
import ScoreLights from './ScoreLights';
import Card from './Card';
import TurnIndicator from './TurnIndicator';

function SoloGame() {
  const musicChoice = 'soloGame';
  let numGamesWonPlayer = 1;
  let numGamesWonOpponent = 2;
  return (
    <>
      <Header musicChoice={musicChoice} />
      <h1>Solo Game!</h1>
      <div className="scoreBoard">
        <ScoreLights numGamesWon={numGamesWonPlayer} />
        <h1>player 1</h1>
        <TurnIndicator playerName="Pin-Gun Jinn" />
        <h1>player 2</h1>
        <ScoreLights numGamesWon={numGamesWonOpponent} />
      </div>
      <hr />
      <div className="playerBoard">
        <div className="player1">
          <div
            className="cardsContainer"
            style={{ display: 'flex', flexWrap: 'wrap' }}
          >
            <Card value={5} color="blue" cardType="normal_card" />
            <Card value={4} color="blue" cardType="normal_card" />
            <Card value={2} color="blue" cardType="normal_card" />
            <Card value={4} color="blue" cardType="normal_card" />
          </div>
          <hr />
          <div
            className="handContainer"
            style={{ display: 'flex', flexWrap: 'wrap' }}
          >
            <Card value={-3} color="red" cardType="normal_card" />
            <Card value={4} color="blue" cardType="normal_card" />
            <Card value={2} color="blue" cardType="normal_card" />
            <Card value={-2} color="red" cardType="normal_card" />
          </div>
          <div className="turnOptions">
            <button>Stand</button>
            <button>End Turn</button>
          </div>
        </div>
        <div className="player2">
          <div
            className="cardsContainer"
            style={{ display: 'flex', flexWrap: 'wrap' }}
          >
            <Card value={6} color="blue" cardType="normal_card" />
            <Card value={5} color="blue" cardType="normal_card" />
            <Card value={6} color="blue" cardType="normal_card" />
            <Card value={5} color="blue" cardType="normal_card" />
          </div>
          <hr />
          <div
            className="handContainer"
            style={{ display: 'flex', flexWrap: 'wrap' }}
          >
            <Card value={-1} color="red" cardType="normal_card" />
            <Card value={-2} color="red" cardType="normal_card" />
          </div>
        </div>
      </div>
    </>
  );
}

export default SoloGame;

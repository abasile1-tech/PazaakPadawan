import Header from './Header';
import ScoreLights from './ScoreLights';
import { useState } from 'react';
import Hand from './Hand';
import Card from './Card';
import TurnIndicator from './TurnIndicator';

interface SoloGameProps {}

function SoloGame(props: SoloGameProps): JSX.Element {
  const [playerHand, setPlayerHand] = useState([
    <Card value={-3} color="red" cardType="normal_card" />,
    <Card value={4} color="blue" cardType="normal_card" />,
    <Card value={2} color="blue" cardType="normal_card" />,
    <Card value={-2} color="red" cardType="normal_card" />,
  ]);
  const [playerTable, setPlayerTable] = useState([
    <Card value={5} color="blue" cardType="normal_card" />,
    <Card value={4} color="blue" cardType="normal_card" />,
    <Card value={2} color="blue" cardType="normal_card" />,
    <Card value={4} color="blue" cardType="normal_card" />,
  ]);
  const [opponentHand, setOpponentHand] = useState([
    <Card value={-1} color="red" cardType="normal_card" />,
    <Card value={-2} color="red" cardType="normal_card" />,
  ]);
  const [opponentTable, setOpponentTable] = useState([
    <Card value={6} color="blue" cardType="normal_card" />,
    <Card value={5} color="blue" cardType="normal_card" />,
    <Card value={6} color="blue" cardType="normal_card" />,
    <Card value={5} color="blue" cardType="normal_card" />,
  ]);
  const [numGamesWonPlayer, setNumGamesWonPlayer] = useState(1);
  const [numGamesWonOpponent, setNumGamesWonOpponent] = useState(2);
  const [musicChoice, setMusicChoice] = useState('soloGame');
  const [playerName, setPlayerName] = useState('Peng-Wan Kenobi');
  const [opponentName, setOpponentName] = useState('Darth Molt');

  function getRandomNumber(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  function addCardToOpponentTable() {
    const newCard = (
      <Card value={getRandomNumber()} color="blue" cardType="normal_card" />
    );
    setOpponentTable([...opponentTable, newCard]);
  }

  return (
    <>
      <Header musicChoice={musicChoice} />
      <div className="scoreBoard">
        <ScoreLights numGamesWon={numGamesWonPlayer} />
        <h3>{playerName}</h3>
        <TurnIndicator playerName={playerName} />
        <h3>{opponentName}</h3>
        <ScoreLights numGamesWon={numGamesWonOpponent} />
      </div>
      <hr />
      <div className="playerBoard">
        <div className="player1">
          <Hand hand={playerTable} />
          <hr />
          <Hand hand={playerHand} />
          <div className="turnOptions">
            <button>Stand</button>
            <button onClick={addCardToOpponentTable}>End Turn</button>
          </div>
        </div>
        <div className="player2">
          <Hand hand={opponentTable} />
          <hr />
          <Hand hand={opponentHand} />
        </div>
      </div>
    </>
  );
}
export default SoloGame;

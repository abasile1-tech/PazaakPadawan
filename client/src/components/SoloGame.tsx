import Header from './Header';
import ScoreLights from './ScoreLights';
import { useState } from 'react';
import Hand from './Hand';
import Card from './Card';
import TurnIndicator from './TurnIndicator';
import PlayBar from './PlayBar';

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
    <Card value={3} color="blue" cardType="normal_card" />,
    <Card value={5} color="blue" cardType="normal_card" />,
    <Card value={2} color="blue" cardType="normal_card" />,
    <Card value={4} color="blue" cardType="normal_card" />,
  ]);
  const [numGamesWonPlayer, setNumGamesWonPlayer] = useState(1);
  const [numGamesWonOpponent, setNumGamesWonOpponent] = useState(2);
  const [playerTally, setPlayerTally] = useState(15);
  const [opponentTally, setOpponentTally] = useState(14);
  const [musicChoice, setMusicChoice] = useState('soloGame');
  const [playerName, setPlayerName] = useState('Peng-Wan Kenobi');
  const [opponentName, setOpponentName] = useState('Darth Molt');
  const [turnTracker, setTurnTracker] = useState(true);

  function getRandomNumber(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  function addCardToTable(turn: boolean) {
    const randomNumber = getRandomNumber();
    const newCard = (
      <Card value={randomNumber} color="blue" cardType="normal_card" />
    );
    if (turn) {
      setPlayerTally(playerTally + randomNumber);
      setPlayerTable([...playerTable, newCard]);
    } else if (!turn) {
      setOpponentTally(opponentTally + randomNumber);
      setOpponentTable([...opponentTable, newCard]);
    }
  }

  function handleEndTurnButtonClick() {
    addCardToTable(turnTracker);
    setTurnTracker(!turnTracker);
  }

  function moveCard() {
    console.log('card should be moving');
  }

  return (
    <>
      <Header musicChoice={musicChoice} />
      <div className="scoreBoard">
        <ScoreLights numGamesWon={numGamesWonPlayer} />
        <PlayBar playerTally={playerTally} />
        <TurnIndicator playerName={playerName} />
        <PlayBar playerTally={opponentTally} />
        <ScoreLights numGamesWon={numGamesWonOpponent} />
      </div>
      <hr />
      <div className="playerBoard">
        <div className="player1">
          <Hand hand={playerTable} />
          <hr />
          <Hand hand={playerHand} moveCard={moveCard} />
          <div className="turnOptions">
            <button>Stand</button>
            <button onClick={handleEndTurnButtonClick}>End Turn</button>
          </div>
        </div>
        <div className="player2">
          <Hand hand={opponentTable} />
          <hr />
          <Hand hand={opponentHand} moveCard={moveCard} />
        </div>
      </div>
    </>
  );
}
export default SoloGame;

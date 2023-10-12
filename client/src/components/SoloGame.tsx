import Header from './Header';
import ScoreLights from './ScoreLights';
import { useState } from 'react';
import Hand from './Hand';
import Card from './Card';
import PlayBar from './PlayBar';

interface SoloGameProps {}

interface Player {
  name: string;
  action: PlayerState;
  wonGame: boolean;
  isTurn: boolean;
  hand: typeof Hand;
  tally: number;
  table: typeof Hand;
}

enum GameState {
  INITIAL = 'initial',
  STARTED = 'started',
  ENDED = 'ended',
  STAND = 'stand',
}

enum PlayerState {
  STAND = 'stand',
  ENDTURN = 'endturn',
}

function SoloGame(props: SoloGameProps): JSX.Element {
  const [playerHand, setPlayerHand] = useState([
    <Card value={-3} color="red" cardType="normal_card" />,
    <Card value={4} color="blue" cardType="normal_card" />,
    <Card value={2} color="blue" cardType="normal_card" />,
    <Card value={-2} color="red" cardType="normal_card" />,
  ]);
  const [playerTable, setPlayerTable] = useState([]);
  const [opponentHand, setOpponentHand] = useState([
    <Card value={-1} color="red" cardType="normal_card" />,
    <Card value={-2} color="red" cardType="normal_card" />,
  ]);
  const [opponentTable, setOpponentTable] = useState([]);
  const [numGamesWonPlayer, setNumGamesWonPlayer] = useState(1);
  const [numGamesWonOpponent, setNumGamesWonOpponent] = useState(2);
  const [playerTally, setPlayerTally] = useState(0);
  const [opponentTally, setOpponentTally] = useState(0);
  const [musicChoice, setMusicChoice] = useState('soloGame');
  const [turnTracker, setTurnTracker] = useState(true);
  const [gameState, setGameState] = useState(GameState.INITIAL);

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
    const tmpTracker = !turnTracker;
    setTurnTracker(tmpTracker);
    addCardToTable(tmpTracker);
  }

  function handleStandButtonClick() {
    setTurnTracker(!turnTracker);
    setGameState(GameState.STAND);
  }

  function handleStartButtonClick() {
    addCardToTable(turnTracker);
    setGameState(GameState.STARTED);
  }

  function moveCard() {
    console.log('card should be moving');
  }

  return (
    <>
      <Header musicChoice={musicChoice} />
      <div className="scoreBoard">
        <ScoreLights numGamesWon={numGamesWonPlayer} />
        <PlayBar
          playerTally={playerTally}
          opponentTally={opponentTally}
          turnTracker={turnTracker}
        />
        <ScoreLights numGamesWon={numGamesWonOpponent} />
      </div>
      <hr />
      <div className="playerBoard">
        <div className="player1">
          <Hand hand={playerTable} />
          <hr />
          <Hand hand={playerHand} moveCard={moveCard} />
          <div className="turnOptions">
            <button
              onClick={handleStandButtonClick}
              disabled={
                gameState == GameState.INITIAL || gameState == GameState.STAND
              }
            >
              Stand
            </button>
            <button
              onClick={handleEndTurnButtonClick}
              disabled={
                gameState == GameState.INITIAL || gameState == GameState.STAND
              }
            >
              End Turn
            </button>
            <button
              onClick={handleStartButtonClick}
              disabled={
                gameState == GameState.STARTED || gameState == GameState.STAND
              }
            >
              Start Game
            </button>
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

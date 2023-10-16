import Header from './Header';
import ScoreLights from './ScoreLights';
import { useState } from 'react';
import Hand from './Hand';
import Card from './Card';
import PlayBar from './PlayBar';
import PopUp from './PopUP/PopUp';
import { useNavigate } from 'react-router-dom';
import GameButtons from './GameButtons';
import EndGamePopup from './EndGamePopUp';
// interface SoloGameProps {}

// interface Player {
//   name: string;
//   action: PlayerState;
//   wonGame: boolean;
//   isTurn: boolean;
//   hand: typeof Hand;
//   tally: number;
//   table: typeof Hand;
// }

enum GameState {
  INITIAL = 'initial',
  STARTED = 'started',
  ENDED = 'ended',
  STAND = 'stand',
  WAIT = 'wait',
}

// enum RoundState {
//   INITIAL = 'initial',
//   STARTED = 'started',
//   ENDED = 'ended',
//   STAND = 'stand',
// }

// enum PlayerState {
//   STAND = 'stand',
//   ENDTURN = 'endturn',
// }

// enum OpponentState {
//   STAND = 'stand',
//   ENDTURN = 'endturn',
// }

function SoloGame(): JSX.Element {
  const [playerHand, setPlayerHand] = useState([
    <Card value={-3} color="red" cardType="normal_card" />,
    <Card value={4} color="blue" cardType="normal_card" />,
    <Card value={2} color="blue" cardType="normal_card" />,
    <Card value={-2} color="red" cardType="normal_card" />,
  ]);
  const [playerTable, setPlayerTable] = useState<JSX.Element[]>([]);
  const [opponentHand, setOpponentHand] = useState([
    <Card value={-1} color="red" cardType="normal_card" />,
    <Card value={-2} color="red" cardType="normal_card" />,
    <Card value={-3} color="red" cardType="normal_card" />,
    <Card value={4} color="blue" cardType="normal_card" />,
  ]);
  const [opponentTable, setOpponentTable] = useState<JSX.Element[]>([]);
  const [numGamesWonPlayer, setNumGamesWonPlayer] = useState(0);
  const [numGamesWonOpponent, setNumGamesWonOpponent] = useState(0);
  const [playerTally, setPlayerTally] = useState(0);
  const [opponentTally, setOpponentTally] = useState(0);
  const [musicChoice] = useState('soloGame');
  const [turnTracker, setTurnTracker] = useState(true);
  const [gameState, setGameState] = useState(GameState.INITIAL);
  const [playedCardThisTurn, setPlayedCardThisTurn] = useState(false);
  //both users stand
  // const [bothPlayersStand, setBothPlayersStand] = useState(false);
  const navigate = useNavigate();
  const handleGameOverClick = () => {
    navigate('/');
  };

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

  async function handleEndTurnButtonClick() {
    setGameState(GameState.WAIT);
    const tmpTracker = !turnTracker;
    setTurnTracker(tmpTracker);
    addCardToTable(tmpTracker);
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(3000); // wait for 3 seconds while the AI "decides..."
    setGameState(GameState.STARTED);
    setTurnTracker(!tmpTracker);
    addCardToTable(!tmpTracker);
    setPlayedCardThisTurn(false);
    aiChoice();
  }

  function checkRoundWinner() {
    if (playerTally > 20 && opponentTally > 20) {
      console.log('you both went bust');
    } else if (playerTally > 20 && opponentTally <= 20) {
      setNumGamesWonOpponent(numGamesWonOpponent + 1);
      console.log('opponent won');
    } else if (opponentTally > 20 && playerTally <= 20) {
      setNumGamesWonPlayer(numGamesWonPlayer + 1);
      console.log('you won');
    } else if (playerTally == opponentTally) {
      console.log('you tied');
    } else if (playerTally < opponentTally) {
      setNumGamesWonOpponent(numGamesWonOpponent + 1);
      console.log('opponent won');
    } else if (opponentTally < playerTally) {
      setNumGamesWonPlayer(numGamesWonPlayer + 1);
      console.log('you won');
    } else {
      console.log('something unexpected happened with the scoring');
    }
    console.log('the round is over');
  }

  //ai choice
  function aiChoice() {
    if (opponentTally < 17) {
      addCardToTable(true);
      console.log('more card');
    } else if (opponentTally >= 17 && opponentTally <= 20) {
      if (opponentHand.length > 0) {
        let bestCard = null;
        let bestSum = 0;
        let bestCardIndex = -1;
        for (let i = 0; i < opponentHand.length; i++) {
          const card = opponentHand[i];
          const sum = opponentTally + card.props.value;
          if (sum <= 20 && sum > bestSum) {
            bestSum = sum;
            bestCard = card;
            bestCardIndex = i;
          }
        }
        if (bestCard) {
          opponentHand.splice(bestCardIndex, 1);
          setOpponentHand([...opponentHand]);
          setOpponentTable([...opponentTable, bestCard]);
          setOpponentTally(bestSum);
        } else {
          setGameState(GameState.STAND);
          console.log('i want to stand');
        }
      } else {
        setGameState(GameState.STAND);
        console.log('i want to stand');
      }
    } else if (opponentTally > 20) {
      if (opponentHand.length > 0) {
        let bestCard = null;
        let bestSum = 0;
        let bestCardIndex = -1;
        for (let i = 0; i < opponentHand.length; i++) {
          const card = opponentHand[i];
          const sum = opponentTally + card.props.value;
          if (sum <= 20 && sum > bestSum) {
            bestSum = sum;
            bestCard = card;
            bestCardIndex = i;
          }
        }
        if (bestCard) {
          opponentHand.splice(bestCardIndex, 1);
          setOpponentHand([...opponentHand]);
          setOpponentTable([...opponentTable, bestCard]);
          setOpponentTally(bestSum);
        } else {
          setGameState(GameState.STAND);
          console.log('i want to stand');
        }
      } else {
        setGameState(GameState.STAND);
        console.log('i want to stand');
      }
    }
  }
  //ai choice

  async function handleStandButtonClick() {
    setGameState(GameState.STAND);
    const tmpTracker = !turnTracker;
    setTurnTracker(tmpTracker);
    addCardToTable(tmpTracker);
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(3000); // wait for 3 seconds while the AI "decides...";
    checkRoundWinner();
    setPlayerTable([]);
    setOpponentTable([]);
    setGameState(GameState.INITIAL);
    setPlayerTally(0);
    setOpponentTally(0);
    const newTmpTracker = turnTracker;
    setTurnTracker(newTmpTracker);
    setPlayedCardThisTurn(false);
  }

  function handleStartButtonClick() {
    setPlayedCardThisTurn(false);
    addCardToTable(turnTracker);
    setGameState(GameState.STARTED);
  }

  function moveCard(card: JSX.Element, index: number) {
    // if no cards have been played yet this turn, play a card
    if (!playedCardThisTurn) {
      playerHand.splice(index, 1);
      setPlayerHand([...playerHand]);
      setPlayerTable([...playerTable, card]);
      setPlayerTally(playerTally + card.props.value);
      setPlayedCardThisTurn(true);
    }
  }
  //game over
  // function renderPopup() {
  //   if (numGamesWonPlayer === 3) {
  //     return (
  //       <PopUp
  //         title="YOU WON "
  //         message="Thanks for playing Pazaak Online.
  //         Click close to return to the main menu."
  //         buttonText="CLOSE"
  //         onClick={handleGameOverClick}
  //       />
  //     );
  //   } else if (numGamesWonOpponent === 3) {
  //     return (
  //       <PopUp
  //         title="YOU LOSE"
  //         message="Thanks for playing Pazaak Online.
  //         Click close to return to the main menu."
  //         buttonText="CLOSE"
  //         onClick={handleGameOverClick}
  //       />
  //     );
  //   }

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
          <div className="table">
            <Hand hand={playerTable} />
          </div>
          <hr />
          <div className="hand">
            <Hand hand={playerHand} moveCard={moveCard} />
          </div>
          <div className="turnOptions">
            <GameButtons
              gameState={gameState}
              onStand={handleStandButtonClick}
              onEndTurn={handleEndTurnButtonClick}
              onStartGame={handleStartButtonClick}
            />
          </div>
        </div>
        <div className="player2">
          <div className="table">
            <Hand hand={opponentTable} />
          </div>
          <hr />
          <div className="hand">
            <Hand hand={opponentHand} />
          </div>
        </div>
        <div className="center-message">
          <EndGamePopup
            numGamesWonPlayer={numGamesWonPlayer}
            numGamesWonOpponent={numGamesWonOpponent}
            handleGameOverClick={handleGameOverClick}
          />
        </div>
      </div>
    </>
  );
}
export default SoloGame;

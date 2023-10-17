import Header from './Header';
import ScoreLights from './ScoreLights';
import { useState } from 'react';
import Hand from './Hand';
import Card from './Card';
import PlayBar from './PlayBar';
import cardflip from '../assets/music/flipcardfast.mp3';
import { useNavigate } from 'react-router-dom';
import GameButtons from './GameButtons';
import EndGamePopup from './EndGamePopUp';

interface Player {
  name: string;
  action: PlayerState;
  wonGame: boolean;
  isTurn: boolean;
  hand: JSX.Element[];
  tally: number;
  table: JSX.Element[];
  gamesWon: number;
  playedCardThisTurn: boolean;
}

enum GameState {
  INITIAL = 'initial',
  STARTED = 'started',
  ENDED = 'ended',
  STAND = 'stand',
  WAIT = 'wait',
}

enum PlayerState {
  STAND = 'stand',
  ENDTURN = 'endturn',
}

function SoloGame(): JSX.Element {
  const initialPlayer: Player = {
    name: '',
    action: PlayerState.STAND,
    wonGame: false,
    isTurn: false,
    hand: [
      <Card value={-3} color="red" cardType="normal_card" />,
      <Card value={4} color="blue" cardType="normal_card" />,
      <Card value={2} color="blue" cardType="normal_card" />,
      <Card value={-2} color="red" cardType="normal_card" />,
    ],
    tally: 0,
    table: [],
    gamesWon: 0,
    playedCardThisTurn: false,
  };

  const initialComputerPlayer: Player = {
    name: '',
    action: PlayerState.STAND,
    wonGame: false,
    isTurn: false,
    hand: [
      <Card value={-3} color="red" cardType="normal_card" />,
      <Card value={4} color="blue" cardType="normal_card" />,
      <Card value={2} color="blue" cardType="normal_card" />,
      <Card value={-2} color="red" cardType="normal_card" />,
    ],
    tally: 0,
    table: [],
    gamesWon: 0,
    playedCardThisTurn: false,
  };

  const [player, setPlayer] = useState(initialPlayer);
  const [computerPlayer, setComputerPlayer] = useState(initialComputerPlayer);
  const [musicChoice] = useState('soloGame');
  const [gameState, setGameState] = useState(GameState.INITIAL);
  const navigate = useNavigate();
  const handleGameOverClick = () => {
    navigate('/');
  };

  function getRandomNumber(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  function addCardToTable(newPlayer: Player): Player | null {
    const audio = new Audio(cardflip);
    audio.play();
    const randomNumber = getRandomNumber();
    const newCard = (
      <Card value={randomNumber} color="blue" cardType="normal_card" />
    );
    if (newPlayer.isTurn) {
      setPlayer({
        ...newPlayer,
        tally: newPlayer.tally + randomNumber,
        table: [...newPlayer.table, newCard],
      });
      return null;
    }
    if (!newPlayer.isTurn) {
      const newComputerPlayer = {
        ...computerPlayer,
        tally: computerPlayer.tally + randomNumber,
        table: [...computerPlayer.table, newCard],
      };
      setComputerPlayer(newComputerPlayer);
      return newComputerPlayer;
    }
    return null;
  }

  async function handleEndTurnButtonClick() {
    setGameState(GameState.WAIT);
    const newPlayer = {
      ...player,
      isTurn: false,
    };
    setPlayer(newPlayer);
    const newComputerPlayer = addCardToTable(newPlayer);
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(3000); // wait for 3 seconds while the AI "decides..."
    // AI Choice starts
    if (computerPlayer.tally > 20) {
      if (computerPlayer.hand.length > 0) {
        let bestCard = null;
        let bestSum = 0;
        let bestCardIndex = -1;
        for (let i = 0; i < computerPlayer.hand.length; i++) {
          const card = computerPlayer.hand[i];
          const sum = computerPlayer.tally + card.props.value;
          if (sum >= 15 && sum <= 20 && sum > bestSum) {
            bestSum = sum;
            bestCard = card;
            bestCardIndex = i;
          }
        }
        if (bestCard) {
          computerPlayer.hand.splice(bestCardIndex, 1);
          const newComputerPlayer = {
            ...computerPlayer,
            tally: computerPlayer.tally + bestSum,
            table: [...computerPlayer.table, bestCard],
          };
          setComputerPlayer(newComputerPlayer);
          // setOpponentHand([...computerPlayer.hand]);
          // setOpponentTable([...opponentTable, bestCard]);
          // setOpponentTally(bestSum);
        } else {
          setGameState(GameState.STAND);
          console.log('i want to stand');
        }
      } else {
        setGameState(GameState.STAND);
        console.log('i want to stand');
      }
    } else if (computerPlayer.tally >= 17 && computerPlayer.tally <= 20) {
      if (Math.random() < 0.7) {
        setGameState(GameState.STAND);
        console.log('mostly i want to stand');
      } else {
        addCardToTable(computerPlayer);
        console.log('number between 17 and 20 but i need more cards');
      }
    } else if (computerPlayer.tally < 17) {
      addCardToTable(newPlayer);
      console.log('more card');
    }
    // AI choice ends
    if (player.tally >= 20 || computerPlayer.tally >= 20) {
      await endOfRoundCleaning(newComputerPlayer);
    } else {
      setGameState(GameState.STARTED);
      const newPlayer = {
        ...player,
        isTurn: true,
        playedCardThisTurn: false,
      };
      setPlayer(newPlayer);
      addCardToTable(newPlayer);
    }
  }

  function getRoundWinner(computerPlayer: Player) {
    console.log(
      'Player Score: ',
      player.tally,
      'Computer Player Score: ',
      computerPlayer.tally
    );
    const playerBust = player.tally > 20;
    const computerBust = computerPlayer.tally > 20;
    const computerWon = computerPlayer.tally <= 20;
    const playerWon = player.tally <= 20;
    const tie = player.tally == computerPlayer.tally;
    const playerLessThanComputer = player.tally < computerPlayer.tally;
    const computerLessThanPlayer = player.tally > computerPlayer.tally;
    const playerReturn = 1;
    const computerPlayerReturn = 0;
    const tieOrBustReturn = -1;

    if (playerBust && computerBust) {
      console.log('you both went bust');
      return tieOrBustReturn;
    }
    if (playerBust && computerWon) {
      console.log('opponent won');
      return computerPlayerReturn;
    }
    if (computerBust && playerWon) {
      console.log('you won');
      return playerReturn;
    }
    if (tie) {
      console.log('you tied');
      return tieOrBustReturn;
    }
    if (playerLessThanComputer) {
      console.log('opponent won');
      return computerPlayerReturn;
    }
    if (computerLessThanPlayer) {
      console.log('you won');
      return playerReturn;
    }
    console.log('the round is over', player.tally, computerPlayer.tally);
  }

  async function handleStandButtonClick() {
    setGameState(GameState.STAND);
    const newPlayer = {
      ...player,
      isTurn: false,
    };
    setPlayer(newPlayer);
    const newComputerPlayer = addCardToTable(newPlayer);
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(3000); // wait for 3 seconds while the AI "decides...";
    await endOfRoundCleaning(newComputerPlayer);
  }

  async function handleStartButtonClick() {
    const newPlayer = {
      ...player,
      isTurn: true,
      playedCardThisTurn: false,
    };
    setPlayer(newPlayer);
    addCardToTable(newPlayer);
    setGameState(GameState.STARTED);
  }

  async function endOfRoundCleaning(newComputerPlayer: Player | null) {
    const winner = getRoundWinner(
      newComputerPlayer ? newComputerPlayer : computerPlayer
    );
    setPlayer({
      ...player,
      hand: player.hand,
      table: [],
      tally: 0,
      gamesWon: winner === 1 ? player.gamesWon + 1 : player.gamesWon,
      playedCardThisTurn: false,
    });
    setComputerPlayer({
      ...player,
      hand: player.hand,
      table: [],
      tally: 0,
      gamesWon:
        winner === 0 ? computerPlayer.gamesWon + 1 : computerPlayer.gamesWon,
      playedCardThisTurn: false,
    });

    setGameState(GameState.INITIAL);
  }

  function moveCard(card: JSX.Element, index: number) {
    // if no cards have been played yet this turn, play a card
    if (!player.playedCardThisTurn) {
      player.hand.splice(index, 1);
      setPlayer({
        ...player,
        hand: player.hand,
        table: [...player.table, card],
        tally: player.tally + card.props.value,
        playedCardThisTurn: true,
      });
    }
  }

  return (
    <>
      <Header musicChoice={musicChoice} />
      <div className="scoreBoard">
        <ScoreLights numGamesWon={player.gamesWon} />
        <PlayBar
          playerTally={player.tally}
          opponentTally={computerPlayer.tally}
          isPlayerTurn={player.isTurn}
          gameState={gameState}
        />
        <ScoreLights numGamesWon={computerPlayer.gamesWon} />
      </div>
      <hr />
      <div className="playerBoard">
        <div className="player1">
          <div className="table">
            <Hand hand={player.table} />
          </div>
          <hr />
          <div className="hand">
            <Hand hand={player.hand} moveCard={moveCard} />
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
            <Hand hand={computerPlayer.table} />
          </div>
          <hr />
          <div className="hand">
            <Hand hand={computerPlayer.hand} />
          </div>
        </div>
        <div className="center-message">
          <EndGamePopup
            numGamesWonPlayer={player.gamesWon}
            numGamesWonOpponent={computerPlayer.gamesWon}
            handleGameOverClick={handleGameOverClick}
          />
        </div>
      </div>
    </>
  );
}
export default SoloGame;

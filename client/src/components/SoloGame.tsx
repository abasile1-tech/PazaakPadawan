import Header from './Header';
import ScoreLights from './ScoreLights';
import { useState } from 'react';
import Hand from './Hand';
import Card from './Card';
import PlayBar from './PlayBar';
import cardflip from '../assets/music/flipcardfast.mp3';
import { useLocation, useNavigate } from 'react-router-dom';
import GameButtons from './GameButtons';
import EndGamePopup from './EndGamePopUp';
import PopUp from './PopUP/PopUp';

interface DeckCard {
  value: number;
  color: string;
  selected: boolean;
  imagePath: string;
}

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
}

enum PlayerState {
  PLAY = 'play',
  STAND = 'stand',
  ENDTURN = 'endturn',
}

function SoloGame(): JSX.Element {
  const location = useLocation();
  const selectedHand = location?.state?.selectedHand;
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const [endRoundMessage, setEndRoundMessage] = useState<string>('');
  const [showEndRoundPopup, setShowEndRoundPopup] = useState(false);
  function generateRandomHand() {
    const randomHand = [];
    for (let i = 0; i < 4; i++) {
      const randomValue = Math.floor(Math.random() * 6) + 1;
      const randomColor = Math.random() < 0.5 ? 'blue' : 'red';
      if (randomColor === 'red') {
        randomHand.push(
          <Card
            value={-randomValue}
            color={randomColor}
            cardType="normal_card"
          />
        );
      } else {
        randomHand.push(
          <Card
            value={randomValue}
            color={randomColor}
            cardType="normal_card"
          />
        );
      }
    }
    return randomHand;
  }
  const initialPlayer: Player = {
    name: '',
    action: PlayerState.PLAY,
    wonGame: false,
    isTurn: false,
    hand: selectedHand
      ? selectedHand.map((card: DeckCard) => (
          <Card value={card.value} color={card.color} cardType="normal_card" />
        ))
      : generateRandomHand(),
    tally: 0,
    table: [],
    gamesWon: 0,
    playedCardThisTurn: false,
  };

  const initialComputerPlayer: Player = {
    name: '',
    action: PlayerState.PLAY,
    wonGame: false,
    isTurn: false,
    hand: [
      <Card value={3} color="blue" cardType="normal_card" />,
      <Card value={4} color="blue" cardType="normal_card" />,
      <Card value={2} color="blue" cardType="normal_card" />,
      <Card value={1} color="blue" cardType="normal_card" />,
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

  function showEndRoundWinner(winner: string) {
    setEndRoundMessage(winner);
    setShowEndRoundPopup(true);
  }
  function addCardToTable(newPlayer: Player): Player | null {
    const audio = new Audio(cardflip);
    audio.play();
    const randomNumber = getRandomNumber();
    const newCard = (
      <Card value={randomNumber} color="green" cardType="normal_card" />
    );
    if (newPlayer.isTurn && newPlayer.action != PlayerState.STAND) {
      setPlayer({
        ...newPlayer,
        tally: newPlayer.tally + randomNumber,
        table: [...newPlayer.table, newCard],
        action: PlayerState.PLAY,
      });
      return null;
    }
    if (newPlayer.action == PlayerState.STAND) {
      console.log('player stood');
    }

    if (!newPlayer.isTurn && computerPlayer.action != PlayerState.STAND) {
      console.log('computerPlayer.action before', computerPlayer.action);
      const newComputerPlayer = {
        ...computerPlayer,
        tally: computerPlayer.tally + randomNumber,
        table: [...computerPlayer.table, newCard],
        action: PlayerState.PLAY,
      };
      setComputerPlayer(newComputerPlayer);
      console.log('computerPlayer.action after', computerPlayer.action);
      return newComputerPlayer;
    }
    console.log('both stood');
    return null;
  }

  async function handleEndTurnButtonClick() {
    const newPlayer = {
      ...player,
      isTurn: false,
      action: PlayerState.ENDTURN,
    };
    setPlayer(newPlayer);
    console.log(
      'newPlayer, newPlayer.action',
      newPlayer,
      ', ',
      newPlayer.action
    );
    const newComputerPlayer = addCardToTable(newPlayer);
    const cPlayer = newComputerPlayer ? newComputerPlayer : computerPlayer;
    await delay(3000); // wait for 3 seconds while the AI "decides..."
    // AI Choice starts
    if (cPlayer.tally < 20 && cPlayer.action != PlayerState.STAND) {
      if (cPlayer.hand.length > 0) {
        let bestSum = 0;
        let bestCardIndex = -1;
        // Check to see if you have any cards that can get you to 20
        for (let i = 0; i < cPlayer.hand.length; i++) {
          const card = cPlayer.hand[i];
          const sum = cPlayer.tally + card.props.value;
          if (sum >= 15 && sum <= 20 && sum > bestSum) {
            bestSum = sum;
            bestCardIndex = i;
          }
        }
        console.log('bestCardIndex', bestCardIndex);
        if (bestCardIndex !== -1) {
          console.log('trying to play best card', bestCardIndex);
          const [playedCard] = cPlayer.hand.splice(bestCardIndex, 1);
          const newComputerPlayer = {
            ...cPlayer,
            hand: [...cPlayer.hand],
            tally: playedCard.props.value + cPlayer.tally,
            table: [...cPlayer.table, playedCard],
            action: PlayerState.STAND,
          };
          console.log('Computer Player Table', newComputerPlayer.table);
          setComputerPlayer(newComputerPlayer);
          await delay(3000); // wait for 3 seconds while the AI "decides..."
          // setGameState(GameState.STAND);
          console.log('I just played a card and now I want to stand');
        }
      } else {
        const newComputerPlayer = {
          ...cPlayer,
          action: PlayerState.STAND,
        };
        setComputerPlayer(newComputerPlayer);
        // setGameState(GameState.STAND);
        console.log('i want to stand #2');
      }
    } else if (cPlayer.tally >= 17 && cPlayer.tally <= 20) {
      if (Math.random() < 0.7) {
        const newComputerPlayer = {
          ...cPlayer,
          action: PlayerState.STAND,
        };
        setComputerPlayer(newComputerPlayer);
        // setGameState(GameState.STAND);
        console.log('mostly i want to stand');
      } else {
        // addCardToTable(newPlayer);
        console.log('number between 17 and 20 but i need more cards');
        const newComputerPlayer = {
          ...cPlayer,
          action: PlayerState.PLAY,
        };
        setComputerPlayer(newComputerPlayer);
      }
    } else if (cPlayer.tally < 17) {
      // addCardToTable(newPlayer);
      console.log('more card');
      const newComputerPlayer = {
        ...cPlayer,
        action: PlayerState.PLAY,
      };
      setComputerPlayer(newComputerPlayer);
    }
    // AI choice ends
    if (newPlayer.tally >= 20 || cPlayer.tally >= 20) {
      await endOfRoundCleaning(cPlayer);
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
    // setGameState(GameState.STAND);
    const newPlayer = {
      ...player,
      isTurn: false,
      action: PlayerState.STAND,
    };
    setPlayer(newPlayer);
    const newComputerPlayer = addCardToTable(newPlayer);
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
    if (winner === 1) {
      showEndRoundWinner('YOU WIN THE ROUND!');
    } else if (winner === 0) {
      showEndRoundWinner('OPPONENT WINS THE ROUND');
    } else {
      showEndRoundWinner('THIS ROUND IS TIED');
    }
    setPlayer({
      ...player,
      hand: player.hand,
      table: [],
      tally: 0,
      action: PlayerState.PLAY,
      gamesWon: winner === 1 ? player.gamesWon + 1 : player.gamesWon,
      playedCardThisTurn: false,
    });
    setComputerPlayer({
      ...computerPlayer,
      hand: computerPlayer.hand,
      table: [],
      tally: 0,
      action: PlayerState.PLAY,
      gamesWon:
        winner === 0 ? computerPlayer.gamesWon + 1 : computerPlayer.gamesWon,
      playedCardThisTurn: false,
    });

    setGameState(GameState.INITIAL);
  }

  function moveCard(card: JSX.Element, index: number) {
    // if no cards have been played yet this turn, play a card

    if (gameState === GameState.STARTED && !player.playedCardThisTurn) {
      const audio = new Audio(cardflip);
      audio.play();
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
        <div className="center-message">
          {showEndRoundPopup && (
            <PopUp
              message={endRoundMessage}
              buttonText="OK"
              onClick={() => {
                setShowEndRoundPopup(false);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
export default SoloGame;

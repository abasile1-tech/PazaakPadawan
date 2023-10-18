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
import Chat from './Chat';

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
  const initialPlayer1: Player = {
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

  const initialPlayer2: Player = {
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

  const [player1, setPlayer1] = useState(initialPlayer1);
  const [player2, setPlayer2] = useState(initialPlayer2);
  const [musicChoice] = useState('pvpGame');
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
      setPlayer1({
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

    if (!newPlayer.isTurn && player2.action != PlayerState.STAND) {
      console.log('player2.action before', player2.action);
      const newPlayer2 = {
        ...player2,
        tally: player2.tally + randomNumber,
        table: [...player2.table, newCard],
        action: PlayerState.PLAY,
      };
      setPlayer2(newPlayer2);
      console.log('player2.action after', player2.action);
      return newPlayer2;
    }
    console.log('both stood');
    return null;
  }

  async function handleEndTurnButtonClick() {
    const newPlayer = {
      ...player1,
      isTurn: false,
      action: PlayerState.ENDTURN,
    };
    setPlayer1(newPlayer);
    console.log(
      'newPlayer, newPlayer.action',
      newPlayer,
      ', ',
      newPlayer.action
    );
    const newPlayer2 = addCardToTable(newPlayer);
    const player2 = newPlayer2 ? newPlayer2 : player2;
    await delay(3000); // wait for 3 seconds while the AI "decides..."
    // AI Choice starts
    if (player2.tally < 20 && player2.action != PlayerState.STAND) {
      if (player2.hand.length > 0) {
        let bestSum = 0;
        let bestCardIndex = -1;
        // Check to see if you have any cards that can get you to 20
        for (let i = 0; i < player2.hand.length; i++) {
          const card = player2.hand[i];
          const sum = player2.tally + card.props.value;
          if (sum >= 15 && sum <= 20 && sum > bestSum) {
            bestSum = sum;
            bestCardIndex = i;
          }
        }
        console.log('bestCardIndex', bestCardIndex);
        if (bestCardIndex !== -1) {
          console.log('trying to play best card', bestCardIndex);
          const [playedCard] = player2.hand.splice(bestCardIndex, 1);
          const newPlayer2 = {
            ...player2,
            hand: [...player2.hand],
            tally: playedCard.props.value + player2.tally,
            table: [...player2.table, playedCard],
            action: PlayerState.STAND,
          };
          console.log('Player2 Table', newPlayer2.table);
          setPlayer2(newPlayer2);
          await delay(3000); // wait for 3 seconds while the AI "decides..."
          // setGameState(GameState.STAND);
          console.log('I just played a card and now I want to stand');
        }
      } else {
        const newPlayer2 = {
          ...player2,
          action: PlayerState.STAND,
        };
        setPlayer2(newPlayer2);
        // setGameState(GameState.STAND);
        console.log('i want to stand #2');
      }
    } else if (player2.tally >= 17 && player2.tally <= 20) {
      if (Math.random() < 0.7) {
        const newPlayer2 = {
          ...player2,
          action: PlayerState.STAND,
        };
        setPlayer2(newPlayer2);
        // setGameState(GameState.STAND);
        console.log('mostly i want to stand');
      } else {
        // addCardToTable(newPlayer);
        console.log('number between 17 and 20 but i need more cards');
        const newPlayer2 = {
          ...player2,
          action: PlayerState.PLAY,
        };
        setPlayer2(newPlayer2);
      }
    } else if (player2.tally < 17) {
      // addCardToTable(newPlayer);
      console.log('more card');
      const newPlayer2 = {
        ...player2,
        action: PlayerState.PLAY,
      };
      setPlayer2(newPlayer2);
    }
    // AI choice ends
    if (newPlayer.tally >= 20 || player2.tally >= 20) {
      await endOfRoundCleaning(player2);
    } else {
      setGameState(GameState.STARTED);
      const newPlayer1 = {
        ...player1,
        isTurn: true,
        playedCardThisTurn: false,
      };
      setPlayer1(newPlayer1);
      addCardToTable(newPlayer1);
    }
  }

  function getRoundWinner(player: Player) {
    console.log(
      'Player Score: ',
      player.tally,
      'Computer Player Score: ',
      player2.tally
    );
    const playerBust = player.tally > 20;
    const player2Bust = player2.tally > 20;
    const player2Won = player2.tally <= 20;
    const playerWon = player.tally <= 20;
    const tie = player.tally == player2.tally;
    const player1LessThanPlayer2 = player.tally < player2.tally;
    const player2LessThanPlayer1 = player.tally > player2.tally;
    const playerReturn = 1;
    const player2Return = 0;
    const tieOrBustReturn = -1;

    if (playerBust && player2Bust) {
      console.log('you both went bust');
      return tieOrBustReturn;
    }
    if (playerBust && player2Won) {
      console.log('opponent won');
      return player2Return;
    }
    if (player2Bust && playerWon) {
      console.log('you won');
      return playerReturn;
    }
    if (tie) {
      console.log('you tied');
      return tieOrBustReturn;
    }
    if (player1LessThanPlayer2) {
      console.log('opponent won');
      return player2Return;
    }
    if (player2LessThanPlayer1) {
      console.log('you won');
      return playerReturn;
    }
    console.log('the round is over', player.tally, player2.tally);
  }

  async function handleStandButtonClick() {
    // setGameState(GameState.STAND);
    const newPlayer1 = {
      ...player1,
      isTurn: false,
      action: PlayerState.STAND,
    };
    setPlayer1(newPlayer1);
    const newPlayer2 = addCardToTable(newPlayer2);
    // await delay(3000);
    await endOfRoundCleaning(newPlayer2);
  }

  async function handleStartButtonClick() {
    const newPlayer1 = {
      ...player1,
      isTurn: true,
      playedCardThisTurn: false,
    };
    setPlayer1(newPlayer1);
    addCardToTable(newPlayer1);
    setGameState(GameState.STARTED);
  }

  async function endOfRoundCleaning(newPlayer2: Player | null) {
    const winner = getRoundWinner(newPlayer2 ? newPlayer2 : player2);
    if (winner === 1) {
      showEndRoundWinner('YOU WIN THE ROUND!');
    } else if (winner === 0) {
      showEndRoundWinner('OPPONENT WINS THE ROUND');
    } else {
      showEndRoundWinner('THIS ROUND IS TIED');
    }
    setPlayer1({
      ...player1,
      hand: player1.hand,
      table: [],
      tally: 0,
      action: PlayerState.PLAY,
      gamesWon: winner === 1 ? player1.gamesWon + 1 : player1.gamesWon,
      playedCardThisTurn: false,
    });
    setPlayer2({
      ...player2,
      hand: player2.hand,
      table: [],
      tally: 0,
      action: PlayerState.PLAY,
      gamesWon: winner === 0 ? player2.gamesWon + 1 : player2.gamesWon,
      playedCardThisTurn: false,
    });

    setGameState(GameState.INITIAL);
  }

  function moveCard(card: JSX.Element, index: number) {
    // if no cards have been played yet this turn, play a card

    if (gameState === GameState.STARTED && !player1.playedCardThisTurn) {
      const audio = new Audio(cardflip);
      audio.play();
      player1.hand.splice(index, 1);
      setPlayer1({
        ...player1,
        hand: player1.hand,
        table: [...player1.table, card],
        tally: player1.tally + card.props.value,
        playedCardThisTurn: true,
      });
    }
  }

  return (
    <>
      <Header musicChoice={musicChoice} />
      <div className="scoreBoard">
        <ScoreLights numGamesWon={player1.gamesWon} />
        <PlayBar
          playerTally={player1.tally}
          opponentTally={player2.tally}
          isPlayerTurn={player1.isTurn}
          gameState={gameState}
        />
        <ScoreLights numGamesWon={player2.gamesWon} />
      </div>
      <hr />
      <div className="playerBoard">
        <div className="player1">
          <div className="table">
            <Hand hand={player1.table} />
          </div>
          <hr />
          <div className="hand">
            <Hand hand={player1.hand} moveCard={moveCard} />
          </div>
          <div className="turnOptions">
            <GameButtons
              gameState={gameState}
              onStand={handleStandButtonClick}
              onEndTurn={handleEndTurnButtonClick}
              onStartGame={handleStartButtonClick}
              isPlayerTurn={player1.isTurn}
            />
          </div>
        </div>
        <div className="player2">
          <div className="table">
            <Hand hand={player2.table} />
          </div>
          <hr />
          <div className="hand">
            <Hand hand={player2.hand} />
          </div>
        </div>
        <div className="center-message">
          <EndGamePopup
            numGamesWonPlayer={player1.gamesWon}
            numGamesWonOpponent={player2.gamesWon}
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
      <Chat />
    </>
  );
}
export default SoloGame;

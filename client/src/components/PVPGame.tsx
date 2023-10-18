import Header from './Header';
import ScoreLights from './ScoreLights';
import { useState, useRef, MutableRefObject } from 'react';
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

interface CardProps {
  value: number;
  color: string;
}

interface Player {
  name: string;
  action: PlayerState;
  wonGame: boolean;
  isTurn: boolean;
  hand: CardProps[];
  tally: number;
  table: CardProps[];
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

function PVPGame(): JSX.Element {
  const location = useLocation();
  const selectedHand = location?.state?.selectedHand;
  const [endRoundMessage, setEndRoundMessage] = useState<string>('');
  const [showEndRoundPopup, setShowEndRoundPopup] = useState(false);
  function generateRandomHand() {
    const randomHand = [];
    for (let i = 0; i < 4; i++) {
      const randomValue = Math.floor(Math.random() * 6) + 1;
      const randomColor = Math.random() < 0.5 ? 'blue' : 'red';
      if (randomColor === 'red') {
        const cardProps: CardProps = {
          value: -randomValue,
          color: randomColor,
        };
        randomHand.push(cardProps);
      } else {
        const cardProps: CardProps = { value: randomValue, color: randomColor };
        randomHand.push(cardProps);
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
      ? selectedHand.map((card: DeckCard) => ({
          value: card.value,
          color: card.color,
        }))
      : generateRandomHand(),
    tally: 0,
    table: [],
    gamesWon: 0,
    playedCardThisTurn: false,
  };

  const initialOtherPlayer: Player = {
    name: '',
    action: PlayerState.PLAY,
    wonGame: false,
    isTurn: false,
    hand: generateRandomHand(),
    tally: 0,
    table: [],
    gamesWon: 0,
    playedCardThisTurn: false,
  };

  const [player, setPlayer] = useState(initialPlayer);
  const [otherPlayer, setOtherPlayer] = useState(initialOtherPlayer);
  const [musicChoice] = useState('pvpGame');
  const [gameState, setGameState] = useState(GameState.INITIAL);
  const [sessionID, setSessionID] = useState('');

  const chatRef = useRef();

  function sendUpdateToWebSocket() {
    if (chatRef?.current) {
      chatRef.current.updateGame();
    }
  }

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

  function getNewCardForTable(): CardProps {
    const audio = new Audio(cardflip);
    audio.play();
    const randomNumber = getRandomNumber();
    return { value: randomNumber, color: 'green' };
  }

  function handlePlayerEndTurnButtonClick() {
    const newPlayer = {
      ...player,
      isTurn: false,
      action: PlayerState.ENDTURN,
    };
    setPlayer(newPlayer);

    console.log('newPlayer, newPlayer.action', player, ', ', player.action);

    const card = getNewCardForTable();
    const newOtherPlayer = {
      ...otherPlayer,
      isTurn: true,
      playedCardThisTurn: false,
      tally: otherPlayer.tally + card.value,
      table: [...otherPlayer.table, card],
      action: PlayerState.PLAY,
    };

    if (newPlayer.tally >= 20 || newOtherPlayer.tally >= 20) {
      endOfRoundCleaning(newPlayer, newOtherPlayer);
    } else {
      setGameState(GameState.STARTED);
      setOtherPlayer(newOtherPlayer);
    }
    sendUpdateToWebSocket();
  }

  async function handleOtherPlayerEndTurnButtonClick() {
    const newOtherPlayer = {
      ...otherPlayer,
      isTurn: false,
      action: PlayerState.ENDTURN,
    };
    setOtherPlayer(newOtherPlayer);

    console.log(
      'newPlayer, newPlayer.action',
      otherPlayer,
      ', ',
      otherPlayer.action
    );

    const card = getNewCardForTable();
    const newPlayer = {
      ...player,
      isTurn: true,
      playedCardThisTurn: false,
      tally: otherPlayer.tally + card.value,
      table: [...otherPlayer.table, card],
      action: PlayerState.PLAY,
    };

    if (newPlayer.tally >= 20 || newOtherPlayer.tally >= 20) {
      endOfRoundCleaning(newPlayer, newOtherPlayer);
    } else {
      setGameState(GameState.STARTED);
      setPlayer(newPlayer);
    }
    sendUpdateToWebSocket();
  }

  function getRoundWinner(player: Player, otherPlayer: Player) {
    console.log(
      'Player Score: ',
      player.tally,
      'Other Player Score: ',
      otherPlayer.tally
    );
    const playerBust = player.tally > 20;
    const otherPlayerBust = otherPlayer.tally > 20;
    const otherPlayerWon = otherPlayer.tally <= 20;
    const playerWon = player.tally <= 20;
    const tie = player.tally == otherPlayer.tally;
    const playerLessThanOther = player.tally < otherPlayer.tally;
    const otherPlayerLessThanPlayer = player.tally > otherPlayer.tally;
    const playerReturn = 1;
    const otherPlayerPlayerReturn = 0;
    const tieOrBustReturn = -1;

    if (playerBust && otherPlayerBust) {
      console.log('you both went bust');
      return tieOrBustReturn;
    }
    if (playerBust && otherPlayerWon) {
      console.log('opponent won');
      return otherPlayerPlayerReturn;
    }
    if (otherPlayerBust && playerWon) {
      console.log('you won');
      return playerReturn;
    }
    if (tie) {
      console.log('you tied');
      return tieOrBustReturn;
    }
    if (playerLessThanOther) {
      console.log('opponent won');
      return otherPlayerPlayerReturn;
    }
    if (otherPlayerLessThanPlayer) {
      console.log('you won');
      return playerReturn;
    }
    console.log('the round is over', player.tally, otherPlayer.tally);
  }

  async function handlePlayerStandButtonClick() {
    const newPlayer = {
      ...player,
      isTurn: false,
      action: PlayerState.STAND,
    };
    setPlayer(newPlayer);

    const card = getNewCardForTable();
    const newOtherPlayer = {
      ...otherPlayer,
      isTurn: true,
      playedCardThisTurn: false,
      tally: otherPlayer.tally + card.value,
      table: [...otherPlayer.table, card],
      action: PlayerState.PLAY,
    };
    setOtherPlayer(newOtherPlayer);

    endOfRoundCleaning(newPlayer, newOtherPlayer);
    sendUpdateToWebSocket();
  }

  async function handleOtherPlayerStandButtonClick() {
    const newOtherPlayer = {
      ...otherPlayer,
      isTurn: false,
      action: PlayerState.STAND,
    };
    setOtherPlayer(newOtherPlayer);

    const card = getNewCardForTable();
    const newPlayer = {
      ...player,
      isTurn: true,
      playedCardThisTurn: false,
      tally: otherPlayer.tally + card.value,
      table: [...otherPlayer.table, card],
      action: PlayerState.PLAY,
    };
    setPlayer(newPlayer);

    endOfRoundCleaning(newPlayer, newOtherPlayer);
    sendUpdateToWebSocket();
  }

  async function handleStartButtonClick() {
    const card = getNewCardForTable();
    const newPlayer = {
      ...player,
      isTurn: true,
      playedCardThisTurn: false,
      tally: otherPlayer.tally + card.value,
      table: [...otherPlayer.table, card],
      action: PlayerState.PLAY,
    };
    setPlayer(newPlayer);

    setGameState(GameState.STARTED);
    sendUpdateToWebSocket();
  }

  function endOfRoundCleaning(player: Player, otherPlayer: Player) {
    const winner = getRoundWinner(player, otherPlayer);
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
    setOtherPlayer({
      ...otherPlayer,
      hand: otherPlayer.hand,
      table: [],
      tally: 0,
      action: PlayerState.PLAY,
      gamesWon: winner === 0 ? otherPlayer.gamesWon + 1 : otherPlayer.gamesWon,
      playedCardThisTurn: false,
    });

    setGameState(GameState.INITIAL);
    sendUpdateToWebSocket();
  }

  function moveCard(card: JSX.Element, index: number) {
    // if no cards have been played yet this turn, play a card

    if (
      gameState === GameState.STARTED &&
      !player.playedCardThisTurn &&
      player.isTurn
    ) {
      const audio = new Audio(cardflip);
      audio.play();
      player.hand.splice(index, 1);
      setPlayer({
        ...player,
        hand: player.hand,
        table: [
          ...player.table,
          { value: card.props.value, color: card.props.color },
        ],
        tally: player.tally + card.props.value,
        playedCardThisTurn: true,
      });
      sendUpdateToWebSocket();
    }

    if (
      gameState === GameState.STARTED &&
      !otherPlayer.playedCardThisTurn &&
      otherPlayer.isTurn
    ) {
      const audio = new Audio(cardflip);
      audio.play();
      otherPlayer.hand.splice(index, 1);
      setOtherPlayer({
        ...otherPlayer,
        hand: otherPlayer.hand,
        table: [
          ...otherPlayer.table,
          { value: card.props.value, color: card.props.color },
        ],
        tally: otherPlayer.tally + card.props.value,
        playedCardThisTurn: true,
      });
      sendUpdateToWebSocket();
    }
  }

  const listOfCards = (cards: CardProps[]): JSX.Element[] =>
    cards.map((card) => {
      return (
        <Card value={card.value} color={card.color} cardType="normal_card" />
      );
    });

  return (
    <>
      <Header musicChoice={musicChoice} />
      <div className="scoreBoard">
        <ScoreLights numGamesWon={player.gamesWon} />
        <PlayBar
          playerTally={player.tally}
          opponentTally={otherPlayer.tally}
          isPlayerTurn={player.isTurn}
          gameState={gameState}
        />
        <ScoreLights numGamesWon={otherPlayer.gamesWon} />
      </div>
      <hr />
      <div className="playerBoard">
        <div className="player1">
          <div className="table">
            <Hand hand={listOfCards(player.table)} />
          </div>
          <hr />
          <div className="hand">
            <Hand hand={listOfCards(player.hand)} moveCard={moveCard} />
          </div>
          <div className="turnOptions">
            <GameButtons
              gameState={gameState}
              onStand={handlePlayerStandButtonClick}
              onEndTurn={handlePlayerEndTurnButtonClick}
              onStartGame={handleStartButtonClick}
              isPlayerTurn={player.isTurn}
            />
          </div>
        </div>
        <div className="player2">
          <div className="table">
            <Hand hand={listOfCards(otherPlayer.table)} />
          </div>
          <hr />
          <div className="hand">
            <Hand hand={listOfCards(otherPlayer.hand)} />
          </div>
          <div className="turnOptions">
            <GameButtons
              gameState={gameState}
              onStand={handleOtherPlayerStandButtonClick}
              onEndTurn={handleOtherPlayerEndTurnButtonClick}
              onStartGame={handleStartButtonClick}
              isPlayerTurn={otherPlayer.isTurn}
            />
          </div>
        </div>
        <div className="center-message">
          <EndGamePopup
            numGamesWonPlayer={player.gamesWon}
            numGamesWonOpponent={otherPlayer.gamesWon}
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
      <Chat
        ref={chatRef}
        gameObject={{
          player1: player,
          player2: otherPlayer,
          gameState: gameState,
          sessionID: sessionID,
        }}
        setPlayer={setPlayer}
        setOtherPlayer={setOtherPlayer}
        setGameState={setGameState}
        setSessionID={setSessionID}
      />
    </>
  );
}
export default PVPGame;

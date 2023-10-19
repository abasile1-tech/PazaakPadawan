import Header from './Header';
import ScoreLights from './ScoreLights';
import { useEffect, useState } from 'react';
import Hand from './Hand';
import Card from './Card';
import PlayBar from './PlayBar';
import cardflip from '../assets/music/flipcardfast.mp3';
import { useLocation, useNavigate } from 'react-router-dom';
import GameButtons from './GameButtons';
import EndGamePopup from './EndGamePopUp';
import PopUp from './PopUP/PopUp';
import { over, Client, Frame } from 'stompjs';
import SockJS from 'sockjs-client';
import Chat from './Chat';

let stompClient: Client | null = null;

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

interface Payload {
  body: string;
}

interface GameObject {
  player1: Player;
  player2: Player;
  gameState: GameState;
  sessionID: string;
}

function PVPGame(): JSX.Element {
  const location = useLocation();
  const selectedHand = location?.state?.selectedHand;
  const [endRoundMessage, setEndRoundMessage] = useState<string>('');
  const [showEndRoundPopup, setShowEndRoundPopup] = useState(false);

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
  // const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  async function updateGameObject(
    player: Player,
    otherPlayer: Player,
    sessionID: string,
    gameState: GameState
  ) {
    // await delay(10000);
    if (!stompClient?.connected) {
      console.warn('stompClient is undefined. Unable to send message.');
      return;
    }
    if (sessionID !== '' && player.name !== '') {
      stompClient.send(
        '/app/updateGame',
        {
          id: 'game',
        },
        JSON.stringify({
          player1: player,
          player2: otherPlayer,
          sessionID: sessionID,
          gameState: gameState,
        })
      );
    }
  }

  useEffect(() => {
    updateGameObject(player, otherPlayer, sessionID, gameState);
  }, [player, otherPlayer, sessionID, gameState]);

  const connectToWs = () => {
    // const url = import.meta.env.PROD
    //   ? import.meta.env.VITE_PROD_URL
    //   : import.meta.env.VITE_DEV_URL;
    // const Sock = new SockJS(url + 'ws');
    const Sock = new SockJS('http://192.168.0.5:8080/' + 'ws');
    stompClient = over(Sock);
    stompClient.connect({ login: '', passcode: '' }, onConnected, onError);
  };

  const onConnected = () => {
    if (!stompClient?.connected) {
      console.warn('stompClient is undefined. Unable to subcribe to events.');
      return;
    }

    stompClient.subscribe('/game/updated', onGameUpdatedReceived, {
      id: 'game',
    });
    sendInitialConnectingData();
  };

  const sendInitialConnectingData = () => {
    // We will always set the player1 name to the user name on initial connection.
    // The backend will handle assigning the players.
    const gameObject: GameObject = {
      player1: player,
      player2: otherPlayer,
      gameState: gameState,
      sessionID: sessionID,
    };
    console.log('HERE MO FO', gameObject);
    if (!stompClient?.connected) {
      console.warn('stompClient is undefined. Unable to send message.');
      return;
    }
    stompClient.send(
      '/app/updateGame',
      {
        id: 'game',
      },
      JSON.stringify(gameObject)
    );
  };

  const onError = (err: string | Frame) => {
    console.log(err);
  };

  const onGameUpdatedReceived = (payload: Payload) => {
    const gameObject: GameObject = {
      player1: player,
      player2: otherPlayer,
      gameState: gameState,
      sessionID: sessionID,
    };
    const payloadData = JSON.parse(payload.body);
    console.log('payloadData: ', payloadData);
    if (gameObject.sessionID === payloadData.sessionID) {
      setPlayer(payloadData.player1);
      setOtherPlayer(payloadData.player2);
      setGameState(payloadData.gameState);
      setSessionID(payloadData.sessionID);
    }
  };

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

  // function sendUpdateToWebSocket(
  //   player: Player,
  //   otherPlayer: Player,
  //   gameState: GameState,
  //   sessionID: string
  // ) {
  //   if (player || otherPlayer || gameState || sessionID) {
  //     stompClient?.send(
  //       '/app/updateGame',
  //       {},
  //       JSON.stringify({ player, otherPlayer, gameState, sessionID })
  //     );
  //   }
  // }

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
      // sendUpdateToWebSocket(
      //   newPlayer,
      //   newOtherPlayer,
      //   GameState.STARTED,
      //   sessionID
      // );
    }
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
      // sendUpdateToWebSocket(
      //   newPlayer,
      //   newOtherPlayer,
      //   GameState.STARTED,
      //   sessionID
      // );
    }
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
    // sendUpdateToWebSocket(newPlayer, otherPlayer, GameState.STARTED, sessionID);
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
    const newPlayer = {
      ...player,
      hand: player.hand,
      table: [],
      tally: 0,
      action: PlayerState.PLAY,
      gamesWon: winner === 1 ? player.gamesWon + 1 : player.gamesWon,
      playedCardThisTurn: false,
    };
    setPlayer(newPlayer);
    const newOtherPlayer = {
      ...otherPlayer,
      hand: otherPlayer.hand,
      table: [],
      tally: 0,
      action: PlayerState.PLAY,
      gamesWon: winner === 0 ? otherPlayer.gamesWon + 1 : otherPlayer.gamesWon,
      playedCardThisTurn: false,
    };
    setOtherPlayer(newOtherPlayer);

    setGameState(GameState.INITIAL);
    // sendUpdateToWebSocket(
    //   newPlayer,
    //   newOtherPlayer,
    //   GameState.INITIAL,
    //   sessionID
    // );
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
      const newPlayer = {
        ...player,
        hand: player.hand,
        table: [
          ...player.table,
          { value: card.props.value, color: card.props.color },
        ],
        tally: player.tally + card.props.value,
        playedCardThisTurn: true,
      };
      setPlayer(newPlayer);
      // sendUpdateToWebSocket(newPlayer, otherPlayer, gameState, sessionID);
    }

    if (
      gameState === GameState.STARTED &&
      !otherPlayer.playedCardThisTurn &&
      otherPlayer.isTurn
    ) {
      const audio = new Audio(cardflip);
      audio.play();
      otherPlayer.hand.splice(index, 1);
      const newOtherPlayer = {
        ...otherPlayer,
        hand: otherPlayer.hand,
        table: [
          ...otherPlayer.table,
          { value: card.props.value, color: card.props.color },
        ],
        tally: otherPlayer.tally + card.props.value,
        playedCardThisTurn: true,
      };
      setOtherPlayer(newOtherPlayer);
      // sendUpdateToWebSocket(player, newOtherPlayer, gameState, sessionID);
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
        player1={player}
        setPlayer={setPlayer}
        setSessionID={setSessionID}
        stompClient={stompClient}
        connectToWs={connectToWs}
      />
    </>
  );
}
export default PVPGame;

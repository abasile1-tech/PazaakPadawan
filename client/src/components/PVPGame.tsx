import { Client } from 'stompjs';
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

interface UserData {
  username: string;
  receiverName: string;
  connected: boolean;
  message: string;
}

interface PVPGameProps {
  stompClient: Client;
  userData: UserData;
}

function PVPGame({ stompClient, userData }: PVPGameProps): JSX.Element {
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
  const playerOne: Player = {
    name: 'Player 1',
    action: PlayerState.PLAY,
    wonGame: false,
    isTurn: false,
    hand: [],
    tally: 0,
    table: [],
    gamesWon: 0,
    playedCardThisTurn: false,
  };

  const playerTwo: Player = {
    name: 'Player 2',
    action: PlayerState.PLAY,
    wonGame: false,
    isTurn: false,
    hand: [],
    tally: 0,
    table: [],
    gamesWon: 0,
    playedCardThisTurn: false,
  };

  const [player1, setPlayer1] = useState(playerOne);
  const [player2, setPlayer2] = useState(playerTwo);
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

  function getNewCardForTable(): CardProps {
    const audio = new Audio(cardflip);
    audio.play();
    const randomNumber = getRandomNumber();
    console.log('random number: ', randomNumber);
    return { value: randomNumber, color: 'green' };
  }

  function handlePlayerEndTurnButtonClick() {
    playerOne.isTurn = false;
    playerOne.action = PlayerState.ENDTURN;
    setPlayer1(playerOne);

    const card = getNewCardForTable();
    stompClient.send(
      '/app/updateTable',
      {
        id: 'table',
      },
      JSON.stringify(playerOne.table)
    );
    playerTwo.isTurn = true;
    playerTwo.playedCardThisTurn = false;
    playerTwo.tally += card.value;
    playerTwo.table.push(card);
    playerTwo.action = PlayerState.PLAY;

    if (playerOne.tally >= 20 || playerTwo.tally >= 20) {
      endOfRoundCleaning(playerOne, playerTwo);
    } else {
      setGameState(GameState.STARTED);
      setPlayer2(player2);
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
    playerOne.isTurn = false;
    playerOne.action = PlayerState.STAND;
    setPlayer1(playerOne);

    const card = getNewCardForTable();
    stompClient.send(
      '/app/updateTable',
      {
        id: 'table',
      },
      JSON.stringify(playerOne.table)
    );
    playerTwo.isTurn = true;
    playerTwo.playedCardThisTurn = false;
    playerTwo.tally += card.value;
    playerTwo.table.push(card);
    playerTwo.action = PlayerState.PLAY;
    setPlayer2(playerTwo);

    endOfRoundCleaning(playerOne, playerTwo);
  }

  async function handleStartButtonClick() {
    const card = getNewCardForTable();
    stompClient.send(
      '/app/updateStart',
      {
        id: 'start',
      },
      JSON.stringify('the game has started')
    );

    playerOne.isTurn = true;
    playerOne.playedCardThisTurn = false;
    playerOne.tally += card.value;
    playerOne.table.push(card);
    playerOne.action = PlayerState.PLAY;
    setPlayer1(playerOne);
    stompClient.send(
      '/app/updateTable',
      {
        id: 'table',
      },
      JSON.stringify([...playerOne.table, card])
    );

    setGameState(GameState.STARTED);
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
    playerOne.hand = player.hand;
    playerOne.table = [];
    playerOne.tally = 0;
    playerOne.action = PlayerState.PLAY;
    playerOne.gamesWon = winner === 1 ? player.gamesWon + 1 : player.gamesWon;
    playerOne.playedCardThisTurn = false;
    setPlayer1(playerOne);
    playerTwo.hand = otherPlayer.hand;
    playerTwo.table = [];
    playerTwo.tally = 0;
    playerTwo.action = PlayerState.PLAY;
    playerTwo.gamesWon =
      winner === 0 ? otherPlayer.gamesWon + 1 : otherPlayer.gamesWon;
    playerTwo.playedCardThisTurn = false;

    setGameState(GameState.INITIAL);
  }

  function moveCard(card: JSX.Element, index: number) {
    if (
      gameState === GameState.STARTED &&
      !playerOne.playedCardThisTurn &&
      playerOne.isTurn
    ) {
      const audio = new Audio(cardflip);
      audio.play();
      playerOne.hand.splice(index, 1);
      playerOne.table.push({
        value: card.props.value,
        color: card.props.color,
      });
      playerOne.tally += card.props.value;
      playerOne.playedCardThisTurn = true;
      setPlayer1(playerOne);
    }

    if (
      gameState === GameState.STARTED &&
      !playerTwo.playedCardThisTurn &&
      playerTwo.isTurn
    ) {
      const audio = new Audio(cardflip);
      audio.play();
      playerTwo.hand.splice(index, 1);
      playerTwo.table.push({
        value: card.props.value,
        color: card.props.color,
      });
      playerTwo.tally += card.props.value;
      playerTwo.playedCardThisTurn = true;
      setPlayer2(playerTwo);
    }
  }

  function joinRoom() {
    if (!stompClient) {
      console.warn('stompClient is undefined. Unable to subcribe to events.');
      return;
    }
    stompClient.subscribe('/game/playerName', onPlayerNamesReceived);
    stompClient.subscribe('/game/hand', onHandReceived);
    stompClient.subscribe('/game/table', onTableReceived);
    stompClient.subscribe('/game/start', onStartReceived);
    sendInitialConnectingData();
  }

  const sendInitialConnectingData = () => {
    if (!stompClient) {
      console.warn('stompClient is undefined. Unable to send message.');
      return;
    }
    stompClient.send(
      '/app/updatePlayerName',
      {
        id: 'name',
      },
      JSON.stringify(userData.username)
    );
    stompClient.send(
      '/app/updateHand',
      {
        id: 'hand',
      },
      JSON.stringify(playerOne.hand)
    );
  };

  interface Payload {
    body: string;
  }

  const onPlayerNamesReceived = (payload: Payload) => {
    const payloadData = JSON.parse(payload.body);
    console.log('playerNames:', payloadData);
    console.log('player 1: ', payloadData[1]);
    console.log('player 2: ', payloadData[2]);
    playerOne.name = payloadData[1];
    setPlayer1(playerOne);
    playerTwo.name = payloadData[2];
    setPlayer2(playerTwo);
  };

  function onHandReceived(payload: Payload) {
    const payloadData = JSON.parse(payload.body);
    console.log('Hand payloadData: ', payloadData);
  }

  function onTableReceived(payload: Payload) {
    const payloadData = JSON.parse(payload.body);
    console.log('Table payloadData: ', payloadData);
  }

  function onStartReceived(payload: Payload) {
    const payloadData = JSON.parse(payload.body);
    setGameState(GameState.STARTED);
    console.log('Game Started payloadData: ', payloadData);
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
      <div className="playerNames">
        <h3>
          userData.username: {userData.username} or player1.name:{' '}
          {player1?.name}
        </h3>
        <h3>player2.name: {player2?.name}</h3>
      </div>

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
            <Hand hand={listOfCards(player1.table)} />
          </div>
          <hr />
          <div className="hand">
            <Hand hand={listOfCards(player1.hand)} moveCard={moveCard} />
          </div>
          <div className="turnOptions">
            <GameButtons
              gameState={gameState}
              onStand={handlePlayerStandButtonClick}
              onEndTurn={handlePlayerEndTurnButtonClick}
              onStartGame={handleStartButtonClick}
              isPlayerTurn={player1.isTurn}
            />
          </div>
          <button onClick={joinRoom}>Join Room</button>
        </div>
        <div className="player2">
          <div className="table">
            <Hand hand={listOfCards(player2.table)} />
          </div>
          <hr />
          <div className="hand">
            <Hand hand={listOfCards(player2.hand)} />
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
    </>
  );
}
export default PVPGame;

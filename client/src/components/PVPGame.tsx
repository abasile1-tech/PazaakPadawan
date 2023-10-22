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

interface UserData {
  username: string;
  receiverName: string;
  connected: boolean;
  message: string;
}

interface PVPGameProps {
  stompClient: Client;
  userData: UserData;
  // setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

function PVPGame({ stompClient, userData }: PVPGameProps): JSX.Element {
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

    if (!newPlayer.isTurn && otherPlayer.action != PlayerState.STAND) {
      console.log('otherPlayer.action before', otherPlayer.action);
      const newOtherPlayer = {
        ...otherPlayer,
        tally: otherPlayer.tally + randomNumber,
        table: [...otherPlayer.table, newCard],
        action: PlayerState.PLAY,
      };
      setOtherPlayer(newOtherPlayer);
      console.log('otherPlayer.action after', otherPlayer.action);
      return newOtherPlayer;
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
    const newOtherPlayer = addCardToTable(newPlayer);
    const ePlayer = newOtherPlayer ? newOtherPlayer : otherPlayer;
    await delay(3000); // wait for 3 seconds while the AI "decides..."
    if (newPlayer.tally >= 20 || ePlayer.tally >= 20) {
      await endOfRoundCleaning(ePlayer);
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

  function getRoundWinner(otherPlayer: Player) {
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

  async function handleStandButtonClick() {
    // setGameState(GameState.STAND);
    const newPlayer = {
      ...player,
      isTurn: false,
      action: PlayerState.STAND,
    };
    setPlayer(newPlayer);
    const newOtherPlayer = addCardToTable(newPlayer);
    await delay(3000); // wait for 3 seconds while the AI "decides...";
    await endOfRoundCleaning(newOtherPlayer);
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

  async function endOfRoundCleaning(newOtherPlayer: Player | null) {
    const winner = getRoundWinner(
      newOtherPlayer ? newOtherPlayer : otherPlayer
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

  function joinRoom() {
    if (!stompClient) {
      console.warn('stompClient is undefined. Unable to subcribe to events.');
      return;
    }
    // stompClient.subscribe('/game/gameObject', onGameUpdateReceived);
    stompClient.subscribe('/game/playerName', onPlayerNameReceived);
    sendInitialConnectingData();
  }

  // interface GameObject {
  //   player1: Player;
  //   player2: Player;
  //   gameState: GameState;
  //   // sessionID: string;
  // }

  const sendInitialConnectingData = () => {
    // We will always set the player1 name to the user name on initial connection.
    // The backend will handle assigning the players.
    // const gameObject: GameObject = {
    //   player1: player,
    //   player2: otherPlayer,
    //   gameState: gameState,
    //   // sessionID: sessionID,
    // };
    // console.log('LOOK HERE', gameObject);
    setPlayer({ ...player, name: userData.username });
    console.log('LOOK HERE', userData.username);
    if (!stompClient) {
      console.warn('stompClient is undefined. Unable to send message.');
      return;
    }
    // stompClient.send(
    //   '/app/updateGame',
    //   {
    //     id: 'game',
    //   },
    //   JSON.stringify(gameObject)
    // );
    stompClient.send(
      '/app/updatePlayerName',
      {
        id: 'name',
      },
      JSON.stringify(userData.username)
    );
  };

  interface Payload {
    body: string;
  }

  const onPlayerNameReceived = (payload: Payload) => {
    const payloadData = JSON.parse(payload.body);
    if (payloadData != userData.username) {
      setOtherPlayer({ ...otherPlayer, name: payloadData });
    }
    console.log('payloadData: ', payloadData);
  };

  return (
    <>
      <Header musicChoice={musicChoice} />
      <h3>
        userData.username: {userData.username} or player.name: {player?.name}
      </h3>
      <h3>otherPlayer.name: {otherPlayer?.name}</h3>
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
              isPlayerTurn={player.isTurn}
            />
          </div>
          <button onClick={joinRoom}>Join Room</button>
        </div>
        <div className="player2">
          <div className="table">
            <Hand hand={otherPlayer.table} />
          </div>
          <hr />
          <div className="hand">
            <Hand hand={otherPlayer.hand} />
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
    </>
  );
}
export default PVPGame;

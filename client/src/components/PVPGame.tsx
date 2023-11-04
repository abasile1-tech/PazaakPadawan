import { Client } from 'stompjs';
import Header from './Header';
import { useState } from 'react';
import Hand from './Hand';
import Card from './Card';
import PlayBarPVP from './PlayBarPVP';
import cardflip from '../assets/music/flipcardfast.mp3';
import { useLocation, useNavigate } from 'react-router-dom';
import GameButtons from './GameButtons';
import EndGamePopup from './EndGamePopUp';
import PopUp from './PopUP/PopUp';
import { Player, CardProps, GameState, PlayerState } from '../types';

interface DeckCard {
  value: number;
  color: string;
  selected: boolean;
  imagePath: string;
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
  const initialPlayer: Player = {
    name: 'Player 1',
    action: PlayerState.PLAY,
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
    name: 'Player 2',
    action: PlayerState.PLAY,
    isTurn: false,
    hand: [],
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

  function getNewCardForTable(): CardProps {
    const audio = new Audio(cardflip);
    audio.play();
    const randomNumber = getRandomNumber();
    console.log('random number: ', randomNumber);
    return { value: randomNumber, color: 'green' };
  }

  function handlePlayerEndTurnButtonClick() {
    if (otherPlayer.action === PlayerState.STAND) {
      const card = getNewCardForTable();
      const gameObject: GameObject = {
        player1: {
          ...player,
          isTurn: true,
          playedCardThisTurn: false,
          tally: player.tally + card.value,
          table: [...player.table, card],
          action: PlayerState.PLAY,
        },
        player2: otherPlayer,
        gameState,
        sessionID: '10',
      };
      stompClient.send(
        '/app/updateGame',
        {
          id: 'game',
        },
        JSON.stringify(gameObject)
      );

      if (gameObject.player1.tally >= 20 || gameObject.player2.tally >= 20) {
        endOfRoundCleaning(gameObject.player1, gameObject.player2);
      }

      return;
    }

    const card = getNewCardForTable();
    const gameObject: GameObject = {
      player1: {
        ...player,
        isTurn: false,
        action: PlayerState.ENDTURN,
      },
      player2: {
        ...otherPlayer,
        isTurn: true,
        playedCardThisTurn: false,
        tally: otherPlayer.tally + card.value,
        table: [...otherPlayer.table, card],
        action: PlayerState.PLAY,
      },
      gameState,
      sessionID: '10',
    };
    stompClient.send(
      '/app/updateGame',
      {
        id: 'game',
      },
      JSON.stringify(gameObject)
    );

    if (gameObject.player1.tally >= 20 || gameObject.player2.tally >= 20) {
      endOfRoundCleaning(gameObject.player1, gameObject.player2);
    }
  }

  function handleOtherPlayerEndTurnButtonClick() {
    if (player.action === PlayerState.STAND) {
      const card = getNewCardForTable();
      const gameObject: GameObject = {
        player1: player,
        player2: {
          ...otherPlayer,
          isTurn: true,
          playedCardThisTurn: false,
          tally: otherPlayer.tally + card.value,
          table: [...otherPlayer.table, card],
          action: PlayerState.PLAY,
        },
        gameState,
        sessionID: '10',
      };
      stompClient.send(
        '/app/updateGame',
        {
          id: 'game',
        },
        JSON.stringify(gameObject)
      );

      if (gameObject.player1.tally >= 20 || gameObject.player2.tally >= 20) {
        endOfRoundCleaning(gameObject.player1, gameObject.player2);
      }

      return;
    }

    const card = getNewCardForTable();
    const gameObject: GameObject = {
      player1: {
        ...player,
        isTurn: true,
        playedCardThisTurn: false,
        tally: player.tally + card.value,
        table: [...player.table, card],
        action: PlayerState.PLAY,
      },
      player2: {
        ...otherPlayer,
        isTurn: false,
        action: PlayerState.ENDTURN,
      },
      gameState,
      sessionID: '10',
    };
    stompClient.send(
      '/app/updateGame',
      {
        id: 'game',
      },
      JSON.stringify(gameObject)
    );

    if (gameObject.player1.tally >= 20 || gameObject.player2.tally >= 20) {
      endOfRoundCleaning(gameObject.player1, gameObject.player2);
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

  function handlePlayerStandButtonClick() {
    if (otherPlayer.action === PlayerState.STAND) {
      const gameObject: GameObject = {
        player1: {
          ...player,
          isTurn: false,
          action: PlayerState.STAND,
        },
        player2: otherPlayer,
        gameState,
        sessionID: '10',
      };
      stompClient.send(
        '/app/updateGame',
        {
          id: 'game',
        },
        JSON.stringify(gameObject)
      );

      endOfRoundCleaning(gameObject.player1, gameObject.player2);
      return;
    }

    const card = getNewCardForTable();
    const gameObject: GameObject = {
      player1: {
        ...player,
        isTurn: false,
        action: PlayerState.STAND,
      },
      player2: {
        ...otherPlayer,
        isTurn: true,
        playedCardThisTurn: false,
        tally: otherPlayer.tally + card.value,
        table: [...otherPlayer.table, card],
        action: PlayerState.PLAY,
      },
      gameState,
      sessionID: '10',
    };
    stompClient.send(
      '/app/updateGame',
      {
        id: 'game',
      },
      JSON.stringify(gameObject)
    );
  }

  function handleOtherPlayerStandButtonClick() {
    if (player.action === PlayerState.STAND) {
      const gameObject: GameObject = {
        player1: player,
        player2: {
          ...otherPlayer,
          isTurn: false,
          action: PlayerState.STAND,
        },
        gameState,
        sessionID: '10',
      };
      stompClient.send(
        '/app/updateGame',
        {
          id: 'game',
        },
        JSON.stringify(gameObject)
      );

      endOfRoundCleaning(gameObject.player1, gameObject.player2);
      return;
    }
    const card = getNewCardForTable();
    const gameObject: GameObject = {
      player1: {
        ...player,
        isTurn: true,
        playedCardThisTurn: false,
        tally: player.tally + card.value,
        table: [...player.table, card],
        action: PlayerState.PLAY,
      },
      player2: {
        ...otherPlayer,
        isTurn: false,
        action: PlayerState.STAND,
      },
      gameState,
      sessionID: '10',
    };
    stompClient.send(
      '/app/updateGame',
      {
        id: 'game',
      },
      JSON.stringify(gameObject)
    );
  }

  function handleStartButtonClick() {
    const card = getNewCardForTable();
    const gameObject: GameObject = {
      player1: {
        ...player,
        isTurn: true,
        playedCardThisTurn: false,
        tally: otherPlayer.tally + card.value,
        table: [...otherPlayer.table, card],
        action: PlayerState.PLAY,
      },
      player2: otherPlayer,
      gameState: GameState.STARTED,
      sessionID: '10',
    };
    stompClient.send(
      '/app/updateGame',
      {
        id: 'game',
      },
      JSON.stringify(gameObject)
    );
  }

  function endOfRoundCleaning(player: Player, otherPlayer: Player) {
    // if winner is 1: player won, if winner is 0: otherPlayer won, if winner is -1: tie
    const winner = getRoundWinner(player, otherPlayer);
    if (winner === 1) {
      showEndRoundWinner(`${player.name} WON THE ROUND!`);
    } else if (winner === 0) {
      showEndRoundWinner(`${otherPlayer.name} WON THE ROUND!`);
    } else if (winner === -1) {
      showEndRoundWinner('THIS ROUND IS TIED');
    }

    const gameObject: GameObject = {
      player1: {
        ...player,
        hand: player.hand,
        table: [],
        tally: 0,
        action: PlayerState.PLAY,
        gamesWon: winner === 1 ? player.gamesWon + 1 : player.gamesWon,
        playedCardThisTurn: false,
      },
      player2: {
        ...otherPlayer,
        hand: otherPlayer.hand,
        table: [],
        tally: 0,
        action: PlayerState.PLAY,
        gamesWon:
          winner === 0 ? otherPlayer.gamesWon + 1 : otherPlayer.gamesWon,
        playedCardThisTurn: false,
      },
      gameState: GameState.INITIAL,
      sessionID: '10',
    };
    stompClient.send(
      '/app/updateGame',
      {
        id: 'game',
      },
      JSON.stringify(gameObject)
    );
  }

  function movePlayerCard(card: JSX.Element, index: number) {
    // if no cards have been played yet this turn, play a card

    if (
      gameState === GameState.STARTED &&
      !player.playedCardThisTurn &&
      player.isTurn
    ) {
      const audio = new Audio(cardflip);
      audio.play();
      player.hand.splice(index, 1);

      const gameObject: GameObject = {
        player1: {
          ...player,
          hand: player.hand,
          table: [
            ...player.table,
            { value: card.props.value, color: card.props.color },
          ],
          tally: player.tally + card.props.value,
          playedCardThisTurn: true,
        },
        player2: otherPlayer,
        gameState,
        sessionID: '10',
      };
      stompClient.send(
        '/app/updateGame',
        {
          id: 'game',
        },
        JSON.stringify(gameObject)
      );
    }
  }

  function moveOtherPlayerCard(card: JSX.Element, index: number) {
    // if no cards have been played yet this turn, play a card

    if (
      gameState === GameState.STARTED &&
      !otherPlayer.playedCardThisTurn &&
      otherPlayer.isTurn
    ) {
      const audio = new Audio(cardflip);
      audio.play();
      otherPlayer.hand.splice(index, 1);
      const gameObject: GameObject = {
        player1: player,
        player2: {
          ...otherPlayer,
          hand: otherPlayer.hand,
          table: [
            ...otherPlayer.table,
            { value: card.props.value, color: card.props.color },
          ],
          tally: otherPlayer.tally + card.props.value,
          playedCardThisTurn: true,
        },
        gameState,
        sessionID: '10',
      };
      stompClient.send(
        '/app/updateGame',
        {
          id: 'game',
        },
        JSON.stringify(gameObject)
      );
    }
  }

  function joinRoom() {
    if (!stompClient) {
      console.warn('stompClient is undefined. Unable to subcribe to events.');
      return;
    }
    stompClient.subscribe('/game/gameObject', onGameUpdateReceived);
    stompClient.subscribe('/game/deleteGameObject', onDeleteSessionReceived);
    sendInitialConnectingData();
  }

  interface GameObject {
    player1: Player;
    player2: Player;
    gameState: GameState;
    sessionID: string;
  }

  const sendInitialConnectingData = () => {
    // We will always set the player1 name to the user name on initial connection.
    // The backend will handle assigning the players.
    const gameObject: GameObject = {
      player1: { ...player, name: userData.username },
      player2: otherPlayer,
      gameState: gameState,
      sessionID: '10',
    };
    if (!stompClient) {
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

  interface Payload {
    body: string;
  }

  function onGameUpdateReceived(payload: Payload) {
    const payloadData = JSON.parse(payload.body);

    setPlayer(() => {
      return { ...payloadData.player1 };
    });

    setOtherPlayer(() => {
      return { ...payloadData.player2 };
    });

    setGameState(() => {
      return payloadData.gameState;
    });
  }

  function onDeleteSessionReceived(payload: Payload) {
    console.log('PLAYLOAD', payload.body);
    if (payload.body) {
      const gameObject: GameObject = {
        player1: initialPlayer,
        player2: initialOtherPlayer,
        gameState: GameState.INITIAL,
        sessionID: '10',
      };
      stompClient.send(
        '/app/updateGame',
        {
          id: 'game',
        },
        JSON.stringify(gameObject)
      );
    }
  }

  function deleteSession() {
    const gameObject: GameObject = {
      player1: player,
      player2: otherPlayer,
      gameState: gameState,
      sessionID: '10',
    };
    stompClient.send(
      '/app/deleteGame',
      {
        id: 'delete',
      },
      JSON.stringify(gameObject)
    );
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
      <button onClick={deleteSession}>Delete Session</button>
      <div className="scoreBoard">
        <PlayBarPVP
          player={player}
          otherPlayer={otherPlayer}
          gameState={gameState}
        />
      </div>
      <hr />
      <div className="playerBoard">
        <div className="player1">
          <p>Is Turn: {player.isTurn ? 'true' : 'false'}</p>
          <div className="table">
            <Hand hand={listOfCards(player.table)} />
          </div>
          <hr />
          <div className="hand">
            <Hand
              hand={listOfCards(player.hand)}
              moveCard={
                player.isTurn && player.name == userData.username
                  ? movePlayerCard
                  : () => {}
              }
            />
          </div>
          <div className="turnOptions">
            {player.name == userData.username ? (
              <GameButtons
                gameState={gameState}
                onStand={handlePlayerStandButtonClick}
                onEndTurn={handlePlayerEndTurnButtonClick}
                onStartGame={handleStartButtonClick}
                isTurn={player.isTurn}
              />
            ) : (
              <div></div>
            )}
          </div>
          <button onClick={joinRoom}>Join Room</button>
        </div>
        <div className="player2">
          <p>Is Turn: {otherPlayer.isTurn ? 'true' : 'false'}</p>
          <div className="table">
            <Hand hand={listOfCards(otherPlayer.table)} />
          </div>
          <hr />
          <div className="hand">
            <Hand
              hand={listOfCards(otherPlayer.hand)}
              moveCard={
                otherPlayer.isTurn && otherPlayer.name == userData.username
                  ? moveOtherPlayerCard
                  : () => {}
              }
            />
          </div>
          <div className="turnOptions">
            {otherPlayer.name == userData.username ? (
              <GameButtons
                gameState={gameState}
                onStand={handleOtherPlayerStandButtonClick}
                onEndTurn={handleOtherPlayerEndTurnButtonClick}
                onStartGame={handleStartButtonClick}
                isTurn={otherPlayer.isTurn}
              />
            ) : (
              <div></div>
            )}
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

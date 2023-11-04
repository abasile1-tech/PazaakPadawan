import { Client } from 'stompjs';
import Header from './Header';
import { useState } from 'react';
import Hand from './Hand';
import Card from './Card';
import PlayBarPVP from './PlayBarPVP';
import cardflip from '../assets/music/flipcardfast.mp3';
import { useLocation, useNavigate } from 'react-router-dom';
import GameButtons from './GameButtons';
import EndGamePopupPVP from './EndGamePopUpPVP';
import PopUp from './PopUP/PopUp';
import {
  Player,
  CardProps,
  GameState,
  PlayerState,
  WonRoundState,
  UserData,
} from '../types';

interface DeckCard {
  value: number;
  color: string;
  selected: boolean;
  imagePath: string;
}

interface PVPGameProps {
  stompClient: Client;
  userData: UserData;
}

function PVPGame({ stompClient, userData }: PVPGameProps): JSX.Element {
  const location = useLocation();
  const selectedHand = location?.state?.selectedHand;
  const [endRoundMessage, setEndRoundMessage] = useState<string>('');

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
    roundsWon: 0,
    wonRound: WonRoundState.UNDECIDED,
    playedCardThisTurn: false,
  };

  const initialOtherPlayer: Player = {
    name: 'Player 2',
    action: PlayerState.PLAY,
    isTurn: false,
    hand: [],
    tally: 0,
    table: [],
    roundsWon: 0,
    wonRound: WonRoundState.UNDECIDED,
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

  function getWonRoundState(winner: 1 | 0 | -1 | undefined) {
    if (winner === 1) {
      return [WonRoundState.WON, WonRoundState.LOST];
    }
    if (winner === 0) {
      return [WonRoundState.LOST, WonRoundState.WON];
    }
    if (winner === -1) {
      return [WonRoundState.TIED, WonRoundState.TIED];
    }
    console.warn(
      'Returning undecided for player and other player WonRoundState'
    );
    return [WonRoundState.UNDECIDED, WonRoundState.UNDECIDED];
  }

  function endOfRoundCleaning(player: Player, otherPlayer: Player) {
    // if winner is 1: player won, if winner is 0: otherPlayer won, if winner is -1: tie
    const winner = getRoundWinner(player, otherPlayer);
    // if (winner === 1) {
    //   showEndRoundWinner(`${player.name} WON THE ROUND!`);
    // } else if (winner === 0) {
    //   showEndRoundWinner(`${otherPlayer.name} WON THE ROUND!`);
    // } else if (winner === -1) {
    //   showEndRoundWinner('THIS ROUND IS TIED');
    // }

    const [playerWonRound, otherPlayerWonRound] = getWonRoundState(winner);
    console.log('PLAYER', playerWonRound, 'OTHER PLAYER', otherPlayerWonRound);
    const gameObject: GameObject = {
      player1: {
        ...player,
        hand: player.hand,
        table: [],
        tally: 0,
        action: PlayerState.PLAY,
        roundsWon: winner === 1 ? player.roundsWon + 1 : player.roundsWon,
        wonRound: playerWonRound,
        playedCardThisTurn: false,
      },
      player2: {
        ...otherPlayer,
        hand: otherPlayer.hand,
        table: [],
        tally: 0,
        action: PlayerState.PLAY,
        roundsWon:
          winner === 0 ? otherPlayer.roundsWon + 1 : otherPlayer.roundsWon,
        wonRound: otherPlayerWonRound,
        playedCardThisTurn: false,
      },
      gameState: GameState.ENDED,
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

    setEndRoundMessage(() => {
      if (
        payloadData.player1.roundsWon === 3 ||
        payloadData.player2.roundsWon === 3
      ) {
        return '';
      }
      if (payloadData.player1.wonRound === WonRoundState.WON) {
        return `${payloadData.player1.name} WON THE ROUND!`;
      }
      if (payloadData.player2.wonRound === WonRoundState.WON) {
        return `${payloadData.player2.name} WON THE ROUND!`;
      }
      if (payloadData.player1.wonRound === WonRoundState.TIED) {
        return 'IT WAS A TIE!';
      }
      return '';
    });

    setPlayer(() => {
      return { ...payloadData.player1 };
    });

    setOtherPlayer(() => {
      return { ...payloadData.player2 };
    });

    // This is not updating
    setGameState(() => {
      return payloadData.gameState;
    });
  }

  function dismissPopup() {
    const gameObject: GameObject = {
      player1: { ...player, wonRound: WonRoundState.UNDECIDED },
      player2: { ...otherPlayer, wonRound: WonRoundState.UNDECIDED },
      gameState: gameState,
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
        <PlayBarPVP
          player={player}
          otherPlayer={otherPlayer}
          gameState={gameState}
        />
      </div>
      <hr />
      <div className="playerBoard">
        <div className="player1">
          <h3>
            {player.name}{' '}
            {player.action === PlayerState.STAND ? 'STOOD' : 'Still playing...'}
          </h3>
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
          <h3>
            {otherPlayer.name}{' '}
            {otherPlayer.action === PlayerState.STAND
              ? 'STOOD'
              : 'Still playing...'}
          </h3>
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
          <EndGamePopupPVP
            player={player}
            otherPlayer={otherPlayer}
            userData={userData}
            handleGameOverClick={handleGameOverClick}
          />
        </div>
        <div className="center-message">
          {endRoundMessage !== '' && (
            <PopUp
              message={endRoundMessage}
              buttonText="OK"
              onClick={dismissPopup}
            />
          )}
        </div>
      </div>
    </>
  );
}
export default PVPGame;

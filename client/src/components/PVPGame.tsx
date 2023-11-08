import Header from './Header';
import { useState } from 'react';
import Hand from './Hand';
import Card from './Card';
import PlayBarPVP from './PlayBarPVP';
import cardflip from '../assets/music/flipcardfast.mp3';
import { useLocation, useNavigate } from 'react-router-dom';
import EndGamePopupPVP from './EndGamePopUpPVP';
import PopUp from './PopUP/PopUp';
import {
  PlayerPVP,
  CardPropsPVP,
  GameState,
  PlayerState,
  WonRoundState,
  PVPGameProps,
  DeckCard,
  GameObject,
  Payload,
} from '../types';
import GameButtonsPVP from './GameButtonsPVP';

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
        const cardProps: CardPropsPVP = {
          value: -randomValue,
          color: randomColor,
        };
        randomHand.push(cardProps);
      } else {
        const cardProps: CardPropsPVP = {
          value: randomValue,
          color: randomColor,
        };
        randomHand.push(cardProps);
      }
    }
    return randomHand;
  }

  async function sendGameData(gameObject: GameObject) {
    stompClient.send(
      '/app/updateGame',
      {
        id: 'game',
      },
      JSON.stringify(gameObject)
    );
  }

  async function sendGameDataForDeletion(gameObject: GameObject) {
    stompClient.send(
      '/app/deleteGame',
      {
        id: 'game',
      },
      JSON.stringify(gameObject)
    );
  }

  const initialPlayer: PlayerPVP = {
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

  const initialOtherPlayer: PlayerPVP = {
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

  async function handleGameOverClick() {
    const gameObject: GameObject = {
      player1: player,
      player2: otherPlayer,
      gameState,
      sessionID: '10',
    };
    await sendGameDataForDeletion(gameObject);
    navigate('/');
  }

  function getRandomNumber(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  function getNewCardForTable(): CardPropsPVP {
    const audio = new Audio(cardflip);
    audio.play();
    const randomNumber = getRandomNumber();
    return { value: randomNumber, color: 'green' };
  }

  const eitherScoreOverTwenty = (gameObject: GameObject) => {
    if (gameObject.player1.tally > 20 || gameObject.player2.tally > 20) {
      endOfRoundCleaning(gameObject.player1, gameObject.player2);
      return true;
    } else {
      return false;
    }
  };

  async function handlePlayerEndTurnButtonClick() {
    if (otherPlayer.action === PlayerState.STAND) {
      const gameObject: GameObject = {
        player1: player,
        player2: otherPlayer,
        gameState,
        sessionID: '10',
      };
      if (!eitherScoreOverTwenty(gameObject)) {
        const card = getNewCardForTable();
        gameObject.player1.tally = player.tally + card.value;
        gameObject.player1.table.push(card);
        gameObject.player1.isTurn = true;
        gameObject.player1.playedCardThisTurn = false;
        gameObject.player1.action = PlayerState.PLAY;

        await sendGameData(gameObject);
      }

      return;
    }

    const gameObject: GameObject = {
      player1: player,
      player2: otherPlayer,
      gameState,
      sessionID: '10',
    };
    if (!eitherScoreOverTwenty(gameObject)) {
      const card = getNewCardForTable();
      gameObject.player1.isTurn = false;
      gameObject.player1.action = PlayerState.ENDTURN;
      gameObject.player2.isTurn = true;
      gameObject.player2.playedCardThisTurn = false;
      gameObject.player2.tally = otherPlayer.tally + card.value;
      gameObject.player2.table.push(card);
      gameObject.player2.action = PlayerState.PLAY;

      await sendGameData(gameObject);
    }
  }

  async function handleOtherPlayerEndTurnButtonClick() {
    if (player.action === PlayerState.STAND) {
      const gameObject: GameObject = {
        player1: player,
        player2: otherPlayer,
        gameState,
        sessionID: '10',
      };
      if (!eitherScoreOverTwenty(gameObject)) {
        const card = getNewCardForTable();
        gameObject.player2.tally = otherPlayer.tally + card.value;
        gameObject.player2.table.push(card);
        gameObject.player2.isTurn = true;
        gameObject.player2.playedCardThisTurn = false;
        gameObject.player2.action = PlayerState.PLAY;

        await sendGameData(gameObject);
      }

      return;
    }

    const gameObject: GameObject = {
      player1: player,
      player2: otherPlayer,
      gameState,
      sessionID: '10',
    };
    if (!eitherScoreOverTwenty(gameObject)) {
      const card = getNewCardForTable();
      gameObject.player2.isTurn = false;
      gameObject.player2.action = PlayerState.ENDTURN;
      gameObject.player1.isTurn = true;
      gameObject.player1.playedCardThisTurn = false;
      gameObject.player1.tally = player.tally + card.value;
      gameObject.player1.table.push(card);
      gameObject.player1.action = PlayerState.PLAY;

      await sendGameData(gameObject);
    }
  }

  function getRoundWinner(player: PlayerPVP, otherPlayer: PlayerPVP) {
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
      return tieOrBustReturn;
    }
    if (playerBust && otherPlayerWon) {
      return otherPlayerPlayerReturn;
    }
    if (otherPlayerBust && playerWon) {
      return playerReturn;
    }
    if (tie) {
      return tieOrBustReturn;
    }
    if (playerLessThanOther) {
      return otherPlayerPlayerReturn;
    }
    if (otherPlayerLessThanPlayer) {
      return playerReturn;
    }
  }

  async function handlePlayerStandButtonClick() {
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
    await sendGameData(gameObject);
  }

  async function handleOtherPlayerStandButtonClick() {
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
    await sendGameData(gameObject);
  }

  async function handleStartButtonClick() {
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
    await sendGameData(gameObject);
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

  async function endOfRoundCleaning(player: PlayerPVP, otherPlayer: PlayerPVP) {
    // if winner is 1: player won, if winner is 0: otherPlayer won, if winner is -1: tie
    const winner = getRoundWinner(player, otherPlayer);
    const [playerWonRound, otherPlayerWonRound] = getWonRoundState(winner);
    const gameObject: GameObject = {
      player1: {
        ...player,
        action: PlayerState.PLAY,
        roundsWon: winner === 1 ? player.roundsWon + 1 : player.roundsWon,
        wonRound: playerWonRound,
        playedCardThisTurn: false,
      },
      player2: {
        ...otherPlayer,
        action: PlayerState.PLAY,
        roundsWon:
          winner === 0 ? otherPlayer.roundsWon + 1 : otherPlayer.roundsWon,
        wonRound: otherPlayerWonRound,
        playedCardThisTurn: false,
      },
      gameState: GameState.ENDED,
      sessionID: '10',
    };
    await sendGameData(gameObject);
  }

  async function movePlayerCard(card: JSX.Element, index: number) {
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
      await sendGameData(gameObject);
    }
  }

  async function moveOtherPlayerCard(card: JSX.Element, index: number) {
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
      await sendGameData(gameObject);
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

  async function sendInitialConnectingData() {
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
    await sendGameData(gameObject);
  }

  function onGameUpdateReceived(payload: Payload) {
    const payloadData = JSON.parse(payload.body);
    const gameOver =
      payloadData.player1.roundsWon === 3 ||
      payloadData.player2.roundsWon === 3;

    setEndRoundMessage(() => {
      if (gameOver) {
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

    setGameState(() => {
      return payloadData.gameState;
    });
  }

  async function dismissPopup() {
    const gameObject: GameObject = {
      player1: {
        ...player,
        table: [],
        tally: 0,
        wonRound: WonRoundState.UNDECIDED,
      },
      player2: {
        ...otherPlayer,
        table: [],
        tally: 0,
        wonRound: WonRoundState.UNDECIDED,
      },
      gameState: gameState,
      sessionID: '10',
    };
    await sendGameData(gameObject);
  }

  const listOfCards = (cards: CardPropsPVP[]): JSX.Element[] =>
    cards.map((card) => {
      return (
        <Card value={card.value} color={card.color} cardType="normal_card" />
      );
    });

  return (
    <>
      <Header musicChoice={musicChoice} />
      <div>
        <PlayBarPVP player={player} otherPlayer={otherPlayer} />
      </div>
      <hr />
      <div className="playerBoard">
        <div className="player1">
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
              <GameButtonsPVP
                gameState={gameState}
                onStand={handlePlayerStandButtonClick}
                onEndTurn={handlePlayerEndTurnButtonClick}
                onStartGame={handleStartButtonClick}
                isTurn={player.isTurn}
              />
            ) : (
              <div>
                <p style={{ marginRight: '2em' }}>
                  {player.action === PlayerState.STAND ? 'stood' : ''}
                </p>
              </div>
            )}
          </div>
          <button onClick={joinRoom}>Join Room</button>
          <button onClick={handleGameOverClick}>Delete Room</button>
        </div>
        <div className="player2">
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
              <GameButtonsPVP
                gameState={gameState}
                onStand={handleOtherPlayerStandButtonClick}
                onEndTurn={handleOtherPlayerEndTurnButtonClick}
                onStartGame={handleStartButtonClick}
                isTurn={otherPlayer.isTurn}
              />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p>{otherPlayer.action === PlayerState.STAND ? 'stood' : ''}</p>
              </div>
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

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
import popup from '../assets/music/8bitpopupmessage.mp3';
import { DeckCard, GameState, PlayerState, SoloPlayer } from '../types';

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

  const initialPlayer: SoloPlayer = {
    name: '',
    action: PlayerState.PLAY,
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

  const initialComputerPlayer: SoloPlayer = {
    name: '',
    action: PlayerState.PLAY,
    isTurn: false,
    hand: generateRandomHand(),
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

  function addCardToTable(newPlayer: SoloPlayer): SoloPlayer | null {
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
      return null;
    }

    if (!newPlayer.isTurn && computerPlayer.action != PlayerState.STAND) {
      const newComputerPlayer = {
        ...computerPlayer,
        tally: computerPlayer.tally + randomNumber,
        table: [...computerPlayer.table, newCard],
        action: PlayerState.PLAY,
      };
      setComputerPlayer(newComputerPlayer);
      return newComputerPlayer;
    }
    return null;
  }

  async function computerPlayerDecision(cPlayer: SoloPlayer) {
    await delay(3000); // wait for 3 seconds while the AI "decides..."
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
        if (bestCardIndex !== -1) {
          const [playedCard] = cPlayer.hand.splice(bestCardIndex, 1);
          const newComputerPlayer = {
            ...cPlayer,
            hand: [...cPlayer.hand],
            tally: playedCard.props.value + cPlayer.tally,
            table: [...cPlayer.table, playedCard],
            action: PlayerState.STAND,
          };
          setComputerPlayer(newComputerPlayer);
          await delay(3000); // wait for 3 seconds while the AI "decides..."
        }
      } else {
        const newComputerPlayer = {
          ...cPlayer,
          action: PlayerState.STAND,
        };
        setComputerPlayer(newComputerPlayer);
      }
    } else if (cPlayer.tally >= 17 && cPlayer.tally <= 20) {
      if (Math.random() < 0.7) {
        const newComputerPlayer = {
          ...cPlayer,
          action: PlayerState.STAND,
        };
        setComputerPlayer(newComputerPlayer);
      } else {
        const newComputerPlayer = {
          ...cPlayer,
          action: PlayerState.PLAY,
        };
        setComputerPlayer(newComputerPlayer);
      }
    } else if (cPlayer.tally < 17) {
      const newComputerPlayer = {
        ...cPlayer,
        action: PlayerState.PLAY,
      };
      setComputerPlayer(newComputerPlayer);
    }
  }

  async function handleEndTurnButtonClick() {
    const newPlayer = {
      ...player,
      isTurn: false,
      action: PlayerState.ENDTURN,
    };
    setPlayer(newPlayer);
    const newComputerPlayer = addCardToTable(newPlayer);
    const cPlayer = newComputerPlayer ? newComputerPlayer : computerPlayer;

    await computerPlayerDecision(cPlayer);

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

  function getRoundWinner(computerPlayer: SoloPlayer) {
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
      return tieOrBustReturn;
    }
    if (playerBust && computerWon) {
      return computerPlayerReturn;
    }
    if (computerBust && playerWon) {
      return playerReturn;
    }
    if (tie) {
      return tieOrBustReturn;
    }
    if (playerLessThanComputer) {
      return computerPlayerReturn;
    }
    if (computerLessThanPlayer) {
      return playerReturn;
    }
  }

  async function handleStandButtonClick() {
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

  async function endOfRoundCleaning(newComputerPlayer: SoloPlayer | null) {
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
              isTurn={player.isTurn}
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
          {showEndRoundPopup &&
            player.gamesWon !== 3 &&
            computerPlayer.gamesWon !== 3 && (
              <PopUp
                audiofile={popup}
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

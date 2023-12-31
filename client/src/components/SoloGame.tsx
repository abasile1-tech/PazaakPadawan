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
  const cardNoise = new Audio(cardflip);

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
  const musicChoice = 'soloGame';
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

  function giveCardToPlayer(
    newPlayer: SoloPlayer,
    randomNumber: number,
    newCard: JSX.Element
  ) {
    setPlayer({
      ...newPlayer,
      tally: newPlayer.tally + randomNumber,
      table: [...newPlayer.table, newCard],
      action: PlayerState.PLAY,
    });
    cardNoise.play();
    return null;
  }

  function giveCardToComputer(
    passedComputerPlayer: SoloPlayer,
    randomNumber: number,
    newCard: JSX.Element
  ) {
    const newComputerPlayer = {
      ...passedComputerPlayer,
      tally: passedComputerPlayer.tally + randomNumber,
      table: [...passedComputerPlayer.table, newCard],
      action: PlayerState.PLAY,
    };
    setComputerPlayer(() => {
      return newComputerPlayer;
    });
    cardNoise.play();
    return newComputerPlayer;
  }

  function addCardToTable(
    newPlayer: SoloPlayer,
    passedComputerPlayer: SoloPlayer
  ): SoloPlayer | null {
    const randomNumber = getRandomNumber();
    const newCard = (
      <Card value={randomNumber} color="green" cardType="normal_card" />
    );
    if (newPlayer.isTurn && newPlayer.action != PlayerState.STAND) {
      giveCardToPlayer(newPlayer, randomNumber, newCard);
      return null;
    } else if (
      !newPlayer.isTurn &&
      computerPlayer.action != PlayerState.STAND
    ) {
      return giveCardToComputer(passedComputerPlayer, randomNumber, newCard);
    } else {
      return null;
    }
  }

  async function computerPlayCard(cPlayer: SoloPlayer, bestCardIndex: number) {
    const [playedCard] = cPlayer.hand.splice(bestCardIndex, 1);
    const newComputerPlayer = {
      ...cPlayer,
      hand: [...cPlayer.hand],
      tally: playedCard.props.value + cPlayer.tally,
      table: [...cPlayer.table, playedCard],
    };
    cardNoise.play();
    setComputerPlayer(() => {
      return newComputerPlayer;
    });
    await delay(3000); // wait for 3 seconds while the AI "decides..."
    return newComputerPlayer;
  }

  async function checkCards(cPlayer: SoloPlayer) {
    let bestCardIndex = -1;
    if (cPlayer.tally < 20) {
      let bestSum = cPlayer.tally;
      // Check to see if you have any cards that can get you between 18 and 20
      for (let i = 0; i < cPlayer.hand.length; i++) {
        const card = cPlayer.hand[i];
        const sum = cPlayer.tally + card.props.value;
        if (sum >= 18 && sum <= 20 && sum > bestSum) {
          bestSum = sum;
          bestCardIndex = i;
        }
      }
    } else if (cPlayer.tally > 20) {
      let bestSum = 0;
      // Check to see if you have any cards that can get you back to 20 or under 20
      for (let i = 0; i < cPlayer.hand.length; i++) {
        const card = cPlayer.hand[i];
        const sum = cPlayer.tally + card.props.value;
        if (sum <= 20 && sum > bestSum) {
          bestSum = sum;
          bestCardIndex = i;
        }
      }
    }

    if (bestCardIndex !== -1) {
      const newComputerPlayer = await computerPlayCard(cPlayer, bestCardIndex);
      return newComputerPlayer;
    } else {
      return cPlayer;
    }
  }

  function chooseToStand(cPlayer: SoloPlayer) {
    const newComputerPlayer = {
      ...cPlayer,
      action: PlayerState.STAND,
    };
    setComputerPlayer(() => {
      return newComputerPlayer;
    });
    return newComputerPlayer;
  }

  function chooseToPlay(cPlayer: SoloPlayer) {
    const newComputerPlayer = {
      ...cPlayer,
      action: PlayerState.PLAY,
    };
    setComputerPlayer(() => {
      return newComputerPlayer;
    });
    return newComputerPlayer;
  }

  function playerStand(): SoloPlayer {
    const newPlayer = {
      ...player,
      isTurn: false,
      action: PlayerState.STAND,
    };
    setPlayer(newPlayer);
    return newPlayer;
  }

  function playerEndTurn(): SoloPlayer {
    const newPlayer = {
      ...player,
      isTurn: false,
      action: PlayerState.ENDTURN,
    };
    setPlayer(newPlayer);
    return newPlayer;
  }

  function playerStarted() {
    setGameState(GameState.STARTED);
    const newPlayer = {
      ...player,
      isTurn: true,
      playedCardThisTurn: false,
    };
    setPlayer(newPlayer);
    addCardToTable(newPlayer, computerPlayer);
  }

  async function computerPlayerDecision(cPlayer: SoloPlayer) {
    await delay(3000); // wait for 3 seconds while the AI "decides..."
    if (cPlayer.tally === 20) {
      const newCPlayer = chooseToStand(cPlayer);
      return newCPlayer;
    } else if (cPlayer.hand.length > 0) {
      const newComputerPlayer = await checkCards(cPlayer);
      if (newComputerPlayer.tally === 20) {
        const newCPlayer = chooseToStand(newComputerPlayer);
        return newCPlayer;
      } else if (
        newComputerPlayer.tally >= 18 &&
        newComputerPlayer.tally < 20
      ) {
        if (
          player.tally >= newComputerPlayer.tally &&
          player.tally <= 20 &&
          player.action === PlayerState.STAND
        ) {
          const newCPlayer = chooseToPlay(newComputerPlayer);
          return newCPlayer;
        } else {
          const newCPlayer = chooseToStand(newComputerPlayer);
          return newCPlayer;
        }
      } else if (newComputerPlayer.tally < 18) {
        const newCPlayer = chooseToPlay(newComputerPlayer);
        return newCPlayer;
      } else if (newComputerPlayer.tally > 20) {
        const newCPlayer = chooseToPlay(newComputerPlayer);
        return newCPlayer;
      }
      return cPlayer;
    }
    if (cPlayer.tally >= 18 && cPlayer.tally <= 20) {
      if (Math.random() < 0.9) {
        chooseToStand(cPlayer);
        return;
      } else {
        chooseToPlay(cPlayer);
        return;
      }
    } else if (cPlayer.tally < 18) {
      chooseToPlay(cPlayer);
      return;
    }
  }

  async function giveTurnToComputer(
    newPlayer: SoloPlayer,
    passedComputerPlayer: SoloPlayer
  ) {
    let someOneEndedOverTwenty =
      newPlayer.tally > 20 || passedComputerPlayer.tally > 20;
    let bothStood =
      newPlayer.action === PlayerState.STAND &&
      passedComputerPlayer.action === PlayerState.STAND;
    if (someOneEndedOverTwenty || bothStood) {
      await endOfRoundCleaning(passedComputerPlayer);
      return;
    }
    if (passedComputerPlayer.action != PlayerState.STAND) {
      const newComputerPlayer = addCardToTable(newPlayer, passedComputerPlayer);
      const cPlayer = newComputerPlayer
        ? newComputerPlayer
        : passedComputerPlayer;
      const newCPlayer = await computerPlayerDecision(cPlayer);
      const newerCPlayer = newCPlayer ? newCPlayer : passedComputerPlayer;
      someOneEndedOverTwenty = newPlayer.tally > 20 || newerCPlayer.tally > 20;
      bothStood =
        newPlayer.action === PlayerState.STAND &&
        newerCPlayer.action === PlayerState.STAND;
      if (someOneEndedOverTwenty || bothStood) {
        await endOfRoundCleaning(newerCPlayer);
        return;
      } else if (newPlayer.action != PlayerState.STAND) {
        playerStarted();
        return;
      } else {
        await giveTurnToComputer(newPlayer, newerCPlayer);
        return;
      }
    } else if (newPlayer.action != PlayerState.STAND) {
      playerStarted();
      return;
    } else {
      await giveTurnToComputer(newPlayer, passedComputerPlayer);
      return;
    }
  }

  async function handleEndTurnButtonClick() {
    const newPlayer = playerEndTurn();
    await giveTurnToComputer(newPlayer, computerPlayer);
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
    const newPlayer = playerStand();
    let newCPlayer;
    if (computerPlayer.action != PlayerState.STAND) {
      const newComputerPlayer = addCardToTable(newPlayer, computerPlayer);
      const cPlayer = newComputerPlayer ? newComputerPlayer : computerPlayer;
      newCPlayer = await computerPlayerDecision(cPlayer);
    }
    const newerCPlayer = newCPlayer ? newCPlayer : computerPlayer;
    const someOneEndedOverTwenty =
      newPlayer.tally > 20 || newerCPlayer.tally > 20;
    const bothStood =
      newPlayer.action === PlayerState.STAND &&
      newerCPlayer.action === PlayerState.STAND;
    if (someOneEndedOverTwenty || bothStood) {
      await endOfRoundCleaning(newerCPlayer);
      return;
    } else if (newerCPlayer.action != PlayerState.STAND) {
      await giveTurnToComputer(newPlayer, newerCPlayer);
      return;
    } else {
      await endOfRoundCleaning(newerCPlayer);
      return;
    }
  }

  function handleStartButtonClick() {
    const newPlayer = {
      ...player,
      isTurn: true,
      playedCardThisTurn: false,
    };
    setPlayer(newPlayer);
    addCardToTable(newPlayer, computerPlayer);
    setGameState(GameState.STARTED);
  }

  async function endOfRoundCleaning(newComputerPlayer: SoloPlayer) {
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
      action: PlayerState.PLAY,
      gamesWon: winner === 1 ? player.gamesWon + 1 : player.gamesWon,
      playedCardThisTurn: false,
    });
    setComputerPlayer(() => {
      return {
        ...newComputerPlayer,
        action: PlayerState.PLAY,
        gamesWon:
          winner === 0 ? computerPlayer.gamesWon + 1 : computerPlayer.gamesWon,
        playedCardThisTurn: false,
      };
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

  function dismissPopup() {
    setPlayer({
      ...player,
      hand: player.hand,
      table: [],
      tally: 0,
    });
    setComputerPlayer(() => {
      return {
        ...computerPlayer,
        hand: computerPlayer.hand,
        table: [],
        tally: 0,
      };
    });
    setShowEndRoundPopup(false);
  }

  return (
    <>
      <Header musicChoice={musicChoice} />
      <div className="scoreBoard_solo">
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
                onClick={dismissPopup}
              />
            )}
        </div>
      </div>
    </>
  );
}
export default SoloGame;

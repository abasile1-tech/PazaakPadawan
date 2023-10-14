import PlayBar from './PlayBar';
import Header from './Header';
import Chat from './Chat';
import ScoreLights from './ScoreLights';
import { useState } from 'react';

function PVPGame() {
  const musicChoice = 'pvpGame';
  const [playerTally, setPlayerTally] = useState(0);
  const [opponentTally, setOpponentTally] = useState(0);
  const [turnTracker, setTurnTracker] = useState(true);
  let numGamesWonPlayer = 0;
  let numGamesWonOpponent = 2;
  return (
    <>
      <Header musicChoice={musicChoice} />
      <div className="scoreBoard">
        <ScoreLights numGamesWon={numGamesWonPlayer} />
        <PlayBar
          playerTally={playerTally}
          opponentTally={opponentTally}
          turnTracker={turnTracker}
        />
        <ScoreLights numGamesWon={numGamesWonOpponent} />
      </div>
      <Chat />
    </>
  );
}

export default PVPGame;

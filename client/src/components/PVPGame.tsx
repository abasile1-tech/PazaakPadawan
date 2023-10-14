import PlayBar from './PlayBar';
import Header from './Header';
import Chat from './Chat';
import ScoreLights from './ScoreLights';
import { useState } from 'react';

function PVPGame() {
  const musicChoice = 'pvpGame';
  const numGamesWonPlayer = 0;
  const numGamesWonOpponent = 2;
  const [playerTally] = useState(0);
  const [opponentTally] = useState(0);
  const [turnTracker] = useState(true);
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

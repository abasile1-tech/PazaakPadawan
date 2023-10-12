import { useEffect, useState } from 'react';
import ScoreKeeper from './ScoreKeeper';
import TurnIndicator from './TurnIndicator';
interface PlayBarProps {
  playerTally: number;
  opponentTally: number;
  turnTracker: boolean;
}

const PlayBar = ({ playerTally, opponentTally, turnTracker }: PlayBarProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [opponentName, setOpponentName] = useState('Darth Molt');

  useEffect(() => {
    const storedCharacter = localStorage.getItem('selectedCharacter');
    if (storedCharacter) {
      setSelectedCharacter(JSON.parse(storedCharacter));
    }
  }, []);

  return (
    <>
      <h2>
        {selectedCharacter ? (
          <div className="user-bar">
            <img src={selectedCharacter.image} alt={selectedCharacter.name} />
            <h3>{selectedCharacter.name}!</h3>
            <ScoreKeeper cardTally={playerTally} />
          </div>
        ) : (
          <p>Character is not chosen</p>
        )}

        {turnTracker ? (
          selectedCharacter ? (
            <TurnIndicator playerName={selectedCharacter.name} />
          ) : (
            <TurnIndicator playerName="player" />
          )
        ) : (
          <TurnIndicator playerName={opponentName} />
        )}

        <div className="user-bar">
          <img
            src={'src/assets/images/penguins/penguinmaul1.jpeg'}
            alt={opponentName}
          />
          <h3>{opponentName}</h3>
          <ScoreKeeper cardTally={opponentTally} />
        </div>
      </h2>
    </>
  );
};

export default PlayBar;

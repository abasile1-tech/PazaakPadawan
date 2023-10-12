import { useEffect, useState } from 'react';
import ScoreKeeper from './ScoreKeeper';
interface PlayBarProps {
  playerTally: number;
}

const PlayBar = ({ playerTally }: PlayBarProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

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
            <img src={selectedCharacter.image} />
            <h3>{selectedCharacter.name}!</h3>
            <ScoreKeeper cardTally={playerTally} />
          </div>
        ) : (
          <p>Character is not chosen</p>
        )}
      </h2>
    </>
  );
};

export default PlayBar;

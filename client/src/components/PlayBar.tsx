import { useEffect, useState } from 'react';
import ScoreKeeper from './ScoreKeeper';
interface PlayBarProps {
  playerTally: number;
  identity: string;
}

const PlayBar = ({ playerTally, identity }: PlayBarProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  if (identity == 'player') {
    useEffect(() => {
      const storedCharacter = localStorage.getItem('selectedCharacter');
      if (storedCharacter) {
        setSelectedCharacter(JSON.parse(storedCharacter));
      }
    }, []);
  }

  return (
    <>
      <h2>
        {identity === 'player' ? (
          selectedCharacter ? (
            <div className="user-bar">
              <img src={selectedCharacter.image} alt={selectedCharacter.name} />
              <h3>{selectedCharacter.name}!</h3>
              <ScoreKeeper cardTally={playerTally} />
            </div>
          ) : (
            <p>Character is not chosen</p>
          )
        ) : (
          <h1>jarjar</h1>
        )}
      </h2>
    </>
  );
};

export default PlayBar;

import { useEffect, useState } from 'react';
import ScoreKeeper from './ScoreKeeper';
import TurnIndicator from './TurnIndicator';
import penguinmall from '../assets/images/penguins/penguinmaul1.jpeg';

interface PlayBarProps {
  playerTally: number;
  opponentTally: number;
  isPlayerTurn: boolean;
  gameState: GameState;
}

interface Character {
  id: number;
  name: string;
  image: string;
}

enum GameState {
  INITIAL = 'initial',
  STARTED = 'started',
  ENDED = 'ended',
  STAND = 'stand',
  WAIT = 'wait',
}

const PlayBar = ({
  playerTally,
  opponentTally,
  isPlayerTurn,
  gameState,
}: PlayBarProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [opponentName] = useState('Darth Molt');

  useEffect(() => {
    const storedCharacter = localStorage.getItem('selectedCharacter');
    if (storedCharacter) {
      setSelectedCharacter(JSON.parse(storedCharacter));
    }
  }, []);

  return (
    <>
      <div
        className="play_bar"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
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
        </h2>
        <div className="turn_indicator">
          {isPlayerTurn || gameState === GameState.INITIAL ? (
            selectedCharacter ? (
              <TurnIndicator playerName={selectedCharacter.name} />
            ) : (
              <TurnIndicator playerName="player" />
            )
          ) : (
            <TurnIndicator playerName={opponentName} />
          )}
        </div>
        <h2>
          <div className="user-bar">
            <img src={penguinmall} alt={opponentName} />
            <h3>{opponentName}</h3>
            <ScoreKeeper cardTally={opponentTally} />
          </div>
        </h2>
      </div>
    </>
  );
};

export default PlayBar;

import { useEffect, useState } from 'react';
import TurnIndicator from './TurnIndicator';
import penguinmall from '../assets/images/penguins/penguinmaul1.jpeg';
import { Character, GameState, PlayBarProps } from '../types';

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
      <div className="play_bar">
        <h2>
          {selectedCharacter ? (
            <div className="user-bar">
              <img src={selectedCharacter.image} alt={selectedCharacter.name} />
              <h3 className="userBarName">{selectedCharacter.name}</h3>
              <h3>{playerTally}</h3>
            </div>
          ) : (
            <p>Character is not chosen</p>
          )}
        </h2>
        <div className="turn_indicators_container_solo">
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
            <h3 className="userBarName">{opponentName}</h3>
            <h3>{opponentTally}</h3>
          </div>
        </h2>
      </div>
    </>
  );
};

export default PlayBar;

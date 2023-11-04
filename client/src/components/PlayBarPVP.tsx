import { useEffect, useState } from 'react';
import ScoreKeeper from './ScoreKeeper';
import TurnIndicator from './TurnIndicator';
import penguinmall from '../assets/images/penguins/penguinmaul1.jpeg';
import yoda from '../assets/images/penguins/yoda.jpg';
import ewok from '../assets/images/penguins/ewok.jpg';
import { Player, GameState } from '../types';

interface PlayBarPVPProps {
  player: Player;
  otherPlayer: Player;
  gameState: GameState;
}

// interface Character {
//   id: number;
//   name: string;
//   image: string;
// }

const PlayBarPVP = ({ player, otherPlayer, gameState }: PlayBarPVPProps) => {
  // const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
  //   null
  // );
  // const [opponentName] = useState('Darth Molt');

  // useEffect(() => {
  //   const storedCharacter = localStorage.getItem('selectedCharacter');
  //   if (storedCharacter) {
  //     setSelectedCharacter(JSON.parse(storedCharacter));
  //   }
  // }, []);

  const getTurnIndicatorText = () => {
    if (gameState == GameState.INITIAL) {
      return 'Press Start to Begin';
    }
    if (player.isTurn) {
      return `${player.name}'s turn`;
    }
    if (otherPlayer.isTurn) {
      return `${otherPlayer.name}'s turn`;
    }
  };

  return (
    <>
      <div
        className="play_bar"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div className="user-bar">
          <img src={ewok} alt="ewok" />
          <h3 className="userBarName">{player.name}</h3>
          <ScoreKeeper cardTally={player.tally} />
        </div>
        {/* {selectedCharacter ? (
            <div className="user-bar">
              <img src={selectedCharacter.image} alt={selectedCharacter.name} />
              <h3 className="userBarName">{selectedCharacter.name}</h3>
              <ScoreKeeper cardTally={player.tally} />
            </div>
          ) : (
            <p>Character is not chosen</p>
          )} */}
        <div className="turn_indicator">
          <div className="turn-indicator">
            <p>{getTurnIndicatorText()}</p>
          </div>
          {/* {player.isTurn || gameState === GameState.INITIAL ? (
            selectedCharacter ? (
              <TurnIndicator playerName={selectedCharacter.name} />
            ) : (
              <TurnIndicator playerName="player" />
            )
          ) : (
            <TurnIndicator playerName={opponentName} />
          )} */}
        </div>
        <div className="user-bar">
          <img src={yoda} alt="yoda" />
          <h3 className="userBarName">{otherPlayer.name}</h3>
          <ScoreKeeper cardTally={otherPlayer.tally} />
        </div>
      </div>
    </>
  );
};

export default PlayBarPVP;

import React from 'react';
import PopUp from './PopUP/PopUp';
import victory from '../assets/music/8bitvictorymarch.mp3';
import defeat from '../assets/music/8bitimperialmarch.mp3';

interface EndGamePopupProps {
  numGamesWonPlayer: number;
  numGamesWonOpponent: number;
  handleGameOverClick: () => void;
}

const EndGamePopup: React.FC<EndGamePopupProps> = ({
  numGamesWonPlayer,
  numGamesWonOpponent,
  handleGameOverClick,
}) => {
  if (numGamesWonPlayer === 3) {
    return (
      <PopUp
        audiofile={victory}
        title="YOU WON"
        message="Thanks for playing Pazaak Online. Click close to return to the main menu."
        buttonText="CLOSE"
        onClick={handleGameOverClick}
      />
    );
  } else if (numGamesWonOpponent === 3) {
    return (
      <PopUp
        audiofile={defeat}
        title="YOU LOSE"
        message="Thanks for playing Pazaak Online. Click close to return to the main menu."
        buttonText="CLOSE"
        onClick={handleGameOverClick}
      />
    );
  } else {
    return null;
  }
};

export default EndGamePopup;

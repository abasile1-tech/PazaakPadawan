import React from 'react';
import PopUp from './PopUP/PopUp';

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
        title="YOU WON"
        message="Thanks for playing Pazaak Online. Click close to return to the main menu."
        buttonText="CLOSE"
        onClick={handleGameOverClick}
      />
    );
  } else if (numGamesWonOpponent === 3) {
    return (
      <PopUp
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

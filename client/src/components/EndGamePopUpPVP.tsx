import React from 'react';
import PopUp from './PopUP/PopUp';
import victory from '../assets/music/lightsaber.mp3';
import defeat from '../assets/music/blaster.mp3';
import { Player, UserData } from '../types';

interface EndGamePopupPVPProps {
  player: Player;
  otherPlayer: Player;
  userData: UserData;
  handleGameOverClick: () => void;
}

const EndGamePopupPVP: React.FC<EndGamePopupPVPProps> = ({
  player,
  otherPlayer,
  userData,
  handleGameOverClick,
}) => {
  const playerWon = player.roundsWon === 3;
  const otherPlayerWon = otherPlayer.roundsWon === 3;
  const someoneWon = playerWon || otherPlayerWon;

  const amIPlayer = userData.username === player.name;
  const amIOtherPlayer = userData.username === otherPlayer.name;

  const iWon = (): boolean => {
    if (playerWon && amIPlayer) {
      return true;
    }
    if (otherPlayerWon && amIOtherPlayer) {
      return true;
    }
    return false;
  };

  if (someoneWon && iWon()) {
    return (
      <PopUp
        audiofile={victory}
        title="YOU WON"
        message="Thanks for playing Pazaak Online. Click close to return to the main menu."
        buttonText="CLOSE"
        onClick={handleGameOverClick}
      />
    );
  } else if (someoneWon && !iWon()) {
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

export default EndGamePopupPVP;

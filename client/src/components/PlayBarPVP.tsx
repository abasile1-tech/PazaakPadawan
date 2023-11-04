import yoda from '../assets/images/penguins/yoda.jpg';
import ewok from '../assets/images/penguins/ewok.jpg';
import { Player, GameState } from '../types';

interface PlayBarPVPProps {
  player: Player;
  otherPlayer: Player;
  gameState: GameState;
}

const PlayBarPVP = ({ player, otherPlayer, gameState }: PlayBarPVPProps) => {
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
          <h2> {player.tally} </h2>
        </div>
        <div className="turn_indicator">
          <div className="turn-indicator">
            <p>{getTurnIndicatorText()}</p>
          </div>
        </div>
        <div className="user-bar">
          <img src={yoda} alt="yoda" />
          <h3 className="userBarName">{otherPlayer.name}</h3>
          <h2> {otherPlayer.tally} </h2>
        </div>
      </div>
    </>
  );
};

export default PlayBarPVP;

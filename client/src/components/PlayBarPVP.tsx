import yoda from '../assets/images/penguins/yoda.jpg';
import ewok from '../assets/images/penguins/ewok.jpg';
import { PlayBarPVPProps } from '../types';
import ScoreLights from './ScoreLights';

const PlayBarPVP = ({ player, otherPlayer }: PlayBarPVPProps) => {
  const getTurnIndicatorText = () => {
    if (player.isTurn) {
      return `${player.name}'s turn`;
    }
    if (otherPlayer.isTurn) {
      return `${otherPlayer.name}'s turn`;
    }
    return 'Press Start to Begin';
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ScoreLights numGamesWon={player.roundsWon} />
          <div className="user-bar" style={{ marginLeft: '2em' }}>
            <img src={ewok} alt="ewok" />
            <h3 className="userBarName">{player.name}</h3>
            <h2> {player.tally} </h2>
          </div>
        </div>
        <div className="turn_indicator">
          <div className="turn-indicator">
            <p>{getTurnIndicatorText()}</p>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <div className="user-bar" style={{ marginRight: '2em' }}>
            <img src={yoda} alt="yoda" />
            <h3 className="userBarName">{otherPlayer.name}</h3>
            <h2> {otherPlayer.tally} </h2>
          </div>
          <ScoreLights numGamesWon={otherPlayer.roundsWon} />
        </div>
      </div>
    </>
  );
};

export default PlayBarPVP;

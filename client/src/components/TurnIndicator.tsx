import { TurnIndicatorProps } from '../types';

const TurnIndicator = ({ playerName }: TurnIndicatorProps) => {
  return (
    <div className="turn_indicator_solo">
      <p id="player-name">{`${playerName}'s Turn`}</p>
    </div>
  );
};

export default TurnIndicator;

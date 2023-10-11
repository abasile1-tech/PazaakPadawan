interface TurnIndicatorProps {
  playerName: string;
}

const TurnIndicator = ({ playerName }: TurnIndicatorProps) => {
  return (
    <div className="turn-indicator">
      <p id="player-name">{`${playerName}'s Turn`}</p>
    </div>
  );
};

export default TurnIndicator;

import { GameButtonsProps, GameState } from '../types';

const GameButtons: React.FC<GameButtonsProps> = ({
  gameState,
  onStand,
  onEndTurn,
  onStartGame,
  isTurn,
}) => {
  return (
    <div className="turnOptions">
      <button
        className="gameButtons"
        onClick={onStand}
        disabled={gameState === GameState.INITIAL || !isTurn}
      >
        Stand
      </button>
      <button
        className="gameButtons"
        onClick={onEndTurn}
        disabled={gameState === GameState.INITIAL || !isTurn}
      >
        End Turn
      </button>
      <button
        className="gameButtons"
        onClick={onStartGame}
        disabled={gameState === GameState.STARTED}
      >
        Start Game
      </button>
    </div>
  );
};

export default GameButtons;

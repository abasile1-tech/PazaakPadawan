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
        disabled={
          gameState === GameState.INITIAL ||
          gameState === GameState.STAND ||
          gameState === GameState.WAIT ||
          !isTurn
        }
      >
        Stand
      </button>
      <button
        className="gameButtons"
        onClick={onEndTurn}
        disabled={
          gameState === GameState.INITIAL ||
          gameState === GameState.STAND ||
          gameState === GameState.WAIT ||
          !isTurn
        }
      >
        End Turn
      </button>
      <button
        className="gameButtons"
        onClick={onStartGame}
        disabled={
          gameState === GameState.STARTED ||
          gameState === GameState.STAND ||
          gameState === GameState.WAIT
        }
      >
        Start Game
      </button>
    </div>
  );
};

export default GameButtons;

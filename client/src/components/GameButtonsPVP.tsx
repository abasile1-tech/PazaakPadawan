import { GameButtonsPVPProps, GameState, PlayerState } from '../types';

const GameButtonsPVP: React.FC<GameButtonsPVPProps> = ({
  playerState,
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
          playerState === PlayerState.STAND ||
          gameState === GameState.ENDED ||
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
          playerState === PlayerState.STAND ||
          gameState === GameState.ENDED ||
          !isTurn
        }
      >
        End Turn
      </button>
      <button
        className="gameButtons"
        onClick={onStartGame}
        disabled={
          gameState === GameState.STARTED || playerState === PlayerState.STAND
        }
      >
        Start Game
      </button>
    </div>
  );
};

export default GameButtonsPVP;

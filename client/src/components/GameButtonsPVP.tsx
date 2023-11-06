import React from 'react';
enum GameState {
  INITIAL = 'initial',
  STARTED = 'started',
  ENDED = 'ended',
  STAND = 'stand',
  WAIT = 'wait',
}

interface GameButtonsPVPProps {
  gameState: GameState;
  onStand: () => void;
  onEndTurn: () => void;
  onStartGame: () => void;
  isTurn: boolean;
}
const GameButtonsPVP: React.FC<GameButtonsPVPProps> = ({
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
          gameState === GameState.STAND ||
          gameState === GameState.WAIT ||
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

export default GameButtonsPVP;

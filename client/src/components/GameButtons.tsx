import React from 'react';
enum GameState {
  INITIAL = 'initial',
  STARTED = 'started',
  ENDED = 'ended',
  STAND = 'stand',
  WAIT = 'wait',
}

interface GameButtonsProps {
  gameState: GameState;
  onStand: () => void;
  onEndTurn: () => void;
  onStartGame: () => void;
  isPlayerTurn: boolean;
}
const GameButtons: React.FC<GameButtonsProps> = ({
  gameState,
  onStand,
  onEndTurn,
  onStartGame,
  isPlayerTurn,
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
          !isPlayerTurn
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
          !isPlayerTurn
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

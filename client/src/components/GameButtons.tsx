// import React from 'react';
// enum GameState {
//   INITIAL = 'initial',
//   STARTED = 'started',
//   ENDED = 'ended',
//   STAND = 'stand',
// }

// interface GameButtonsProps {
//   gameState: GameState;
//   onStand: () => void;
//   onEndTurn: () => void;
//   onStartGame: () => void;
// }
// const GameButtons: React.FC<GameButtonsProps> = ({
//   gameState,
//   onStand,
//   onEndTurn,
//   onStartGame,
// }) => {
//   return (
//     <div className="turnOptions">
//       <button
//         onClick={onStand}
//         disabled={
//           gameState === GameState.INITIAL || gameState === GameState.STAND
//         }
//       >
//         Stand
//       </button>
//       <button
//         onClick={onEndTurn}
//         disabled={
//           gameState === GameState.INITIAL || gameState === GameState.STAND
//         }
//       >
//         End Turn
//       </button>
//       <button
//         onClick={onStartGame}
//         disabled={
//           gameState === GameState.STARTED || gameState === GameState.STAND
//         }
//       >
//         Start Game
//       </button>
//     </div>
//   );
// };

// export default GameButtons;

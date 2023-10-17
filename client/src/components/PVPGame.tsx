import Header from './Header';
import Chat from './Chat';
import ScoreLights from './ScoreLights';

function PVPGame() {
  const musicChoice = 'pvpGame';
  const numGamesWonPlayer = 0;
  const numGamesWonOpponent = 2;
  return (
    <>
      <Header musicChoice={musicChoice} />
      <h1>PVP Game!</h1>
      <ScoreLights numGamesWon={numGamesWonPlayer} />
      <ScoreLights numGamesWon={numGamesWonOpponent} />
      <Chat />
    </>
  );
}

export default PVPGame;

import BackgroundMusic from './BackgroundMusic';
import Header from './Header';
import Chat from './Chat';
import ScoreLights from './ScoreLights';

function PVPGame() {
  const musicChoice = 'pvpGame';
  let numGamesWonPlayer = 0;
  let numGamesWonOpponent = 2;
  return (
    <>
      <Header musicChoice={musicChoice} />
      <h1>PVP Game!</h1>
      <BackgroundMusic musicChoice={musicChoice} />
      <ScoreLights numGamesWon={numGamesWonPlayer} />
      <ScoreLights numGamesWon={numGamesWonOpponent} />
      <Chat />
    </>
  );
}

export default PVPGame;

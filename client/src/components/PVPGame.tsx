import BackgroundMusic from './BackgroundMusic';
import Chat from './Chat';
import ScoreLights from './ScoreLights';

function PVPGame() {
  let musicChoice: string = 'pvpGame';
  let numGamesWonPlayer = 0;
  let numGamesWonOpponent = 2;
  return (
    <>
      <h1>PVP Game!</h1>
      <BackgroundMusic musicChoice={musicChoice} />
      <ScoreLights numGamesWon={numGamesWonPlayer} />
      <ScoreLights numGamesWon={numGamesWonOpponent} />
      <Chat />
    </>
  );
}

export default PVPGame;

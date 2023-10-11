import BackgroundMusic from './BackgroundMusic';
import Header from './Header';
import Chat from './Chat';
import ScoreLights from './ScoreLights';

function PVPGame() {
  let musicChoice: string = 'pvpGame';
  let numGamesWonPlayer = 0;
  let numGamesWonOpponent = 2;
  return (
    <>
      <Header />
      <h1>PVP Game!</h1>
      <ScoreLights numGamesWon={numGamesWonPlayer} />
      <ScoreLights numGamesWon={numGamesWonOpponent} />
      <Chat />
    </>
  );
}

export default PVPGame;

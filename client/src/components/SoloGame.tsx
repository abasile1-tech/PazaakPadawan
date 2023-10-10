import BackgroundMusic from './BackgroundMusic';
import ScoreLights from './ScoreLights';

function SoloGame() {
  let musicChoice: string = 'soloGame';
  let numGamesWonPlayer = 1;
  let numGamesWonOpponent = 2;
  return (
    <>
      <h1>Solo Game!</h1>
      <BackgroundMusic musicChoice={musicChoice} />
      <ScoreLights numGamesWon={numGamesWonPlayer} />
      <ScoreLights numGamesWon={numGamesWonOpponent} />
    </>
  );
}

export default SoloGame;

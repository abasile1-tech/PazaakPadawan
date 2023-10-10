import BackgroundMusic from './BackgroundMusic';

function PVPGame() {
  let musicChoice: string = 'pvpGame';
  return (
    <>
      <h1>PVP Game!</h1>
      <BackgroundMusic musicChoice={musicChoice} />
    </>
  );
}

export default PVPGame;

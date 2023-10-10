import BackgroundMusic from './BackgroundMusic';

function SoloGame() {
  let musicChoice: string = 'soloGame';
  return (
    <>
      <h1>Solo Game!</h1>
      <BackgroundMusic musicChoice={musicChoice} />
    </>
  );
}

export default SoloGame;

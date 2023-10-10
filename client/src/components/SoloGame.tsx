import BackgroundMusic from './BackgroundMusic';
import Header from './Header';

function SoloGame() {
  let musicChoice: string = 'soloGame';
  return (
    <>
      <Header />
      <h1>Solo Game!</h1>
      <BackgroundMusic musicChoice={musicChoice} />
    </>
  );
}

export default SoloGame;

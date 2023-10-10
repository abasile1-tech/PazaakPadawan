import BackgroundMusic from './BackgroundMusic';
import Header from './Header';

function PVPGame() {
  let musicChoice: string = 'pvpGame';
  return (
    <>
      <Header />
      <h1>PVP Game!</h1>
      <BackgroundMusic musicChoice={musicChoice} />
    </>
  );
}

export default PVPGame;

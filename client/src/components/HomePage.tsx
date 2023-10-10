import BackgroundMusic from './BackgroundMusic';

function HomePage() {
  let musicChoice: string = 'homePage';

  return (
    <>
      <h1>Home Page!</h1>
      <BackgroundMusic musicChoice={musicChoice} />
    </>
  );
}

export default HomePage;

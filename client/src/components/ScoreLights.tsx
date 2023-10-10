function ScoreLights(props: { numGamesWon: number }) {
  const numGamesWon = props.numGamesWon;
  switch (numGamesWon) {
    case 0:
      return (
        <img src="src/assets/images/lights/lights000.png" alt="no lights" />
      );
    case 1:
      return (
        <img src="src/assets/images/lights/lights100.png" alt="top light" />
      );
    case 2:
      return (
        <img src="src/assets/images/lights/lights110.png" alt="top 2 lights" />
      );
    case 3:
      return (
        <img src="src/assets/images/lights/lights111.png" alt="all lights" />
      );
    default:
      console.log(`score lights error, numGamesWon: ${numGamesWon}.`);
      return (
        <>
          <h1>Score Lights Error</h1>
        </>
      );
  }
}

export default ScoreLights;

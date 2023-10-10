function ScoreLights(props: { numGamesWon: number }) {
  const numGamesWon = props.numGamesWon;
  switch (numGamesWon) {
    case 0:
      console.log('no lights');
      return <h1>no lights</h1>;
    case 1:
      console.log('top light');
      return <h1>top light</h1>;
    case 2:
      console.log('top 2 lights');
      return <h1>top 2 lights</h1>;
    case 3:
      console.log('all 3 lights');
      return <h1>all 3 lights</h1>;
    default:
      console.log(`numGamesWon: ${numGamesWon}.`);
      return (
        <>
          <h1>Score Lights</h1>
        </>
      );
  }
}

export default ScoreLights;

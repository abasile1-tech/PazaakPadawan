function ScoreLights(props: { numGamesWon: number }) {
  const numGamesWon = props.numGamesWon;
  let lightsvar;
  switch (numGamesWon) {
    case 0:
      lightsvar = '000';
      break;
    case 1:
      lightsvar = '100';
      break;
    case 2:
      lightsvar = '110';
      break;
    case 3:
      lightsvar = '111';
      break;
    default:
      console.log(`score lights error, numGamesWon: ${numGamesWon}.`);
  }
  return (
    <>
      <img
        style={{ alignSelf: 'center' }}
        id="image_score_lights"
        src={`src/assets/images/lights/lights${lightsvar}.png`}
        alt="score lights"
      />
    </>
  );
}

export default ScoreLights;

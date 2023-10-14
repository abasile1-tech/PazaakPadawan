import lights000 from '../assets/images/lights/lights000.png';
import lights100 from '../assets/images/lights/lights100.png';
import lights110 from '../assets/images/lights/lights110.png';
import lights111 from '../assets/images/lights/lights111.png';

function ScoreLights(props: { numGamesWon: number }) {
  const numGamesWon = props.numGamesWon;

  const lightImgSrc = (): string => {
    switch (numGamesWon) {
      case 0:
        return lights000;
      case 1:
        return lights100;
      case 2:
        return lights110;
      case 3:
        return lights111;
      default:
        console.warn(`score lights error, numGamesWon: ${numGamesWon}.`);
        return lights000;
    }
  };

  return (
    <>
      <img
        style={{ alignSelf: 'center' }}
        id="image_score_lights"
        src={lightImgSrc()}
        alt="score lights"
      />
    </>
  );
}

export default ScoreLights;

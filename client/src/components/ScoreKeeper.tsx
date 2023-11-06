import { ScoreKeeperProps } from '../types';

function ScoreKeeper({ cardTally }: ScoreKeeperProps) {
  return (
    <>
      <h3>{cardTally}</h3>
    </>
  );
}

export default ScoreKeeper;

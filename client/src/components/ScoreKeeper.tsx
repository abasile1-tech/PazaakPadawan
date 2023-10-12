interface ScoreKeeperProps {
  cardTally: number;
}

function ScoreKeeper({ cardTally }: ScoreKeeperProps) {
  return (
    <>
      <h3>{cardTally}</h3>
    </>
  );
}

export default ScoreKeeper;

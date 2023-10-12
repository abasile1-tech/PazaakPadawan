import { useState } from 'react';

function ScoreKeeper(props: { cardTally: number }) {
  const [cardTally, setCardTally] = useState(props.cardTally);
  return (
    <>
      <h3>({cardTally})</h3>
    </>
  );
}

export default ScoreKeeper;

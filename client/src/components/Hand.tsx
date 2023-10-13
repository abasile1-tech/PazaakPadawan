import Card from './Card';

interface HandProps {
  hand: Array<Card>;
  moveCard?: (index: number) => void;
}

const Hand = ({ hand, moveCard }: HandProps): JSX.Element => {
  const listItems = hand.map((card, index) => {
    const { value, color, cardType } = card.props;
    return (
      <Card
        key={index}
        value={value}
        color={color}
        cardType={cardType}
        onClick={() => moveCard(index)}
      />
    );
  });

  return (
    <div
      className="handContainer"
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      {listItems}
    </div>
  );
};

export default Hand;

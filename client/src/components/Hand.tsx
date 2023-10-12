import Card from './Card';

interface HandProps {
  hand: Array<Card>;
  moveCard?: (values: any) => void;
}

const Hand = ({ hand, moveCard }: HandProps): JSX.Element => {
  const listItems = hand.map((card) => {
    const { value, color, cardType } = card.props;
    return (
      <Card
        value={value}
        color={color}
        cardType={cardType}
        onClick={moveCard}
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

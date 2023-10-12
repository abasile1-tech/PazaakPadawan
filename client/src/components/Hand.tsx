import Card from './Card';

interface HandProps {
  hand: Array<Card>;
}

const Hand = ({ hand }: HandProps): JSX.Element => {
  const listItems = hand.map((card) => {
    const { value, color, cardType } = card.props;
    return <Card value={value} color={color} cardType={cardType} />;
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

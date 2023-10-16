import Card from './Card';

interface HandProps {
  hand: Array<JSX.Element>;
  moveCard?: (card: JSX.Element, index: number) => void;
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
        onClick={() => {
          if (moveCard) {
            moveCard(card, index);
          }
        }}
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

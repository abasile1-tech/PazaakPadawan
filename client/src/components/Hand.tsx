import { render } from 'react-dom';
import Card from './Card';

interface HandProps {
  hand: Array<Card>;
}

const Hand = ({ hand }: HandProps): Array<Card> => {
  render() {

    const listItems = hand.map((card) => {
      const { value, color, cardType } = card.props;
      <Card value={value} color={color} cardType={cardType} />
    })
  return (
    <>
      <div
        className="handContainer"
        style={{ display: 'flex', flexWrap: 'wrap' }}
      >
      <h1>{listItems}</h1>
      </div>
    </>
  );
}
};

export default Hand;

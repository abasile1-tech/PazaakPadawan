import React, { Component } from 'react';
import redcard from '../assets/images/cards/red_card.png';
import bluecard from '../assets/images/cards/blue_card.png';

interface CardProps {
  key?: number;
  value: number;
  color: string;
  cardType: string;
  selected?: boolean;
  image?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

function getImageSource(color: string) {
  switch (color) {
    case 'red':
      return redcard;
    case 'blue':
      return bluecard;
  }
}

class Card extends Component<CardProps> {
  render() {
    const { value, color, onClick } = this.props;
    if (color == 'blue' && value <= 0) {
      console.warn(
        'blue card has a negative value. blue card values should be positive'
      );
    } else if (color == 'red' && value >= 0) {
      console.warn(
        'red card has a positive value. red card values should be negative.'
      );
    }

    return (
      <div className={`card ${color}_card`} onClick={onClick}>
        <div className="card_content">
          <img
            src={getImageSource(color)}
            alt="Card Image"
            className="card_image"
          />

          <p className="card_number"> {value}</p>
        </div>
      </div>
    );
  }
}

export default Card;

import React, { Component } from 'react';

interface CardProps {
  value: number;
  color: string;
  cardType: string;
}

class Card extends Component<CardProps> {
  render() {
    const { value, color, cardType } = this.props;
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
      <div className={`card ${color}_card`}>
        <div className="card_content">
          <img
            src={`src/assets/images/cards/${color}_card.png`}
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

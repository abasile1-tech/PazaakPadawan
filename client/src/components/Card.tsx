import React, { Component } from 'react';

interface CardProps {
  value: number;
  color: string;
  cardType: string;
}

class Card extends Component<CardProps> {
  render() {
    const { value, color, cardType } = this.props;

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

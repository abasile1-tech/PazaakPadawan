import React, { useState } from 'react';
import Card from './Card';
import Header from './Header';

function DeckBuilder() {
  const musicChoice = 'deckBuilder';

  const allCards = [
    {
      value: 1,
      color: 'blue',
      selected: false,
      imagePath: 'src/assets/images/cards/blue_card.png',
    },
    {
      value: 2,
      color: 'blue',
      selected: false,
      imagePath: 'src/assets/images/cards/blue_card.png',
    },
    {
      value: 3,
      color: 'blue',
      selected: false,
      imagePath: 'src/assets/images/cards/blue_card.png',
    },
    {
      value: 4,
      color: 'blue',
      selected: false,
      imagePath: 'src/assets/images/cards/blue_card.png',
    },
    {
      value: 5,
      color: 'blue',
      selected: false,
      imagePath: 'src/assets/images/cards/blue_card.png',
    },
    {
      value: 6,
      color: 'blue',
      selected: false,
      imagePath: 'src/assets/images/cards/blue_card.png',
    },
    {
      value: 7,
      color: 'blue',
      selected: false,
      imagePath: 'src/assets/images/cards/blue_card.png',
    },
    {
      value: 8,
      color: 'blue',
      selected: false,
      imagePath: 'src/assets/images/cards/blue_card.png',
    },
    {
      value: 9,
      color: 'blue',
      selected: false,
      imagePath: 'src/assets/images/cards/blue_card.png',
    },
    {
      value: 10,
      color: 'blue',
      selected: false,
      imagePath: 'src/assets/images/cards/blue_card.png',
    },
    {
      value: -1,
      color: 'red',
      selected: false,
      imagePath: 'src/assets/images/cards/red_card.png',
    },
    {
      value: -2,
      color: 'red',
      selected: false,
      imagePath: 'src/assets/images/cards/red_card.png',
    },
    {
      value: -3,
      color: 'red',
      selected: false,
      imagePath: 'src/assets/images/cards/red_card.png',
    },
    {
      value: -4,
      color: 'red',
      selected: false,
      imagePath: 'src/assets/images/cards/red_card.png',
    },
    {
      value: -5,
      color: 'red',
      selected: false,
      imagePath: 'src/assets/images/cards/red_card.png',
    },
    {
      value: -6,
      color: 'red',
      selected: false,
      imagePath: 'src/assets/images/cards/red_card.png',
    },
    {
      value: -7,
      color: 'red',
      selected: false,
      imagePath: 'src/assets/images/cards/red_card.png',
    },
    {
      value: -8,
      color: 'red',
      selected: false,
      imagePath: 'src/assets/images/cards/red_card.png',
    },
    {
      value: -9,
      color: 'red',
      selected: false,
      imagePath: 'src/assets/images/cards/red_card.png',
    },
    {
      value: -10,
      color: 'red',
      selected: false,
      imagePath: 'src/assets/images/cards/red_card.png',
    },
  ];

  const [leftCards, setLeftCards] = useState(allCards);
  const [rightCards, setRightCards] = useState([]);

  const handleCardClick = (card) => {
    if (rightCards.length < 10 || card.selected) {
      const updatedLeftCards = leftCards.map((c) =>
        c === card ? { ...c, selected: !c.selected } : c
      );

      const updatedRightCards = card.selected
        ? rightCards.filter((c) => c !== card)
        : [...rightCards, card];

      setLeftCards(updatedLeftCards);
      setRightCards(updatedRightCards);
    }
  };

  return (
    <>
      <Header musicChoice={musicChoice} />

      <div className="deck-builder-container">
        <div className="left-cards-container">
          {leftCards.map((card, index) => (
            <Card
              key={index}
              value={card.value}
              color={card.color}
              onClick={() => handleCardClick(card)}
              selected={card.selected}
              image={card.imagePath}
            />
          ))}
        </div>
        <div className="right-cards-container">
          {rightCards.map((card, index) => (
            <Card
              key={index}
              value={card.value}
              color={card.color}
              onClick={() => handleCardClick(card)}
              selected={true}
              image={card.imagePath}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default DeckBuilder;

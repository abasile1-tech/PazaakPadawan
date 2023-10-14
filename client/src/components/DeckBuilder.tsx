import React, { useCallback, useState } from 'react';
import Card from './Card';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DeckBuilder() {
  const musicChoice = 'deckBuilder';
  const navigate = useNavigate();
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

  const clearChosenCards = () => {
    setLeftCards(allCards);
    setRightCards([]);
  };
  const startGame = useCallback(() => {
    if (rightCards.length === 10) {
      navigate('/');
    } else {
      toast.error('Please select 10 cards to start the game!', {
        position: 'top-right',
      });
    }
  }, [rightCards, navigate]);

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
        <div className="left-box">
          <div className="left-text-container">
            <p>Available Cards</p>
          </div>

          <div className="left-cards-container">
            {leftCards.map((card, index) => (
              <Card
                key={index}
                value={card.value}
                color={card.color}
                onClick={() => handleCardClick(card)}
                selected={card.selected}
                image={card.imagePath}
                className="centered-card"
              />
            ))}
          </div>
        </div>

        <div className="space-between"></div>

        <div className="right-box">
          <div className="right-text-container">
            <p>Chosen Cards</p>
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
                className="centered-card"
              />
            ))}
          </div>

          <div className="button-container">
            <button onClick={clearChosenCards} className="action-button">
              Clear Chosen Cards
            </button>
            <button onClick={startGame} className="action-button">
              Start Game
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default DeckBuilder;

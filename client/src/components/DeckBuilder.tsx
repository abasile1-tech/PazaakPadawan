import { useCallback, useState } from 'react';
import Card from './Card';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import redcard from '../assets/images/cards/red_card.png';
import bluecard from '../assets/images/cards/blue_card.png';

interface DeckCard {
  value: number;
  color: string;
  selected: boolean;
  imagePath: string;
}

function DeckBuilder() {
  const musicChoice = 'deckBuilder';
  const navigate = useNavigate();
  const [selectedHand, setSelectedHand] = useState<DeckCard[]>([]);
  const allCards = [
    {
      value: 1,
      color: 'blue',
      selected: false,
      imagePath: bluecard,
    },
    {
      value: 2,
      color: 'blue',
      selected: false,
      imagePath: bluecard,
    },
    {
      value: 3,
      color: 'blue',
      selected: false,
      imagePath: bluecard,
    },
    {
      value: 4,
      color: 'blue',
      selected: false,
      imagePath: bluecard,
    },
    {
      value: 5,
      color: 'blue',
      selected: false,
      imagePath: bluecard,
    },
    {
      value: 6,
      color: 'blue',
      selected: false,
      imagePath: bluecard,
    },
    {
      value: -1,
      color: 'red',
      selected: false,
      imagePath: redcard,
    },
    {
      value: -2,
      color: 'red',
      selected: false,
      imagePath: redcard,
    },
    {
      value: -3,
      color: 'red',
      selected: false,
      imagePath: redcard,
    },
    {
      value: -4,
      color: 'red',
      selected: false,
      imagePath: redcard,
    },
    {
      value: -5,
      color: 'red',
      selected: false,
      imagePath: redcard,
    },
    {
      value: -6,
      color: 'red',
      selected: false,
      imagePath: redcard,
    },
  ];

  const [leftCards, setLeftCards] = useState(allCards);
  const [rightCards, setRightCards] = useState<DeckCard[]>([]);

  const clearChosenCards = () => {
    setLeftCards(allCards);
    setRightCards([]);
  };
  const startGame = useCallback(() => {
    if (rightCards.length === 10) {
      const shuffledRightCards = shuffleArray(rightCards);
      const selectedHand = shuffledRightCards.slice(0, 4);
      setSelectedHand(selectedHand);
      console.log('4 cards here', selectedHand);
      navigate('/solo', { state: { selectedHand } });
    } else {
      toast.error('Please select 10 cards to start the game!', {
        position: 'top-right',
      });
    }
  }, [rightCards, navigate]);

  const handleCardClick = (card: DeckCard) => {
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
  function shuffleArray(array: DeckCard[]) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  return (
    <>
      <Header musicChoice={musicChoice} />

      <div className="deck-builder-container">
        <div className="left-box">
          <div className="left-text-container">
            <p>Available Cards</p>
          </div>

          <div className="left-cards-container centered-card">
            {leftCards.map((card, index) => (
              <Card
                key={index}
                value={card.value}
                color={card.color}
                onClick={() => handleCardClick(card)}
                selected={card.selected}
                image={card.imagePath}
                cardType=""
              />
            ))}
          </div>
        </div>

        <div className="space-between"></div>

        <div className="right-box">
          <div className="right-text-container">
            <p>Chosen Cards</p>
          </div>
          <div className="right-cards-container centered-card">
            {rightCards.map((card, index) => (
              <Card
                key={index}
                value={card.value}
                color={card.color}
                onClick={() => handleCardClick(card)}
                selected={true}
                image={card.imagePath}
                cardType=""
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

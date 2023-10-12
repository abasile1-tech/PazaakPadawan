import React from 'react';
import { Link } from 'react-router-dom';
import BackgroundMusic from './BackgroundMusic';
import Header from './Header';

interface InstructionsProps {
  musicChoice: string;
}

function Instructions({ musicChoice }: InstructionsProps) {
  return (
    <div>
      <Header musicChoice={musicChoice} />

      <h1>Instructions!</h1>
      <h3>How to Play!!!</h3>
      <p>
        Playing the Pazaak Card Game is an exciting and strategic experience set
        in the Star Wars universe. Whether you're a seasoned player or new to
        the game, this section will guide you through the steps to enjoy the
        digital implementation of Pazaak.
      </p>
      <p>
        <strong>Starting a Game:</strong> Click on "Start New Game" to begin a
        match.
      </p>
      <p>
        <strong>Playing Pazaak:</strong> Pazaak is a turn-based card game. Each
        player takes turns playing cards from their hand to build a winning hand
        with a total value close to 20 without going over. Cards in the deck
        have numerical values, including positive and negative numbers. Face
        cards and special cards can also impact the game.
      </p>
      <p>
        <strong>Strategy and Luck:</strong> Balance strategy and luck as you
        draw cards from your deck, deciding when to stay, end your turn, or play
        special cards to gain an advantage.
      </p>
      <p>
        <strong>Scoring:</strong> Keep an eye on the score, displayed on the
        screen, to see who's in the lead. The player with the highest score when
        the match ends wins.
      </p>
      <p>
        <strong>Tutorial:</strong> If you're new to Pazaak, don't worry. The
        game provides instruction to guide you through the rules and strategies.
      </p>
      <p>
        <strong>Stay Engaged:</strong> Stay tuned for game updates and
        maintenance to keep the experience fresh. Join the Pazaak community to
        share your experiences, strategies, and feedback with other players.
      </p>
      <p>
        Now that you know how to play Pazaak, dive into the Star Wars universe,
        challenge your friends, and enjoy this unique card game that combines
        strategy and luck! May the cards be in your favor.
      </p>
    </div>
  );
}

export default Instructions;

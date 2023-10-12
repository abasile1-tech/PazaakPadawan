import Header from './Header';
import ScoreLights from './ScoreLights';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Hand from './Hand';
import Card from './Card';
import TurnIndicator from './TurnIndicator';

interface SoloGameProps {}

function SoloGame(props: SoloGameProps): JSX.Element {
  const [playerHand, setPlayerHand] = useState([
    <Card value={-3} color="red" cardType="normal_card" />,
    <Card value={4} color="blue" cardType="normal_card" />,
    <Card value={2} color="blue" cardType="normal_card" />,
    <Card value={-2} color="red" cardType="normal_card" />,
  ]);
  const [playerTable, setPlayerTable] = useState([
    <Card value={5} color="blue" cardType="normal_card" />,
    <Card value={4} color="blue" cardType="normal_card" />,
    <Card value={2} color="blue" cardType="normal_card" />,
    <Card value={4} color="blue" cardType="normal_card" />,
  ]);
  const [opponentHand, setOpponentHand] = useState([
    <Card value={-1} color="red" cardType="normal_card" />,
    <Card value={-2} color="red" cardType="normal_card" />,
  ]);
  const [opponentTable, setOpponentTable] = useState([
    <Card value={6} color="blue" cardType="normal_card" />,
    <Card value={5} color="blue" cardType="normal_card" />,
    <Card value={6} color="blue" cardType="normal_card" />,
    <Card value={5} color="blue" cardType="normal_card" />,
  ]);

  const musicChoice = 'soloGame';
  let numGamesWonPlayer = 1;
  let numGamesWonOpponent = 2;
  return (
    <>
      <Header musicChoice={musicChoice} />
      <h1>Solo Game!</h1>
      <div className="scoreBoard">
        <ScoreLights numGamesWon={numGamesWonPlayer} />
        <h1>player 1</h1>
        <TurnIndicator playerName="Pin-Gun Jinn" />
        <h1>player 2</h1>
        <ScoreLights numGamesWon={numGamesWonOpponent} />
      </div>
      <hr />
      <div className="playerBoard">
        <div className="player1">
          <Hand hand={playerTable} />
          <hr />
          <Hand hand={playerHand} />
          <div className="turnOptions">
            <button>Stand</button>
            <button>End Turn</button>
          </div>
        </div>
        <div className="player2">
          <Hand hand={opponentTable} />
          <hr />
          <Hand hand={opponentHand} />
        </div>
      </div>
    </>
  );
}
export default SoloGame;

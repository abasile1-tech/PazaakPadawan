import Header from './Header';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PlayBar() {
  const [selectedCharacter, setSelectedCharacter] = useState();

  useEffect(() => {
    const storedCharacter = localStorage.getItem('selectedCharacter');
    if (storedCharacter) {
      setSelectedCharacter(JSON.parse(storedCharacter));
    }
  }, []);

  return (
    <>
      <div className="playBar">
        <div className="playerOne">
          {selectedCharacter} ?
          <img src={selectedCharacter.image} />
          <h3>{selectedCharacter.name}, </h3>
        </div>
        <div className="turnIndicator">
          <p id="player-name">{`${playerName}'s Turn`}</p>
        </div>
        <div className="playerTwo">
          {selectedCharacter} ?
          <img src={selectedCharacter.image} />
          <h3>{selectedCharacter.name}, </h3>
        </div>
      </div>
    </>
  );
}

export default PlayBar;

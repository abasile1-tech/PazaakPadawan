import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const characters = [
  {
    id: 1,
    name: 'Chillbacca',
    image: 'src/assets/images/penguins/chillbacca1.png',
  },
  {
    id: 2,
    name: 'Icesoka Penguano',
    image: './src/assets/images/penguins/Iceokapenguano.jpeg',
  },
  {
    id: 3,
    name: 'Peng-Wan Kenobi',
    image: 'src/assets/images/penguins/obipenguin1.jpeg',
  },
  {
    id: 4,
    name: 'Pen-Guin Jinn',
    image: 'src/assets/images/penguins/pen-giunjinn1.jpeg',
  },
  {
    id: 5,
    name: 'Darth Molt',
    image: 'src/assets/images/penguins/penguinmaul1.jpeg',
  },
];

function Character() {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null
  );
  const navigate = useNavigate();

  const handleCharacterSelect = (characterId: number) => {
    const selectedCharacterData = characters.find(
      (character) => character.id === characterId
    );
    if (selectedCharacterData) {
      setSelectedCharacter(selectedCharacterData);
      localStorage.setItem(
        'selectedCharacter',
        JSON.stringify(selectedCharacterData)
      );
      navigate('/');
    }
  };

  return (
    <div>
      <h2>Please choose your character</h2>
      <div className="character-list">
        {characters.map((character) => (
          <div key={character.id} className="character-item">
            <img
              src={character.image}
              alt={character.name}
              onClick={() => handleCharacterSelect(character.id)}
            />
            <p>{character.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Character;

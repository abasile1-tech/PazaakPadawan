import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import chillbacca from '../assets/images/penguins/chillbacca1.png';
import icesoka from '../assets/images/penguins/Iceokapenguano.jpeg';
import kenobi from '../assets/images/penguins/obipenguin1.jpeg';
import jinn from '../assets/images/penguins/pen-giunjinn1.jpeg';

const characters = [
  {
    id: 1,
    name: 'Chillbacca',
    image: chillbacca,
  },
  {
    id: 2,
    name: 'Icesoka Penguano',
    image: icesoka,
  },
  {
    id: 3,
    name: 'Peng-Wan Kenobi',
    image: kenobi,
  },
  {
    id: 4,
    name: 'Pen-Guin Jinn',
    image: jinn,
  },
];

interface CharacterData {
  id: number;
  name: string;
  image: string;
}

function Character() {
  const musicChoice = 'characterPage';
  const [, setSelectedCharacter] = useState<CharacterData | null>(null);
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
      <Header musicChoice={musicChoice} />
      <p className="main-text">Please choose your character!</p>
      <div className="character-list">
        {characters.map((character) => (
          <div
            key={character.id}
            className="character-item"
            onClick={() => handleCharacterSelect(character.id)}
          >
            <img
              className="centered-image"
              src={character.image}
              alt={character.name}
            />
            <p>{character.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Character;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import chillbacca from '../assets/images/penguins/chillbacca1.png';
import icesoka from '../assets/images/penguins/Iceokapenguano.jpeg';
import kenobi from '../assets/images/penguins/obipenguin1.jpeg';
import jinn from '../assets/images/penguins/pen-giunjinn1.jpeg';
import pengolo from '../assets/images/penguins/PenGolo.jpeg';
import leia from '../assets/images/penguins/PenguinessLeia.jpeg';
import pengwindu from '../assets/images/penguins/MaceWindu.jpg';
import kyloren from '../assets/images/penguins/kyloren.jpg';
import bb8 from '../assets/images/penguins/bb8.jpg';
import c3p0 from '../assets/images/penguins/c3p0.jpg';
import r2d2 from '../assets/images/penguins/r2d2Penguin.jpg';
import darthsidious from '../assets/images/penguins/darthsidious.jpg';
import darthvader from '../assets/images/penguins/DarthVader.jpg';
import yoda from '../assets/images/penguins/yoda.jpg';
import ewok from '../assets/images/penguins/ewok.jpg';
import mandalorian from '../assets/images/penguins/mandalorian.jpg';
import stormtrooper from '../assets/images/penguins/stormTrooper.jpg';
import jabba from '../assets/images/penguins/PengTheHut.jpeg';
import { Character } from '../types';

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
  {
    id: 5,
    name: 'Pen Golo',
    image: pengolo,
  },
  {
    id: 6,
    name: 'Penguiness Leia',
    image: leia,
  },
  {
    id: 7,
    name: 'Peng Windu',
    image: pengwindu,
  },
  {
    id: 8,
    name: 'Pengo Wen',
    image: kyloren,
  },
  {
    id: 9,
    name: 'PP-8',
    image: bb8,
  },
  {
    id: 10,
    name: 'C-3PengO',
    image: c3p0,
  },
  {
    id: 11,
    name: 'P2-D2',
    image: r2d2,
  },
  {
    id: 12,
    name: 'Darth Icyous',
    image: darthsidious,
  },
  {
    id: 13,
    name: 'Darth Wader',
    image: darthvader,
  },
  {
    id: 14,
    name: 'Poda',
    image: yoda,
  },
  {
    id: 15,
    name: 'Ewoddle',
    image: ewok,
  },
  {
    id: 16,
    name: 'The Pengalorian',
    image: mandalorian,
  },
  {
    id: 17,
    name: 'Snowsledder',
    image: stormtrooper,
  },
  {
    id: 18,
    name: 'Penga the Wutt',
    image: jabba,
  },
];

function Character() {
  const musicChoice = 'characterPage';
  const [, setSelectedCharacter] = useState<Character | null>(null);
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

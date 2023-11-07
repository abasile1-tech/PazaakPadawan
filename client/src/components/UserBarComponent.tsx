import { useEffect, useState } from 'react';
import { Character } from '../types';

const UserBarComponent = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  useEffect(() => {
    const storedCharacter = localStorage.getItem('selectedCharacter');
    if (storedCharacter) {
      setSelectedCharacter(JSON.parse(storedCharacter));
    }
  }, []);

  return (
    <>
      <h2>
        {selectedCharacter ? (
          <div className="user-bar">
            <img src={selectedCharacter.image} />
            <h3>Good day, {selectedCharacter.name}!</h3>
          </div>
        ) : (
          <p>Character is not chosen</p>
        )}
      </h2>
    </>
  );
};

export default UserBarComponent;

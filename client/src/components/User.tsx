import React, { useState } from 'react';

function UserProfileForm() {
  const [displayName, setDisplayName] = useState('');
  const [savedData, setSavedData] = useState({ displayName: '' });

  const handleDisplayNameChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setDisplayName(event.target.value);
  };

  const handleSave = () => {
    if (displayName) {
      setSavedData({
        displayName,
      });
      console.log('Data saved:', displayName);
    }
  };

  return (
    <div>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={displayName}
          onChange={handleDisplayNameChange}
          placeholder="Enter your name"
        />
      </div>

      <button onClick={handleSave}>Save</button>

      {savedData.displayName && (
        <div>
          <p>Hello there, {savedData.displayName}!</p>
        </div>
      )}
    </div>
  );
}

export default UserProfileForm;

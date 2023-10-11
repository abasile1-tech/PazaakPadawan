import React, { useState } from 'react';
import BackgroundMusic from './BackgroundMusic';

function Settings() {
  const [volume, setVolume] = useState<number>(50);
  const musicChoice: string = 'settingsPage';
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      <div>
        <label>Volume:</label>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
      <BackgroundMusic musicChoice={musicChoice} />
    </div>
  );
}

export default Settings;

import React, { useState, useRef } from 'react';
import backgroundMusic from '../assets/music/8bitopeningtheme.mp3';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    const audio: any = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio ref={audioRef} src={backgroundMusic} loop />
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause music' : 'Play music'}
      </button>
    </div>
  );
};

export default BackgroundMusic;

import React, { useState, useRef } from 'react';
import openingTheme from '../assets/music/8bitopeningtheme.mp3';
import cantina from '../assets/music/8bitcantina.mp3';

interface backgroundMusicProps {
  musicChoice: string;
}

const BackgroundMusic: React.FC<backgroundMusicProps> = ({ musicChoice }) => {
  const MUSIC_LOOKUP: Record<string, string> = {
    homePage: openingTheme,
    soloGame: cantina,
    pvpGame: cantina,
    deckBuilder: openingTheme,
  };

  const backgroundMusic = MUSIC_LOOKUP[musicChoice];

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

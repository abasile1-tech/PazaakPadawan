import React, { useState, useRef } from 'react';
import openingTheme from '../assets/music/8bitopeningtheme.mp3';
import cantina from '../assets/music/8bitcantina.mp3';
import mute from '../assets/images/icons/Mute.png';
import voice from '../assets/images/icons/Voice.png';

interface backgroundMusicProps {
  musicChoice: string;
}

const BackgroundMusic: React.FC<backgroundMusicProps> = ({ musicChoice }) => {
  const MUSIC_LOOKUP: Record<string, string> = {
    homePage: openingTheme,
    soloGame: cantina,
    pvpGame: cantina,
    deckBuilder: openingTheme,
    settingsPage: openingTheme,
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
      <img onClick={togglePlay} src={isPlaying ? mute : voice} />
    </div>
  );
};

export default BackgroundMusic;

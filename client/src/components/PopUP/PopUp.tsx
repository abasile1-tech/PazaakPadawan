import { useEffect } from 'react';
import { PopUpProps } from '../../types';

function PopUp({
  title,
  onClick,
  message,
  buttonText = 'OK',
  audiofile,
}: PopUpProps) {
  useEffect(() => {
    if (audiofile) {
      const audio = new Audio(audiofile);
      audio.play();
    }
  }, []);

  return (
    <div className="popup-box">
      <div className="popup-content">
        <h2 className="popup-title">{title}</h2>
        <p className="popup-message">{message}</p>
        <button onClick={onClick} className="popup-button">
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default PopUp;

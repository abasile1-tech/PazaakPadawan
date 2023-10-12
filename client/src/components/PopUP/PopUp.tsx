//popup message on play page
//welcome message(game turn = 0), tutorial message, result message(game ends)
import Title from './Title';
import Message from './Message';

interface PopUpProps {
  title?: string;
  message: string;
  buttonText?: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

function PopUp({ title, onClick, message, buttonText = 'OK' }: PopUpProps) {
  // const popupTexts = copyForTutorial(popupType);
  return (
    <div className="popup-message">
      {title && <Title>{title}</Title>}
      <Message>{message}</Message>
      <button onClick={onClick} className="pop-message-button">
        {buttonText}
      </button>
    </div>
  );
}

export default PopUp;

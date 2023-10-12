//popup message on play page
//welcome message(game turn = 0), tutorial message, result message(game ends)
import Title from './Title';
import Message from './Message';

interface gameStatusProps {
  popupType: string;
}
interface PopUpProps {
  // title?: string;
  // message: string;
  // buttonText: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

function copyForTutorial(popupType: string) {
  if (popupType === 'welcome') {
    return {
      title: 'WELCOME TO PAZAAK',
      message:
        'Beat your opponent by getting closest to 20 without going over.',
      buttonText: "LET'S GO!",
    };
  } else if (popupType === 'result_opponentwins') {
    return { message: 'THE OPPONENT WINS THE SET.', buttonText: 'OK' };
  } else if (popupType === 'result_userwins') {
    return { message: 'YOU WIN THE SET.', buttonText: 'OK' };
  } else if (popupType === 'result_tie') {
    return { message: 'THE SET IS TIED.', buttonText: 'OK' };
  }

  return { title: '', message: '', buttonText: '' };
}

function PopUp({ popupType, onClick }: gameStatusProps & PopUpProps) {
  const popupTexts = copyForTutorial(popupType);
  return (
    <div className="popup-message">
      <Title>{popupTexts.title}</Title>
      <Message>{popupTexts.message}</Message>
      <button onClick={onClick} className="pop-message-button">
        {popupTexts.buttonText}
      </button>
    </div>
  );
}

export default PopUp;

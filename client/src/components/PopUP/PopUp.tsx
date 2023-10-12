//popup message on play page
//welcome message(game turn = 0), tutorial message, result message(game ends)

interface PopUpProps {
  title?: string;
  message: string;
  buttonText?: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

function PopUp({ title, onClick, message, buttonText = 'OK' }: PopUpProps) {
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

import { useState, SetStateAction } from 'react';
import { Client } from 'stompjs';

interface PublicChat {
  senderName: string;
  receiverName: string;
  message: string;
  date: Date;
  status: string;
  sessionID: string;
}

enum PlayerState {
  PLAY = 'play',
  STAND = 'stand',
  ENDTURN = 'endturn',
}

interface CardProps {
  value: number;
  color: string;
}

interface Player {
  name: string;
  action: PlayerState;
  wonGame: boolean;
  isTurn: boolean;
  hand: CardProps[];
  tally: number;
  table: CardProps[];
  gamesWon: number;
  playedCardThisTurn: boolean;
}

interface ChatProps {
  setSessionID: React.Dispatch<SetStateAction<string>>;
  setPlayer: React.Dispatch<SetStateAction<Player>>;
  player1: Player;
  stompClient: Client | null;
  connectToWs: () => void;
}

const Chat = ({
  setSessionID,
  setPlayer,
  player1,
  stompClient,
  connectToWs,
}: ChatProps) => {
  const [publicChats, setPublicChats] = useState<PublicChat[]>([]);
  const [userData, setUserData] = useState({
    username: '',
    receiverName: '',
    connected: false,
    message: '',
    sessionID: '',
  });

  const handleUserName = (event: { target: HTMLInputElement }) => {
    if (!event || !event.target) {
      console.warn('event is null');
      return;
    }
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const handleSessionID = (event: { target: HTMLInputElement }) => {
    if (!event || !event.target) {
      console.warn('event is null');
      return;
    }
    const { value } = event.target;
    setUserData({ ...userData, sessionID: value });
  };

  const handleMessage = (event: { target: HTMLInputElement }) => {
    if (!event || !event.target) {
      console.warn('event is null');
      return;
    }
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const registerUser = () => {
    setUserData({ ...userData, connected: true });
    setSessionID(userData.sessionID);
    setPlayer({ ...player1, name: userData.username });
    connectToWs();
    console.log('CONNECTING TO WEBSOCKET');
    if (!stompClient) {
      console.warn('stompClient is undefined. Unable to subcribe to events.');
      return;
    }
    stompClient.subscribe('/chatroom/public', onPublicMessageReceived, {});
    userJoin();
  };

  const userJoin = () => {
    const chatMessage = {
      senderName: userData.username,
      status: 'JOIN',
    };
    if (!stompClient) {
      console.warn('stompClient is undefined. Unable to send message.');
      return;
    }
    stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
  };

  interface Payload {
    body: string;
  }

  const onPublicMessageReceived = (payload: Payload) => {
    const payloadData = JSON.parse(payload.body);
    console.log('GOT TO PUBLIC MESSAGE');
    switch (payloadData.status) {
      case 'MESSAGE':
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
  };

  const sendPublicMessage = () => {
    if (stompClient) {
      const today = new Date();
      const chatMessage = {
        senderName: userData.username,
        receiverName: 'hard-coded receiver name',
        message: userData.message,
        status: 'MESSAGE',
        date: today,
        sessionID: userData.sessionID,
      };
      stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: '' });
    }
  };

  return (
    <div>
      {userData.connected ? (
        <div>
          <h2>Your username: {userData.username} </h2>
          <h2>Your session ID: {userData.sessionID}</h2>
          <div>
            {publicChats.map((chat, index) => (
              <div key={index}>
                {chat.senderName}: {chat.message}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type message here..."
            value={userData.message}
            onChange={handleMessage}
          />
          <button type="button" onClick={sendPublicMessage}>
            Send
          </button>
        </div>
      ) : (
        <div>
          <input
            id="user-name"
            placeholder="Enter the user name"
            value={userData.username}
            onChange={handleUserName}
          />
          <input
            id="session-id"
            placeholder="Enter the session id"
            value={userData.sessionID}
            onChange={handleSessionID}
          />
          <button type="button" onClick={registerUser}>
            connect
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;

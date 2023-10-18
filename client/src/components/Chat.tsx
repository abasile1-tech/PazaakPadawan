import { SetStateAction, useEffect, useState } from 'react';
import { over, Client, Frame } from 'stompjs';
import SockJS from 'sockjs-client';

let stompClient: Client | null = null;

interface PublicChat {
  senderName: string;
  receiverName: string;
  message: string;
  date: Date;
  status: string;
  sessionID: string;
}

enum GameState {
  INITIAL = 'initial',
  STARTED = 'started',
  ENDED = 'ended',
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

interface GameObject {
  player1: Player;
  player2: Player;
  gameState: GameState;
  sessionID: string;
}

interface ChatProps {
  gameObject: GameObject;
  setPlayer: React.Dispatch<SetStateAction<Player>>;
  setOtherPlayer: React.Dispatch<SetStateAction<Player>>;
  setGameState: React.Dispatch<SetStateAction<GameState>>;
  setSessionID: React.Dispatch<SetStateAction<string>>;
}

const Chat: React.FC<ChatProps> = ({
  gameObject,
  setPlayer,
  setOtherPlayer,
  setGameState,
  setSessionID,
}) => {
  const [publicChats, setPublicChats] = useState<PublicChat[]>([]);
  const [userData, setUserData] = useState({
    username: '',
    receiverName: '',
    connected: false,
    message: '',
    sessionID: '',
  });

  // useEffect(() => {
  //   const updateGameObject = () => {
  //     if (!stompClient) {
  //       console.warn('stompClient is undefined. Unable to send message.');
  //       return;
  //     }
  //     stompClient.send(
  //       '/app/updateGame',
  //       {
  //         id: 'game',
  //       },
  //       JSON.stringify(gameObject)
  //     );
  //   };
  //   updateGameObject();
  // }, [
  //   gameObject,
  //   gameObject.player1,
  //   gameObject.player2,
  //   gameObject.gameState,
  //   gameObject.sessionID,
  // ]);

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
    // const url = import.meta.env.PROD
    //   ? import.meta.env.VITE_PROD_URL
    //   : import.meta.env.VITE_DEV_URL;
    // const Sock = new SockJS(url + 'ws');
    const Sock = new SockJS('http://192.168.0.5:8080/' + 'ws');
    stompClient = over(Sock);
    stompClient.connect({ login: '', passcode: '' }, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    if (!stompClient) {
      console.warn('stompClient is undefined. Unable to subcribe to events.');
      return;
    }
    stompClient.subscribe('/chatroom/public', onPublicMessageReceived, {});
    // stompClient.subscribe('/game/initialConnection', onGameInitialConnectionReceived);
    stompClient.subscribe('/game/updated', onGameUpdatedReceived, {
      id: 'game',
    });
    userJoin();
    sendInitialConnectingData();
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

  const sendInitialConnectingData = () => {
    // We will always set the player1 name to the user name on initial connection.
    // The backend will handle assigning the players.
    const player1 = { ...gameObject.player1, name: userData.username };
    const initialConnectingData = {
      ...gameObject,
      player1: player1,
      sessionID: userData.sessionID,
    };
    if (!stompClient) {
      console.warn('stompClient is undefined. Unable to send message.');
      return;
    }
    stompClient.send(
      '/app/updateGame',
      {
        id: 'game',
      },
      JSON.stringify(initialConnectingData)
    );
  };

  const onError = (err: string | Frame) => {
    console.log(err);
  };

  interface Payload {
    body: string;
  }

  // const onGameInitialConnectionReceived = (payload: Payload) => {
  //   const payloadData = JSON.parse(payload.body);
  //   console.log('payLoadData: ', payloadData);
  //   setSessionID(payloadData.sessionId);
  // };

  const onGameUpdatedReceived = (payload: Payload) => {
    const payloadData = JSON.parse(payload.body);
    console.log('payloadData: ', payloadData);
    setPlayer(payloadData.player1);
    setOtherPlayer(payloadData.player2);
    setGameState(payloadData.gameState);
    setSessionID(payloadData.sessionID);
  };

  const onPublicMessageReceived = (payload: Payload) => {
    const payloadData = JSON.parse(payload.body);
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

import { useState } from 'react';
import { Client } from 'stompjs';

interface PublicChat {
  senderName: string;
  receiverName: string;
  message: string;
  date: Date;
  status: string;
}

interface UserData {
  username: string;
  receiverName: string;
  connected: boolean;
  message: string;
}

interface ChatProps {
  stompClient: Client;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

const Chat = ({ stompClient, userData, setUserData }: ChatProps) => {
  const [publicChats, setPublicChats] = useState<PublicChat[]>([]);

  const handleUserName = (event: { target: HTMLInputElement }) => {
    if (!event || !event.target) {
      console.warn('event is null');
      return;
    }
    const { value } = event.target;
    setUserData((current) => {
      return { ...current, username: value };
    });
  };
  const handleMessage = (event: { target: HTMLInputElement }) => {
    if (!event || !event.target) {
      console.warn('event is null');
      return;
    }
    const { value } = event.target;
    setUserData((current) => {
      return { ...current, message: value };
    });
  };

  const registerUser = () => {
    setUserData((current) => {
      return { ...current, connected: true };
    });
    if (!stompClient) {
      console.warn('stompClient is undefined. Unable to subcribe to events.');
      return;
    }
    stompClient.subscribe('/game/chatroom', onPublicMessageReceived);
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
    stompClient.send('/app/chatMessage', {}, JSON.stringify(chatMessage));
  };

  interface Payload {
    body: string;
  }

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
      };
      stompClient.send('/app/chatMessage', {}, JSON.stringify(chatMessage));
      setUserData((current) => {
        return { ...current, message: '' };
      });
    }
  };

  return (
    <div>
      {userData.connected ? (
        <div>
          <h2>Your username: {userData.username} </h2>
          <div>
            {publicChats.map((chat, index) => (
              <div key={index}>
                {chat.senderName}: {chat.message}
              </div>
            ))}
          </div>
          <input
            className="messageBox"
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
            className="messageBox"
            id="user-name"
            placeholder="Enter the user name"
            value={userData.username}
            onChange={handleUserName}
          />
          <button className="gameButtons" type="button" onClick={registerUser}>
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;

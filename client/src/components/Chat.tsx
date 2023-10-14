import { useState } from 'react';
import { over, Client, Frame } from 'stompjs';
import SockJS from 'sockjs-client';

let stompClient: Client | null = null;

interface PublicChat {
  senderName: string;
  message: string;
  status: string;
}

const Chat = () => {
  const [publicChats, setPublicChats] = useState<PublicChat[]>([]);
  const [userData, setUserData] = useState({
    username: '',
    receiverName: '',
    connected: false,
    message: '',
  });

  const handleUserName = (event: { target: HTMLInputElement }) => {
    if (!event || !event.target) {
      console.warn('event is null');
      return;
    }
    const { value } = event.target;
    setUserData({ ...userData, username: value });
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
    const Sock = new SockJS('http://localhost:8080/ws');
    // const Sock = new SockJS('https://pazaak-3533536a7b01.herokuapp.com/ws');
    stompClient = over(Sock);
    stompClient.connect({ login: '', passcode: '' }, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    if (!stompClient) {
      console.warn('stompClient is undefined. Unable to subcribe to events.');
      return;
    }
    stompClient.subscribe('/chatroom/public', onPublicMessageReceived);
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

  const onError = (err: string | Frame) => {
    console.log(err);
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
      const chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: 'MESSAGE',
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
          <button type="button" onClick={registerUser}>
            connect
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;

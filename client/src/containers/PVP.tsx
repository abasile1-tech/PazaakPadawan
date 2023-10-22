import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat';
import PVPGame from '../components/PVPGame';

const PVP = () => {
  // const url = import.meta.env.PROD
  //   ? import.meta.env.VITE_PROD_URL
  //   : import.meta.env.VITE_DEV_URL;
  // const Sock = new SockJS(url + 'ws');
  const BASE_URL = 'http://192.168.0.5';
  const port = 8080;
  const [stompClient, setStompClient] = useState<Stomp.Client>(
    Stomp.over(new SockJS(`${BASE_URL}:${port}/ws`))
  );
  const [serverConnected, setServerConnected] = useState(false);
  const [attemptReconnect, setAttemptReconnect] = useState(0);
  const [userData, setUserData] = useState({
    username: '',
    receiverName: '',
    connected: false,
    message: '',
  });

  useEffect(() => {
    const socket = new SockJS(`${BASE_URL}:${port}/ws`);
    const client = Stomp.over(socket);
    client.connect(
      { login: '', passcode: '' },
      () => {
        console.log('Connected to server');
        // could subscribe or send messages here
        // this happens initially and then whenever there is a need to reconnect
        setServerConnected(true);

        client.ws.onclose = () => {
          console.log('Connection terminated');
          setServerConnected(false);
        };
        setStompClient(client);
      },
      (err) => {
        console.warn(err);
      }
    );
  }, [attemptReconnect]);

  return (
    <>
      {serverConnected == true ? null : (
        <div>
          <h5>Not connected to game server</h5>
          <button
            className="button"
            onClick={() => setAttemptReconnect(attemptReconnect + 1)}
          >
            Reconnect
          </button>
        </div>
      )}
      <PVPGame />
      <Chat
        stompClient={stompClient}
        userData={userData}
        setUserData={setUserData}
      />
    </>
  );
};

export default PVP;

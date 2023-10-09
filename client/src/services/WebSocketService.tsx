import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useState } from 'react';

function WebSocketClient() {
  const [severStatus, setServerStatus] = useState(false);
  const [attemptReconnect, setAttemptReconnect] = useState(0);
  const [serverMessageLog, serverSetMessageLog] = useState('No data');

  useEffect(() => {
    const port = 8080;
    const socket = new SockJS(`http://localhost:${port}/websocket`);
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log('Connected to server');
      stompClient.subscribe('/topic/connect', (message: any) => {
        serverSetMessageLog(message.body.slice(12, -2));
      });

      stompClient.subscribe('/topic/chat', (message: any) => {});

      stompClient.send(
        '/app/hello',
        {},
        JSON.stringify(`Client Connected on ${port}`)
      );
      setServerStatus(true);

      stompClient.ws.onclose = () => {
        console.log('Connection terminated');
        setServerStatus(false);
      };
    });
  }, [attemptReconnect]);

  return (
    <>
      {severStatus == true ? (
        <h1>Connected to server</h1>
      ) : (
        <div>
          <h1>Not connected to server</h1>{' '}
          <button onClick={() => setAttemptReconnect(attemptReconnect + 1)}>
            Reconnect
          </button>
        </div>
      )}
      <h1>{serverMessageLog}</h1>
    </>
  );
}

export default WebSocketClient;

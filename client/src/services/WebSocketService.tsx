import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const WS_URL = 'http://localhost:8080/websocket';

function WebSocketClient() {
  const socket = new SockJS(WS_URL);
  const stompClient = Stomp.over(socket);

  useEffect(() => {
    stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);

      stompClient.subscribe('/topic/messages', function (message) {
        const body = JSON.parse(message.body);
        console.log(message.body);
        console.log('Received message from Alice: ' + body.text);
      });

      stompClient.send('/app/chat', {}, JSON.stringify('from the client'));
    });
  }, [stompClient]);

  return <div>Hello WebSockets!</div>;
}

export default WebSocketClient;

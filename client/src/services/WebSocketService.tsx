import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

const WS_URL = 'ws://192.168.0.5:8080/topic/messages';

function WebSocketClient() {
  const { sendJsonMessage } = useWebSocket(WS_URL, {
    onOpen: () => console.log('WebSocket connection established.'),
    shouldReconnect: () => true,
  });

  useEffect(() => {
    sendJsonMessage({ type: 'ping' });
  }, [sendJsonMessage]);

  return <div>Hello WebSockets!</div>;
}

export default WebSocketClient;

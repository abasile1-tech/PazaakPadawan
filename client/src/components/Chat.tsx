import React, { useState, useEffect } from 'react';

type Message = {
  id: number;
  text: string;
  user: string;
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<string>('User');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const newMessageObj: Message = {
      id: Date.now(),
      text: newMessage,
      user: currentUser,
    };
    setMessages([...messages, newMessageObj]);
    setNewMessage('');
  };

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-container" id="chat-container">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <span className="user">{message.user}:</span> {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

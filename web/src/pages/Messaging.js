import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function Messaging({ userId, otherUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.emit('join_room', userId);
    fetch(`/api/message/${userId}/${otherUserId}`)
      .then(res => res.json())
      .then(setMessages);
    socket.on('receive_message', (msg) => {
      setMessages(m => [...m, msg]);
    });
    return () => socket.off('receive_message');
  }, [userId, otherUserId]);

  const sendMessage = () => {
    socket.emit('send_message', { senderId: userId, receiverId: otherUserId, content: input });
    setMessages([...messages, { senderId: userId, content: input, timestamp: new Date() }]);
    setInput('');
  };

  return (
    <div>
      <h3>Chat</h3>
      <div style={{ border: '1px solid #ccc', height: 200, overflowY: 'scroll' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.senderId === userId ? 'right' : 'left' }}>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Messaging;

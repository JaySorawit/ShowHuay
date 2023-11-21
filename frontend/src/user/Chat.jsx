import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function Chat() {
  const { id: receiverId } = useParams();
  const UserId = localStorage.getItem('userId');
  const socketRef = useRef(); // Create a ref for the socket

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  console.log(receiverId);
  console.log(UserId);

  useEffect(() => {
    // Connect to the server and join the chat room based on receiverId
    socketRef.current = io('http://localhost:3000/');

    // Join the room with the receiverId
    socketRef.current.emit('joinRoom', receiverId);

    // Listen for incoming messages
    socketRef.current.on('chat message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up socket connection on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [receiverId]);

  useEffect(() => {
    console.log('Chat component mounted with receiverId:', receiverId);
    socketRef.current = io('http://localhost:3000/');
    console.log('Socket connected');
    socketRef.current.emit('joinRoom', receiverId);
    console.log('Joining room:', receiverId);
  
    // Rest of the code...
  }, [receiverId]);
  
  

  const handleSendMessage = () => {
    // Access the socket through the ref
    socketRef.current.emit('chat message', { message: newMessage, senderId: UserId, receiverId });
    setNewMessage('');
  };

  return (
    <>
      <Navbar />
      {/* rest of the component */}
      <div className="card-footer">
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              {message.sender === UserId ? (
                <span>
                  <strong>You:</strong> {message.message}
                </span>
              ) : (
                <span>
                  <strong>{message.sender ? message.sender : 'Anonymous'}:</strong> {message.message}
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="newMessage"
            placeholder="Send new message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="btn btn-success"
            type="button"
            id="sendMessage"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default Chat;

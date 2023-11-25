import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function Chat() {
  const { id: receiverId } = useParams();
  const userId = localStorage.getItem('userId');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const socketRef = useRef(); // Create a ref for the socket

  useEffect(() => {
    // Initialize the socket when the component mounts
    const socket = io('http://localhost:3000/chat/');
    socketRef.current = socket;    

    // Listen for incoming messages
    socket.on('chat message', (message) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        console.log(newMessages);
        return newMessages;
      });
      console.log("Messages after state update:", messages); // Add this line
    });
    
    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Move this useEffect outside the first useEffect
  useEffect(() => {
    console.log('Updated Messages:', messages);
  }, [messages]);

  const handleSendMessage = () => {
    // Access the socket through the ref
    socketRef.current.emit('chat message', { message: newMessage, userId, receiverId });
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
              {message.sender === userId ? (
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

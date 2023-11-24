import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function Chat() {
    const { id: receiverId } = useParams();
    const UserId = localStorage.getItem('userId');
    
    let receiverIdd = receiverId;
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    
    useEffect(() => {
      const loggedInStatus = localStorage.getItem('isLoggedIn');
      if (loggedInStatus === 'true') {
        setIsLoggedIn(true);
        const storedUsername = localStorage.getItem('username');
        const storedUserId = localStorage.getItem('userId');
        setUsername(storedUsername);
        setUserId(storedUserId);
      }
    }, []);
    
    console.log(username);
    console.log(userId);
    

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const socketRef = useRef(); // Create a ref for the socket

  useEffect(() => {
    // Initialize the socket when the component mounts
    const socket = io('http://localhost:3000');
    socketRef.current = socket;

    // Listen for incoming messages
    socket.on('chat message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    // Access the socket through the ref
    socketRef.current.emit('chat message', { message: newMessage, UserId, receiverId });
    setNewMessage('');
  };

  return (
    <>
      <Navbar />
      {/* rest of the component */}
      <div className="card-footer">
      {/* <h1>
            UserIdd: {UserIdd} <br />
            receiverIdd: {receiverIdd}
    </h1> */}
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
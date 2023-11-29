import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from './Navbar';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Chat() {
  const userId = localStorage.getItem('userId');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [partner, setPartner] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const socketRef = useRef();

  // get chat history
  useEffect(() => {
    const getUserChat = async () => {
      if (userId !== null) {
        try {
          const res = await axios.get(`http://localhost:3000/chat/?receiverId=${userId}`);
          console.log(res.data);
  
          // Check if res.data.chat is an array and not empty before mapping
          const partners = Array.isArray(res.data.chat) && res.data.chat.length > 0
            ? res.data.chat.map(partner => ({
                partnerId: partner.send_user_id,
                partnerName: partner.username,
              }))
            : [];
  
          setPartner(partners);
        } catch (error) {
          console.error('Error fetching user chat:', error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    getUserChat();
  }, [userId]);
  
  
  const { id } = useParams();
  const receiverId = id;

  useEffect(() => {
    const socket = io('http://localhost:3000/chat/');
    socketRef.current = socket;

    socket.on('chat message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    socketRef.current.emit('chat message', { message: newMessage, senderId: userId, receiverId });
    setNewMessage('');
  };

  return (
    <>
      <Navbar />
      <div className="chatSelector">
      <h1> Chat</h1>
      {console.log(partner)} {/* Add this line */}
      {partner.map(partner => (
        <div key={partner.partnerId}>
          {partner.partnerName}
        </div>
      ))}
    </div>
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

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import io from 'socket.io-client';
import "bootstrap/dist/css/bootstrap.min.css";

const socket = io('http://localhost:3001');

function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    let sender = '1022';
    let receiver = '555';

    useEffect(() => {
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
        socket.emit('chat message', { message: newMessage, sender, receiver });
        setNewMessage('');
    };

    return (
        <>
        <Navbar />
        <div className="BG" style={{ width: '100%', backgroundColor: '#D9D9D9' }}>
            <div className="container-xxl" style={{ width: '1170px', backgroundColor: 'red' }}>
            <div className="Chat">
                <div className="contactlist"></div>
                <div className="chatdetail">
                <div className="card-footer">
                    <ul>
                        {messages.map((message, index) => (
                        <li key={index}>
                            {message.sender === sender ? (
                            <span>
                                <strong>You:</strong> {message.message}
                            </span>
                            ) : (
                            <span>
                                <strong>{message.sender}:</strong> {message.message}
                            </span>
                            )}
                        </li>
                        ))}
                    </ul>
                    <div className="input-group">
                    <input
                        type='text'
                        className='form-control'
                        id='newMessage'
                        placeholder='Send new message'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        className='btn btn-success'
                        type='button'
                        id='sendMessage'
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </>
    );
}

export default Chat;

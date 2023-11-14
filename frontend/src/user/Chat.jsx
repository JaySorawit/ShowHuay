import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import io from 'socket.io-client';
import "bootstrap/dist/css/bootstrap.min.css";

const socket = io('http://localhost:3000/chat');

function Chat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });
        
        return () => {
            socket.disconnect();};
        }, []);
        
    const handleSendMessage = () => {
        socket.emit('chat message', message);
        setMessage('');
    };

  return (
      <>
      <Navbar/>
      <div className="BG" style={{width:'100%',backgroundColor:'#D9D9D9'}}>
        <div className="container-xxl" style={{width:'1170px',backgroundColor:'red'}}>
            <div className="Chat">
                <div className="contactlist">

                </div>
                <div className="chatdetail">
                    <div className="card-footer">
                        <div className="input-group">
                            <input type='text' className='form-control' id='message' placeholder='Send new message' value={message} onChange={(e) => setMessage(e.target.value)}/>
                            <button className='btn btn-success' type='button' id='message' onClick={handleSendMessage} >Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
      </div>
      </>
  )
}

export default Chat
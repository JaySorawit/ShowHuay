import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import Navbar from "./Navbar";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Chat.css";
import userImage from "../assets/icon/userImage.png";

function Chat() {

  const navigate = useNavigate();
  let { id } = useParams();
  const userId = localStorage.getItem("userId");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [participant, setparticipant] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);


  const socketRef = useRef();

  // get chat User
  useEffect(() => {
    const getUserChat = async () => {
      if (userId !== null) {
        try {
          const res = await axios.post(
            `http://localhost:3000/chat`,{ receiverId: userId, }
          );

          const participants =
            Array.isArray(res.data.chat) && res.data.chat.length > 0
              ? res.data.chat.map((participant) => ({
                  participantId: participant.userId,
                  participantName: participant.username,
                }))
              : [];

          setparticipant(participants);
        } catch (error) {
          console.error("Error fetching user chat:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    getUserChat();
  }, [userId]);

  const receiverId = id;

  useEffect(() => {
    const socket = io("http://localhost:3000/chat/");
    socketRef.current = socket;

    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/account/getuser/${id}`);
        // console.log(res.data);
        setReceiver({
          receiverId: res.data.user_id,
          receiverName: res.data.username,
        });
        if (id) {
          handleChatSelection(id);
        }
      } catch (error) {
        console.error('Error fetching user information or chat history:', error);
        if (error.response && error.response.status == 404 && id != null) {
          navigate('/*');
        }
      }
    };
    fetchData();
  }, [id, history]);
  
  // Fetch chat history when the component mounts
  const handleChatSelection = async (selectedparticipantId) => {
    try {
      navigate(`/Chat/${selectedparticipantId}`);
      const res = await axios.get(`http://localhost:3000/chat/${userId}`, {
        params: {
          receiverId: selectedparticipantId,
          senderId: userId,
        },
      });

      const chatHistory =
            Array.isArray(res.data.chat) && res.data.chat.length > 0
              ? res.data.chat.map((chat) => ({
                messageId: chat.chat_id,
                receiveId: chat.receive_user_id,
                senderId: chat.send_user_id,
                chatText: chat.chat_text,
                timestamp: chat.time,
              }))
              : [];
      // console.log(chatHistory);
      setChatHistory(chatHistory); 
      setSelectedChat(selectedparticipantId);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };
  
  const handleSendMessage = () => {
    socketRef.current.emit("chat message", {
      message: newMessage,
      senderId: userId,
      receiverId,
    });
    setNewMessage("");
  };

  return (
  <>
    <Navbar />
    <div className="container app">
      <div className="row app-one" style={{justifyContent: 'center',paddingTop:'20px'}}>
        <div className="col-sm-3 side">
          <div className="side-one">
            <div className="rowheading">
              <h4>Chat </h4>
            </div>

            <div className="rowsideBar">
              {participant.length > 0 ? (
                participant.map((participant) => (
                  <div className="row sideBar-body" key={participant.participantId} role="button" onClick={() => {handleChatSelection(participant.participantId);}}>                  
                    <div className="col-sm-3 col-xs-3 sideBar-avatar">
                      <div className="avatar-icon">
                      <img src={userImage} style={{ width: '60px', height: '60px' }} />
                      </div>
                    </div>
                    <div className="col-sm-9 col-xs-9 sideBar-main" style={{margin:"auto 0", paddingLeft:"15px"}}>
                      <div className="col-sm-8 col-xs-8 sideBar-name">
                          <span className="name-meta" style={{fontWeight:"500"}}>{participant.participantName}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{fontWeight:"500"}} >No available participants.</p>
              )}
            </div>

          </div>
        </div>

        <div className="col-sm-8 conversation" style={{padding:'0'}}>
          {id ? (
            <>
              <div className="rowheading2">
                <img src={userImage} style={{ width: '50px', height:'50px' }} />
                <p>{receiver?.receiverName}</p>
              </div>

              <div className="row-message" id="conversation">
                {chatHistory.map((message) => (
                  <div key={message.messageId} className={message.senderId === userId ? 'sent-message' : 'received-message'}>
                    {message.receiveId == userId ? (
                            <img src={userImage} style={{ width: '40px', height: '40px', marginLeft:'20px' }} alt="User" />
                          ) : (
                            <img src={userImage} style={{ width: '40px', height: '40px', opacity:'0%' }} alt="Receiver" />
                    )}
                    <div className="message-content">
                      <div className={message.receiveId == userId ? 'receive-message' : 'send-message'}>{message.chatText}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row reply" style={{marginBottom:'10px'}}>
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
          ) : (
            <p style={{fontWeight:"500",height: '80vh', display:'flex', alignItems: 'center', justifyContent: 'center'}}>You haven't selected a chat yet.</p>
          )}
        </div>
      </div>
    </div>

  </>
  );
}

export default Chat;

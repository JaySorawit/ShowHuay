import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import Navbar from "./Navbar";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Chat.css";

function Chat(selectedparticipantId) {

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [participant, setparticipant] = useState([]);
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
          console.log(res.data);

          // Check if res.data.chat is an array and not empty before mapping
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

  const { id } = useParams();
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
  
  const handleChatSelection = async (selectedparticipantId) => {
    try {
      // navigate(`/Chat/${selectedparticipantId}`);
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
      console.log(chatHistory);
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
      <div className="row app-one">
        <div className="col-sm-4 side">
          <div className="side-one">
            <div className="row heading">
              {/* <!-- User Info and Icons --> */}
              Chat
            </div>

            <div className="row sideBar">
              {/* User List */}
              {participant.length > 0 ? (
                participant.map((participant) => (
                  <div className="row sideBar-body" key={participant.participantId} role="button" onClick={() => {handleChatSelection(participant.participantId);}}>                  
                    <div className="col-sm-3 col-xs-3 sideBar-avatar">
                      <div className="avatar-icon">
                        <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="Avatar" />
                      </div>
                    </div>
                    <div className="col-sm-9 col-xs-9 sideBar-main">
                      <div className="col-sm-8 col-xs-8 sideBar-name">
                          <span className="name-meta">{participant.participantName}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No available participants.</p>
              )}
            </div>

          </div>
        </div>

        <div className="col-sm-8 conversation" style={{height:"85vh"}}>
          {/*if select http://localhost:5173/Chat/ show "You haven't selected a chat yet."*/}
          <div className="row heading">
            {/* <!-- Conversation Heading --> Show username */}
          </div>

          <div className="row message" id="conversation">
            {Array.isArray(chatHistory) && chatHistory.length > 0 ? (
              chatHistory.map((message) => (
                <div key={message.messageId} className={message.senderId === userId ? 'sent-message' : 'received-message'}>
                  {message.senderId == userId ? 'You' : 'Receiver'}: {message.chatText}
                </div>
              ))
            ) : (
              <p>Please select the chat/ You dont have any chat right now.</p>
            )}
          </div>

          <div className="row reply">
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
        </div>
      </div>
    </div>

  </>
  );
}

export default Chat;

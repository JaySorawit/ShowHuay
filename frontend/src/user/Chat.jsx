import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Navbar from "./Navbar";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Chat() {
  const userId = localStorage.getItem("userId");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [partner, setPartner] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const socketRef = useRef();

  // get chat history
  useEffect(() => {
    const getUserChat = async () => {
      if (userId !== null) {
        try {
          const res = await axios.get(
            `http://localhost:3000/chat/?receiverId=${userId}`
          );
          console.log(res.data);

          // Check if res.data.chat is an array and not empty before mapping
          const partners =
            Array.isArray(res.data.chat) && res.data.chat.length > 0
              ? res.data.chat.map((partner) => ({
                  partnerId: partner.send_user_id,
                  partnerName: partner.username,
                }))
              : [];

          setPartner(partners);
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
              {partner.map((partner) => (
                <div className="row sideBar-body" key={partner.partnerId}>
                  <div className="col-sm-3 col-xs-3 sideBar-avatar">
                    <div className="avatar-icon">
                      <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="Avatar" />
                    </div>
                  </div>

                  <div className="col-sm-9 col-xs-9 sideBar-main">
                    <div className="row">
                      <div className="col-sm-8 col-xs-8 sideBar-name">
                        <span className="name-meta">{partner.partnerName}</span>
                      </div>
                      <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                        {/* <span className="time-meta pull-right">18:18</span> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="side-two">
            {/* <!-- New Chat Heading --> */}
            <div className="row composeBox">
              {/* <!-- Compose Box --> */}
            </div>

            <div className="row compose-sideBar">
              {/* <!-- Compose User List --> */}
            </div>
          </div>
        </div>

        <div className="col-sm-8 conversation">
          <div className="row heading">
            {/* <!-- Conversation Heading --> */}
          </div>

          <div className="row message" id="conversation">
            {/* <!-- Messages --> */}
          </div>

          <div className="row reply">
            {/* <!-- Reply Section --> */}
          </div>
        </div>
      </div>
    </div>

  </>
  );
}

export default Chat;

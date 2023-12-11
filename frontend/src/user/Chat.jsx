import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Chat.css";
import userImage from "../assets/icon/userImage.png";

function Chat() {
  /***************************************** Initialize State ***********************************************/
  const navigate = useNavigate();
  const { id } = useParams();
  const receiverId = id;
  const userId = localStorage.getItem("userId");
  const [participant, setParticipant] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  /*************************************************************************************************************/

  /************************************ fetch chat paticipants *************************************************/
  useEffect(() => {
    const getUserChat = async () => {
      try {
        const res = await axios.post(`http://localhost:3000/chat/`, {
          receiverId: userId,
        });

        const participants =
          Array.isArray(res.data.chat) && res.data.chat.length > 0
            ? res.data.chat.map((participant) => ({
                participantId: participant.userId,
                participantName: participant.username,
              }))
            : [];

        setParticipant(participants);
      } catch (error) {
        console.error("Error fetching user chat:", error);
      }
    };
    getUserChat();
  }, [userId]);
  /*************************************************************************************************************/

  /************************************ handle socket connection ************************************************/
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", userId);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, userId]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("sendMessage", {
      receiveId: receiverId,
      senderId: userId,
      chatText: messages[messages.length - 1].chatText,
    });
  }, [messages]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
      console.log("getMessage event received:", res);
      setChatHistory((prevChatHistory) => [...prevChatHistory, res]);
    });
    return () => {
      socket.off("getMessage");
    };
  }, [socket]);
  /*************************************************************************************************************/

  /****************************** handle Chat Selection and fetch chat history ***********************************/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/account/getuser/${id}`
        );
        setReceiver({
          receiverId: res.data.user_id,
          receiverName: res.data.username,
        });
        if (id) {
          handleChatSelection(id);
        }
      } catch (error) {
        console.error(
          "Error fetching user information or chat history:",
          error
        );
        if (id != null) {
          if (error.response && error.response.status === 404) {
            navigate("/*");
          }
        }
      }
    };
    fetchData();
  }, [id]);

  const handleChatSelection = async (selectedParticipantId) => {
    try {
      navigate(`/Chat/${selectedParticipantId}`);
      const res = await axios.get(`http://localhost:3000/chat/${userId}`, {
        params: {
          receiverId: selectedParticipantId,
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
      setChatHistory(chatHistory);
      setSelectedChat(selectedParticipantId);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };
  /*************************************************************************************************************/

  /************************************Scroll to bottom when chat update ***************************************/
  const chatBoxRef = useRef(null);
  useEffect(() => {
    // Scroll to the bottom after the component updates (new message is added)
    const chatBoxElement = chatBoxRef.current;
    if (chatBoxElement) {
      chatBoxElement.scrollTop = chatBoxElement.scrollHeight;
    }
  }, [messages]);
  /*************************************************************************************************************/

  /****************************************** handle Send Message **********************************************/
  const handleSendMessage = async () => {
    try {
      if (typeof newMessage !== "string" || newMessage.trim() === "") {
        console.error("Error sending message: Invalid message format");
        return;
      }

      const response = await axios.post(
        `http://localhost:3000/chat/${userId}`,
        {
          receiverId,
          senderId: userId,
          text: newMessage,
        }
      );

      const { Message } = response.data;
      const firstTime = Message.firstTime;
      if (firstTime) {
        window.location.reload();
      }
      if (!firstTime) {
        socket.emit("newMessage", Message);
      }
      setMessages((prevMessages) => [...prevMessages, Message]);
      setChatHistory((prevChatHistory) => [...prevChatHistory, Message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  /*************************************************************************************************************/

  return (
    <>
      <Navbar />
      <div className="container app">
        <div
          className="row app-one"
          style={{ justifyContent: "center", paddingTop: "20px" }}
        >
          <div className="col-sm-3 side">
            <div className="side-one">
              <div className="rowheading">
                <h4>Chat </h4>
              </div>

              <div className="rowsideBar">
                {participant.length > 0 ? (
                  participant.map((participant) => (
                    <div
                      className="row sideBar-body"
                      key={participant.participantId}
                      role="button"
                      onClick={() => {
                        handleChatSelection(participant.participantId);
                      }}
                    >
                      <div className="col-sm-3 col-xs-3 sideBar-avatar">
                        <div className="avatar-icon">
                          <img
                            src={userImage}
                            style={{ width: "60px", height: "60px" }}
                          />
                        </div>
                      </div>
                      <div
                        className="col-sm-9 col-xs-9 sideBar-main"
                        style={{
                          margin: "auto 0",
                          paddingLeft: "15px",
                          minWidth: "150px",
                        }}
                      >
                        <div className="col-sm-8 col-xs-8 sideBar-name">
                          <span
                            className="name-meta"
                            style={{ fontWeight: "500" }}
                          >
                            {participant.participantName}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontWeight: "500" }}>
                    No available participants.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-sm-8 conversation" style={{ padding: "0" }}>
            {id ? (
              <>
                <div className="rowheading2">
                  <img
                    src={userImage}
                    style={{ width: "50px", height: "50px" }}
                  />
                  <p>{receiver?.receiverName}</p>
                </div>

                <div className="row-message" id="conversation" ref={chatBoxRef}>
                  {chatHistory.map((message) => (
                    <div
                      key={message.messageId}
                      className={
                        message.senderId === userId
                          ? "sent-message"
                          : "received-message"
                      }
                    >
                      {message.receiveId == userId ? (
                        <img
                          src={userImage}
                          style={{
                            width: "40px",
                            height: "40px",
                            marginLeft: "20px",
                          }}
                          alt="User"
                        />
                      ) : (
                        <img
                          src={userImage}
                          style={{
                            width: "40px",
                            height: "40px",
                            opacity: "0%",
                          }}
                          alt="Receiver"
                        />
                      )}
                      <div className="message-content">
                        <div
                          className={
                            message.receiveId == userId
                              ? "receive-message"
                              : "send-message"
                          }
                        >
                          {message.chatText}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="row reply" style={{ marginBottom: "10px" }}>
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
              <p
                style={{
                  fontWeight: "500",
                  height: "80vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                You haven't selected a chat yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import User from "../public/userImg-removebg-preview.png";
import axios from "axios";
import ChatMessage from "../components/ChatMessage";
import ReceiveChat from "../components/ReceiveChat";
const socket = io.connect("http://localhost:3030");
const Chat = () => {
  const [message, setMessage] = useState("");
  const storedUser = localStorage.getItem("user");
  const { data } = JSON.parse(storedUser);
  const id = data.userId;
  const [isReceivedMessage, setReceivedMessage] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [getMessages, setGetMessages] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [status, setStatus] = useState(false);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [getMessages?.messages]);
  let ReciverId;
  const sendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;
    socket.emit("sendMessage", {
      conversationId: conversationId,
      senderId: id,
      receiverId: receiverId,
      message: message,
    });

    if (conversationId && receiverId) {
      axios
        .post("http://localhost:3030/messages", {
          conversationId: conversationId,
          senderId: id,
          receiverId: receiverId,
          message: message,
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
    setMessage("");
  };

  const handleSelectConversation = (data) => {
    setReceiverId(data.receiverId);

    setConversationId(data.conversationId);
    setStatus(false);
    if (data.status === true) {
      setStatus(true);
    }
  };
  const fetchConversation = () => {
    axios
      .get(`http://localhost:3030/conversation/${data.userId}`)
      .then((res) => {
        setReceiverId(res.data.receiverId);
        setConversationId(res.data.conversationId);
        setConversation(res.data);
      })
      .catch((err) => console.log(err));
  };
  const fetchMessages = (conversationId, fullName) => {
    // console.log(receiverId);
    axios
      .get(`http://localhost:3030/messages/${conversationId}`, {
        headers: {
          senderId: id,
          receiverId: ReciverId,
        },
      })
      .then((res) => {
        setGetMessages({
          messages: res.data,
          receiverName: fullName,
          conversationId: conversationId,
          userStatus: status,
        });
      })
      .catch((err) => console.log(err));
  };
  const handleSelectUser = (data) => {
    if (getMessages.userStatus === true) {
      setStatus(true);
    }
    setStatus(false);
    setReceiverId(data.userId);
    setConversationId("new");
    setTimeout(() => {
      fetchMessages(data.conversationId, data.fullName);
    }, 0);
  };
  const getAllUsers = () => {
    axios
      .get(`http://localhost:3030/users/${id}`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchConversation();
    getAllUsers();
  }, []);
  useEffect(() => {
    socket.emit("addUser", id);

    socket.on("getMessage", (data) => {
      if (data.conversationId === conversationId) {
        setGetMessages((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              user: { userId: data.senderId },
              message: data.message,
              createdAt: new Date().toISOString(),
              receiverId: data.receiverId,
            },
          ],
        }));
      }
    });

    return () => {
      socket.off("getMessage");
    };
  }, [id, conversationId, socket]);

  return (
    <>
      <section id="inbox ">
        <div className=" h-[100vh] rounded-lg dark:border-gray-700">
          <div className="flex ">
            <div className="w-[30%] pl-[1%] border-x bg-sky-100">
              <h1 className="text-3xl py-3 pl-4 mt-4">QuikChat</h1>
              <span className=" flex items-center px-4 py-2 gap-3">
                <div className="w-[14%] border-2 border-green-600 rounded-full p-1 ">
                  <img src={User} alt="" />
                </div>
                <div>
                  <p className="text-xl font-semibold">{data.fullName}</p>
                  <p>My Account</p>
                </div>
              </span>
              <div className=" mx-4 my-2 p-2 border rounded-xl bg-white ">
                <input type="text" placeholder="search" />
              </div>
              <div className="flex gap-3 mx-4 my-2 ">
                <button className="border px-2 py-1 bg-gray-300 rounded-full">
                  All
                </button>
                <button className="border px-2 py-1 bg-gray-300 rounded-full">
                  Unread
                </button>
                <button className="border px-2 py-1 bg-gray-300 rounded-full">
                  Groups
                </button>
              </div>
              <div className="overflow-y-auto h-[65%]">
                {conversation?.map((data, i) => {
                  return (
                    <div
                      key={i}
                      className="border-b cursor-pointer flex items-center mx-4 p-2 gap-3"
                      onClick={() => {
                        fetchMessages(data.conversationId, data.fullName);
                        handleSelectConversation(data);
                      }}
                    >
                      <div
                        className={`w-[12%] border-2 rounded-full p-1  ${
                          data.status ? "border-green-600" : "border-slate-400"
                        }`}
                      >
                        <img src={User} alt="" />
                      </div>
                      <div className="flex w-full justify-between gap-4">
                        <div>{data.fullName}</div>
                      </div>
                    </div>
                  );
                })}

                {users?.map((data) => {
                  return (
                    <div
                      className="  border-b cursor-pointer flex items-center mx-4 p-2 gap-3"
                      onClick={() => {
                        handleSelectUser(data);
                        ReciverId = data.userId;
                      }}
                    >
                      <div
                        className={`w-[12%] border-2 rounded-full p-1  ${
                          data.status ? "border-green-600" : "border-slate-400"
                        }`}
                      >
                        <img src={User} alt="" />
                      </div>
                      <div className="flex w-full justify-between gap-4">
                        <div>{data.fullName}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-[70%] h-[100vh] relative">
              {getMessages.receiverName && (
                <span className="flex items-center py-2 gap-3 ml-[5%] mt-[2%]">
                  <div className="w-[5%]">
                    <img src={User} alt="" />
                  </div>
                  <div>
                    <p className="text-xl">{getMessages.receiverName}</p>
                    {status ? (
                      <p className="text-green-600">Online</p>
                    ) : (
                      <p className="text-gray-400">Offline</p>
                    )}
                  </div>
                </span>
              )}

              <div className="h-[80%] overflow-y-scroll pr-4 pb-5">
                {getMessages?.messages?.length > 0 ? (
                  getMessages?.messages.map((data, index) => {
                    if (data.user.userId === id) {
                      return (
                        <ReceiveChat
                          key={index}
                          message={data.message}
                          createdAt={data.createdAt}
                          name={getMessages.fullName}
                        />
                      );
                    } else {
                      return (
                        <ChatMessage
                          key={index}
                          message={data.message}
                          createdAt={data.createdAt}
                        />
                      );
                    }
                  })
                ) : (
                  <div className="flex justify-center mt-[30%] text-lg font-semibold">
                    No conversation
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                className="flex w-[90%] absolute bottom-6 left-0 right-0 mx-auto"
                onSubmit={sendMessage}
              >
                <input
                  id="Input"
                  className="border-2 border-sky-300 w-[87%] p-3 mx-[2%] rounded-xl outline-none"
                  type="text"
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="type here"
                />
                <button type="submit" className="rounded-full px-4 bg-sky-500">
                  <FontAwesomeIcon icon={faCaretRight} size="2xl" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Chat;

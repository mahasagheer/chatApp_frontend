import React, { useEffect, useState } from "react";
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

  const sendMessage = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3030/messages", {
        conversationId: conversationId,
        senderId: id,
        receiverId: receiverId,
        message: message,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  const fetchConversation = () => {
    axios
      .get(`http://localhost:3030/conversation/${data.userId}`)
      .then((res) => {
        setReceiverId(res.data.receiverId);
        setConversationId(res.data.conversationId);
        setConversation([res.data]);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchConversation();
  }, []);
  const fetchMessages = (conversationId, fullName) => {
    axios
      .get(`http://localhost:3030/messages/${conversationId}`)
      .then((res) => {
        console.log(res);
        setGetMessages({
          messages: res.data,
          receiverName: fullName,
          conversationId: conversationId,
        });
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setReceivedMessage((prevMessages) => [...prevMessages, data.message]);
    };
    socket.on("receivedMessage", handleReceiveMessage);
    return () => {
      socket.off("receivedMessage", handleReceiveMessage);
    };
  }, []);
  return (
    <>
      <section id="inbox">
        <div className="p-4 h-[100vh] px-[5%] rounded-lg dark:border-gray-700">
          <div className="flex ">
            <div className="w-[30%] border-x ">
              <h1 className="text-3xl py-3 pl-4">Chat</h1>
              <span className=" flex items-center px-4 py-2 gap-3">
                <div className="w-[12%] ">
                  <img src={User} alt="" />
                </div>
                <div>
                  <p>{data.fullName}</p>
                  <p>My Account</p>
                </div>
              </span>
              <div className=" mx-4 my-2 p-2 border rounded-xl  ">
                <input type="text" name="" id="" placeholder="search" />
              </div>
              <div className="flex gap-3 mx-4 my-2 ">
                <button className="border px-2 py-1 bg-gray-400 rounded-full">
                  All
                </button>
                <button className="border px-2 py-1 bg-gray-400 rounded-full">
                  Unread
                </button>
                <button className="border px-2 py-1 bg-gray-400 rounded-full">
                  Groups
                </button>
              </div>
              {conversation?.map((data) => {
                return (
                  <div
                    className="  border-b cursor-pointer flex items-center mx-4 p-2 gap-3"
                    onClick={() =>
                      fetchMessages(data.conversationId, data.fullName)
                    }
                  >
                    <div className="w-[12%] ">
                      <span
                        className={`absolute w-[1%] h-[2%] translate-x-6 rounded-full ${
                          data.status ? "bg-green-600" : "bg-slate-500"
                        }`}
                      ></span>
                      <img src={User} alt="" />
                    </div>
                    <div className="flex w-full justify-between gap-4">
                      <div>{data.fullName}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-[70%] h-[94vh] relative">
              {/* Chat Header */}
              {getMessages.receiverName && (
                <span className="flex items-center py-2 gap-3 ml-[5%]">
                  <div className="w-[5%]">
                    <img src={User} alt="" />
                  </div>
                  <div>{getMessages.receiverName}</div>
                </span>
              )}

              {/* Scrollable Chat Messages */}
              <div className="h-[80%] overflow-y-auto pr-4">
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
              </div>

              <form
                className="flex w-[90%] absolute bottom-6 left-0 right-0 mx-auto"
                onSubmit={sendMessage}
              >
                <input
                  id="Input"
                  className="border w-[87%] p-3 mx-[2%] rounded-xl outline-none"
                  type="text"
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="type here"
                />
                <button type="submit" className="rounded-full px-4 bg-sky-500">
                  <FontAwesomeIcon icon={faCaretRight} size="2xl" />
                </button>
              </form>
            </div>

            {/* </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Chat;

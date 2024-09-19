import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import User from "../public/userImg-removebg-preview.png";
const socket = io.connect("http://localhost:3030");
let status;
socket.on("userConnected", (user) => {
  console.log("User connected:", user);
  status = user.status;
  document.getElementById("username").innerText = `${user.fullName}`;
  document.getElementById("email").innerText = `${user.email}`;
});
let unread;
socket.on("unRead", (data) => {
  document.getElementById("unread").innerText = `${data.length}`;

  console.log(`You have ${data.length} unread messages`);
  console.log(data[0].content.body);
  const parent = document.getElementById("messageContainer");
  data.forEach((msg) => {
    parent.insertAdjacentHTML(
      "beforeend",
      `<div className="mx-[2%] mt-[2%] my-4 ">
       <span className="bg-gray-400 py-2 px-4 rounded-lg">
      ${msg.content.body}
      </span>
      </div>`
    );
  });
});
const Chat = () => {
  const [message, setMessage] = useState("");

  const [isReceivedMessage, setReceivedMessage] = useState([]);
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("sendMessage", { message: message });
    document.getElementById("Input").value = "";
  };
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setReceivedMessage((prevMessages) => [...prevMessages, data.message]);
    };
    socket.on("receivedMessage", handleReceiveMessage);
    return () => {
      socket.off("receivedMessage", handleReceiveMessage);
    };
  }, [status]);
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  console.log(unread);
  return (
    <>
      <section id="inbox">
        <div className="p-4 h-[100vh] px-[5%] rounded-lg dark:border-gray-700">
          <div className="flex ">
            <div className="w-[30%] border-x ">
              <h1 className="text-3xl py-3 pl-4">Chat</h1>
              <span className=" flex items-center px-4 py-2 gap-3">
                <div className="w-[12%] ">
                  <span
                    className={`absolute w-[1%] h-[2%] translate-x-8 rounded-full ${
                      status === true ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                  <img src={User} alt="" />
                </div>
                <div id="username"></div>
                <div
                  id="unread"
                  className="bg-green-500 ml-[60%] text-white text-sm p-1 rounded-full px-2.5"
                ></div>
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
              <div className="  border-b  flex items-center mx-4 p-2 gap-3">
                <div className="w-[12%] ">
                  <span className="absolute w-[1%] h-[2%] bg-gray-500 translate-x-6 rounded-full"></span>
                  <img src={User} alt="" />
                </div>
                <div className="flex w-full justify-between gap-4">
                  <div>Jon</div>
                  <div className="bg-slate-500  text-sm p-1 rounded-full px-2.5">
                    2
                  </div>
                </div>
              </div>
              <div className="  border-b  flex items-center mx-4 p-2 gap-3">
                <div className="w-[12%] ">
                  <span className="absolute w-[1%] h-[2%] bg-gray-500 translate-x-6 rounded-full"></span>
                  <img src={User} alt="" />
                </div>
                <div className="flex w-full justify-between gap-4">
                  <div>Henry</div>
                  <div className="bg-slate-500 p-1 text-sm rounded-full px-2.5">
                    2
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[70%] h-[94vh]">
              <span className=" flex items-center px-4 py-2 gap-3">
                <div className="w-[5%]">
                  <img src={User} alt="" />
                </div>
                <div id="email"></div>
              </span>
              {isReceivedMessage.map((data) => {
                return (
                  <>
                    <div id="messageContainer">
                      <div className="mx-[2%] mt-[2%] my-4 ">
                        <span className="bg-gray-400 py-2 px-4 rounded-lg">
                          {data}
                        </span>
                      </div>
                    </div>
                    {/* <div className="mx-[2%] mt-[2%]">
                        <span className="bg-gray-400 py-2 px-4 absolute right-8 rounded-lg">
                          hello
                        </span>
                      </div> */}
                  </>
                );
              })}
              <form
                className="flex w-[57%] absolute bottom-6"
                onSubmit={sendMessage}
              >
                <input
                  id="Input"
                  className="border w-[87%] p-3 mx-[2%] rounded-xl outline-none"
                  type="text"
                  onChange={handleChange}
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

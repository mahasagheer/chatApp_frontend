import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faPhoneSlash,
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
const VoiceCallingPeer = (props) => {
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isModal, setModal] = useState(false);
  const handleModal = () => {
    setModal(true);
  };
  const socketId = props.socketId;
  const receiverDetail = props.receiver;
  console.log(socketId);
  console.log(receiverDetail);
  return (
    <>
      {" "}
      <button
        className="rounded-3xl w-10 hover:bg-white "
        onClick={() => {
          handleModal();
        }}
      >
        <FontAwesomeIcon icon={faPhone} size="lg" />
      </button>
      {isModal &&
        createPortal(
          <div className="fixed bottom-0 top-0 left-0 right-0  	 z-20">
            <div className="fixed bg-white border-2 bottom-[2%] left-[2%]  w-[25%] h-[35%] flex flex-col justify-center items-center  p-10  z-20">
              <div className="text-3xl mt-4">{receiverDetail.fullName}</div>
              <div className="">
                <img
                  src={`http://localhost:3030//uploads/${receiverDetail.profilePic}`}
                  alt=""
                  className="rounded-full w-20"
                />
              </div>
              <div className="flex gap-5 justify-center">
                <div>
                  {inCall ? (
                    <p className="text-center">Ringing...</p>
                  ) : (
                    <p className="text-center">Calling...</p>
                  )}
                  <div className="flex gap-3 rounded-full py-2">
                    {/* <button className="p-2 bg-slate-400 py-2 rounded-full">
                      {isMuted ? (
                        <FontAwesomeIcon icon={faMicrophoneSlash} size="lg" />
                      ) : (
                        <FontAwesomeIcon icon={faMicrophone} size="lg" />
                      )}
                    </button> */}
                    <button
                      onClick={() => {
                        setModal(false);
                      }}
                      className="p-2 bg-red-600 rounded-full "
                    >
                      <FontAwesomeIcon icon={faPhoneSlash} size="lg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default VoiceCallingPeer;

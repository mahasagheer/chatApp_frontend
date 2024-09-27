import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faPhoneSlash,
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import { createPortal } from "react-dom";

const socket = io.connect("http://localhost:3030", {
  transports: ["websocket"],
  upgrade: false,
});

const VoiceCall = (props) => {
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioTrack, setAudioTrack] = useState(null);

  const handleMuteUnmute = () => {
    if (!audioTrack) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          setInCall(true);

          const recorder = new MediaRecorder(stream);
          const track = stream.getAudioTracks()[0];
          setAudioTrack(track);
          setMediaRecorder(recorder);

          recorder.addEventListener("dataavailable", (event) => {
            const audioBlob = event.data;
            const fileReader = new FileReader();
            fileReader.readAsDataURL(audioBlob);
            fileReader.onloadend = () => {
              const base64String = fileReader.result;
              console.log(base64String);
              socket.emit("audioStream", base64String);
            };
          });

          recorder.start(100);
        })
        .catch((error) => {
          console.error("Error capturing audio:", error);
        });
    } else {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!isMuted);
    }
  };
  const [isModal, setModal] = useState(false);
  const handleModal = () => {
    setModal(true);
  };
  const handleEndCall = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setInCall(false);
      setMediaRecorder(null);
      setAudioTrack(null);
    }
    socket.emit("endCall");
  };
  useEffect(() => {
    socket.on("audioStream", (audioData) => {
      const audioUrl =
        audioData.split(";")[0] + ";base64," + audioData.split(",")[1];
      const audio = new Audio(audioUrl);
      if (!document.hidden) {
        audio.play();
      }
    });

    return () => {
      socket.off("audioStream");
    };
  }, [socket]);

  return (
    <>
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
              <div className="text-3xl mt-4">{props.name}</div>
              <div className="">
                <img
                  src={`http://localhost:3030//uploads/${props.profile}`}
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
                    <button
                      onClick={handleMuteUnmute}
                      className="p-2 bg-slate-400 py-2 rounded-full"
                    >
                      {isMuted ? (
                        <FontAwesomeIcon icon={faMicrophone} size="lg" />
                      ) : (
                        <FontAwesomeIcon icon={faMicrophoneSlash} size="lg" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        handleEndCall();
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

export default VoiceCall;

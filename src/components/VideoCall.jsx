import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faPhoneSlash,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../provider/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../services/peer";

const VideoCall = (props) => {
  const socket = useSocket();
  const socketId = props.socketId;
  const receiverDetail = props.receiver;
  const [isModal, setModal] = useState(false);
  const storedUser = localStorage.getItem("user");
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const { data } = JSON.parse(storedUser);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState();
  console.log(data.email);
  const handleModal = useCallback(() => {
    socket.emit("join-room", { email: data.email, room: "1" });
    setModal(true);
  }, [socket]);

  const handleJoin = useCallback((data) => {
    const { email, room } = data;
    console.log(email, room);
  }, []);
  const handleUserJoin = useCallback(
    ({ email, id }) => {
      setRemoteSocketId(id);
    },
    [remoteSocketId]
  );
  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user-call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log("Incoming call", from, offer);
      const answer = await peer.getAnswer(offer);
      socket.emit("call-accepted", { to: from, answer });
    },
    [socket]
  );
  const sentStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);
  const handleCallAccepted = useCallback(
    async ({ from, answer }) => {
      await peer.setLocalDescription(answer);
      console.log("call Accepted");
      sentStreams();
    },
    [sentStreams]
  );
  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
    };
  }, [handleNegotiationNeeded]);
  const handleNegotiationNeededIncoming = useCallback(
    async ({ from, offer }) => {
      console.log("negotiation needed for incoming", from, offer);
      const answer = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, answer });
    },
    [socket]
  );
  const handleNegotiationFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams[0];
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream);
    });
  }, []);

  useEffect(() => {
    socket.on("join-room", handleJoin);
    socket.on("user-joined", handleUserJoin);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegotiationNeededIncoming);
    socket.on("peer:nego:final", handleNegotiationFinal);
    return () => {
      socket.off("join-room", handleJoin);
      socket.off("user-join", handleUserJoin);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("peer:nego:final", handleNegotiationFinal);
      socket.off("peer:nego:needed", handleNegotiationNeededIncoming);
    };
  }, [
    socket,
    handleJoin,
    handleUserJoin,
    handleIncomingCall,
    handleJoin,
    handleCallAccepted,
    handleNegotiationFinal,
  ]);
  console.log(remoteStream);
  return (
    <>
      <button className="rounded-3xl w-10 hover:bg-white" onClick={handleModal}>
        <FontAwesomeIcon icon={faVideo} size="lg" />
      </button>
      {isModal &&
        createPortal(
          <div className="fixed bottom-0 top-0 left-0 right-0 z-20 bg-black">
            <div className="fixed w-[100%] h-[90vh] flex flex-row">
              <div className="w-[50%] flex flex-col justify-end items-center  p-4">
                {remoteStream && (
                  <>
                    <h1 className="text-white">Remote Stream</h1>
                    <video
                      autoPlay
                      playsInline
                      ref={(videoElement) => {
                        if (videoElement) {
                          videoElement.srcObject = remoteStream;
                        }
                      }}
                      height="100vh"
                      width="600px"
                    />
                  </>
                )}
                <p className="text-xl mt-4 text-white">
                  {receiverDetail.fullName}
                </p>
                <img
                  src={`http://localhost:3030/uploads/${receiverDetail.profilePic}`}
                  alt=""
                  className="rounded-full w-20"
                />
              </div>
              <div className="w-[50%] flex flex-col justify-end items-center p-4">
                {myStream && (
                  <>
                    <video
                      autoPlay
                      muted
                      playsInline
                      ref={(videoElement) => {
                        if (videoElement) {
                          videoElement.srcObject = myStream;
                        }
                      }}
                      height="100vh"
                      width="600px"
                    />
                  </>
                )}
                <p className="text-xl mt-4 text-white">{data.fullName}</p>
                <img
                  src={`http://localhost:3030/uploads/${data.profilePic}`}
                  alt=""
                  className="rounded-full w-20"
                />
              </div>
            </div>
            <div className="absolute bottom-0  w-full h-[10vh]  z-20 bg-black px-[10%]">
              <div>{remoteSocketId ? "Ringing..." : "Calling..."}</div>
              <div className=" flex justify-center items-center gap-5">
                {myStream && (
                  <button
                    onClick={sentStreams}
                    className={`p-2 bg-white rounded-full px-3 ${
                      myStream
                        ? "bg-white text-black"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    <FontAwesomeIcon icon={faMicrophone} size="lg" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setModal(false);
                  }}
                  className="p-2 bg-red-600 rounded-full"
                >
                  <FontAwesomeIcon icon={faPhoneSlash} size="lg" />
                </button>
                {remoteSocketId && (
                  <button
                    onClick={handleCallUser}
                    className={` p-2 rounded-full ${
                      myStream
                        ? "bg-white text-black"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    <FontAwesomeIcon icon={faVideo} size="lg" />
                  </button>
                )}
              </div>
              {/* <div className="text-white">123</div> */}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default VideoCall;

import React, { createContext, useMemo } from "react";
import { useContext } from "react";
import { io } from "socket.io-client";
const SocketContext = createContext(null);
export const SocketProvider = (props) => {
  const socket = useMemo(
    () =>
      io.connect("http://localhost:3030", {
        transports: ["websocket"],
        upgrade: false,
      }),
    []
  );
  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

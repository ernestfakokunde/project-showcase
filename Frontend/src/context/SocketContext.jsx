import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token || !user?._id) {
      setSocket((currentSocket) => {
        currentSocket?.disconnect();
        return null;
      });
      setConnected(false);
      return undefined;
    }

    const nextSocket = io(import.meta.env.VITE_API_BASE_URL.replace('/api', ''), {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleConnectError = (error) => {
      console.error("Socket connection error:", error.message);
      setConnected(false);
    };

    nextSocket.on("connect", handleConnect);
    nextSocket.on("disconnect", handleDisconnect);
    nextSocket.on("connect_error", handleConnectError);

    setSocket(nextSocket);

    return () => {
      nextSocket.off("connect", handleConnect);
      nextSocket.off("disconnect", handleDisconnect);
      nextSocket.off("connect_error", handleConnectError);
      nextSocket.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [token, user?._id]);

  const value = useMemo(
    () => ({
      socket,
      connected,
    }),
    [socket, connected]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);

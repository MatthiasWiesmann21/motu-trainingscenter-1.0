"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = any;

const SocketContext = createContext<SocketContextType>({
  userSocket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [userSocket, setUserSocket] = useState<Socket | null>(null);
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userSocket) {
      const userNamespaceSocket = ClientIO(
        process.env.NEXT_PUBLIC_SITE_URL + "/userCount",
        {
          path: "/api/socket",
        }
      );
      setUserSocket(userNamespaceSocket);
    }

    if (!chatSocket) {
      const chatNamespaceSocket = ClientIO(
        process.env.NEXT_PUBLIC_SITE_URL + "/chat",
        {
          path: "/api/socket",
        }
      );
      setChatSocket(chatNamespaceSocket);
    }

    return () => {
      userSocket?.disconnect();
      chatSocket?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ userSocket, chatSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

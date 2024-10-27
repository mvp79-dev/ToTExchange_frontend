import React, {
  useMemo,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SocketEvent } from "./constants/socket";
import { KEY } from "./constants/request";
import io, { Socket } from "socket.io-client";

const IoContext = createContext<any>({
  socket: Socket,
  status: "disconnected",
  registerListener: () => () => {},
  unregisterListener: () => {},
});

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export const useSocket = () => useContext(IoContext)!;

export const SocketProvider: React.FC<{ children: any }> = ({ children }) => {
  const socket = useRef<any>(null);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const registerListener = useCallback(
    (forEvent: SocketEvent, callback: any) => {
      !!socket.current && socket.current.on(forEvent, callback);

      return () => {
        socket.current.off(forEvent);
      };
    },
    []
  );

  const unregisterListener = useCallback(
    (forEvent: SocketEvent, callback?: (...args: any[]) => any) => {
      !!socket.current && socket.current.off(forEvent);
    },
    []
  );

  const connectSocket = () => {
    const token = localStorage.getItem(KEY.ACCESS_TOKEN) || "";
    if (token) {
      socket.current = io(process.env.REACT_APP_SOCKET_URL!, {
        forceNew: true,
        autoConnect: true,
        reconnection: true,
        transports: ["websocket"],
        auth: {
          token,
        },
      });

      socket.current.on("connect", (data: any) => {
        setStatus("connected");
        console.info(
          `Successfully connected to socket at ${process.env.REACT_APP_SOCKET_URL}`
        );
      });

      socket.current.on("disconnect", (info: string) => {
        setStatus("disconnected");
        console.info(`Successfully disconnected reason: ${info}`);
      });

      socket.current.on("connect_error", (err: any) => {
        console.log("Socket Error:", { err });
      });
    }
  };

  const providedValue = useMemo(() => {
    return {
      socket: socket.current,
      status,
      registerListener,
      unregisterListener,
    };
  }, [registerListener, status, unregisterListener]);

  useEffect(() => {
    console.log("Socket connect");

    try {
      connectSocket();
    } catch (error) {
      setTimeout(() => {
        connectSocket();
      }, 2000);
    }

    return () => {
      if (socket.current?.connected) {
        socket.current.disconnect();
      }
    };
  }, []);

  return (
    <IoContext.Provider value={providedValue}>{children}</IoContext.Provider>
  );
};

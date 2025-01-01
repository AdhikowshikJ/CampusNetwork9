import { useState, useEffect } from "react";
import io from "socket.io-client";
import useAuthStore from "../components/Store/authStore";

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    // Initialize socket connection only if user exists
    if (!user?._id) return;

    const newSocket = io(`${import.meta.env.VITE_API_BASE_URL}`, {
      transports: ["websocket"], // Specify the transport method (WebSocket)
    });

    setSocket(newSocket);

    // Emit 'new-user-add' after socket connection is established
    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      newSocket.emit("new-user-add", user._id);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]); // Include user._id in the dependency array

  return { socket };
};

export default useSocket;

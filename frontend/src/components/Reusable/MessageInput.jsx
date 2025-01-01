// MessageInput.js (updated)
import React, { useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import useAuthStore from "../Store/authStore";
import useSocket from "../../hooks/useSocket";

const MessageInput = ({
  activeChat,
  messageInput,
  setMessageInput,
  setMessages,
  receiverId,
}) => {
  const { user } = useAuthStore();
  const { socket } = useSocket();
  const messageInputRef = useRef(null);

  const handleSendMessage = async () => {
    if (messageInput.trim() && activeChat) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/message`,
          {
            chatId: activeChat,
            senderId: user._id,
            text: messageInput,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setMessageInput("");
        socket.emit("send-message", {
          senderId: user._id,
          receiverId: receiverId,
          text: messageInput,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [activeChat]);

  return (
    <div className="p-4 border-t border-gray-700 fixed bottom-0 left-0 right-0 bg-black z-10 sm:relative">
      <div className="flex items-center max-w-6xl md:mx-auto">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 rounded-full w-4 md:w-full px-4 py-2 focus:outline-none"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          ref={messageInputRef}
        />
        <button
          className="ml-2 text-blue-500 hover:text-blue-400 md:static flex-shrink-0"
          onClick={handleSendMessage}
        >
          <PaperAirplaneIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;

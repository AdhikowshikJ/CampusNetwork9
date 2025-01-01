import React, { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import MessageInput from "./MessageInput";
import useAuthStore from "../Store/authStore";
import axios from "axios";
import Loader from "./Loader";

const ChatArea = ({
  activeChat,
  messages,
  setMessages,
  messageInput,
  setMessageInput,
  setActiveChat,
  receiverId,
  reciever,
  setReciever,
}) => {
  const { user } = useAuthStore();
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (activeChat) {
      fetchMessages();
      setLoading(true); // Start loading
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/message/${activeChat}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setMessages(response.data);
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false); // Stop loading even on error
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (
    loading ||
    ((activeChat === null || activeChat === undefined) && !receiverId) ||
    !messages
  ) {
    <Loader bool={activeChat} />;
  }

  return (
    <div
      className={`flex-1 h-full overflow-hidden ${
        activeChat ? "flex flex-col" : "hidden sm:flex flex-col"
      }`}
    >
      {activeChat ? (
        <>
          <div className="p-4 border-b border-gray-700 flex gap-2 items-center fixed top-0 left-0 right-0 bg-black z-10 sm:relative">
            <button
              className="text-blue-500 hover:text-blue-400 sm:hidden"
              onClick={() => setActiveChat(null)}
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            {!loading && (
              <>
                <img
                  src={
                    reciever?.profileImage ||
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                  }
                  alt={reciever?.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <h2 className="text-lg font-bold">{reciever?.username}</h2>
              </>
            )}
            <div className="w-6 sm:hidden"></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-16 mb-20 sm:my-0">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.senderId === user._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.senderId === user._id
                      ? "bg-blue-500"
                      : "bg-gray-700"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {message.createdAt}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <MessageInput
            activeChat={activeChat}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            setMessages={setMessages}
            receiverId={receiverId}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">
            Select a conversation to start messaging
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatArea;

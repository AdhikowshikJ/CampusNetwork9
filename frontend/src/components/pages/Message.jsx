import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatArea from "../Reusable/ChatArea";
import ConversationList from "../Reusable/CoversationList";
import useSocket from "../../hooks/useSocket";
import useGetChatList from "../../hooks/useGetChatList";
import useAuthStore from "../Store/authStore";

const Message = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [receiverId, setReceiverId] = useState(null); // New state for receiver ID
  const [messageInput, setMessageInput] = useState("");
  const [reciever, setReciever] = useState(null);
  const [messages, setMessages] = useState([]);
  const { initialChats, conversations, getInitialChats, getConversations } =
    useGetChatList();
  const { socket } = useSocket();
  const { user } = useAuthStore();

  useEffect(() => {
    getInitialChats();
    getConversations();
  }, [getInitialChats, getConversations]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages();
      // Determine the receiver ID based on the active chat
      const chat = conversations.find((convo) => convo._id === activeChat);
      if (chat) {
        const [member1, member2] = chat.members;
        setReceiverId(member1._id === user._id ? member2._id : member1._id);
        setReciever(member1._id === user._id ? member2 : member1);
      }
    }
  }, [activeChat, conversations, user?._id, reciever]);

  useEffect(() => {
    if (socket) {
      socket.emit("new-chat-user-add", user?._id);

      socket.on("recieve-message", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
  }, [socket, user?._id]);

  const fetchMessages = async () => {
    if (!activeChat) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/message/${activeChat}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-black text-white h-screen overflow-y-hidden flex flex-col sm:flex-row">
      <ConversationList
        initialChats={initialChats}
        conversations={conversations}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        getConversations={getConversations}
        receiverId={receiverId}
        setReceiverId={setReceiverId}
        // Pass receiver ID to ChatArea
        reciever={reciever}
        setReciever={setReciever}
      />
      <ChatArea
        activeChat={activeChat}
        messages={messages}
        setMessages={setMessages}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        setActiveChat={setActiveChat}
        receiverId={receiverId}
        setReceiverId={setReceiverId}
        // Pass receiver ID to ChatArea
        reciever={reciever}
        setReciever={setReciever}
      />
    </div>
  );
};

export default Message;

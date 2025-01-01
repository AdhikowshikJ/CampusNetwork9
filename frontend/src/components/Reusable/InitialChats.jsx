import React from "react";
import axios from "axios";
import useAuthStore from "../Store/authStore";

const InitialChats = ({
  initialChats = [],
  setActiveChat,
  getConversations,
}) => {
  const { user } = useAuthStore();

  const handleInitialChatClick = async (chatPartner) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat`,
        {
          senderId: user._id,
          receiverId: chatPartner._id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setActiveChat(response.data._id);
      getConversations(); // Refresh the conversations list
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Start a new chat</h3>
      {initialChats.map((chatPartner) => (
        <div
          key={chatPartner._id}
          className="flex items-center p-4 hover:bg-gray-900 cursor-pointer"
          onClick={() => handleInitialChatClick(chatPartner)}
        >
          <img
            src={chatPartner.profileImage}
            alt={chatPartner.username}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h4 className="font-semibold">{chatPartner.username}</h4>
            <p className="text-gray-400 text-sm">Start new chat</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InitialChats;

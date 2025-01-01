// useGetChatList.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useAuthStore from "../components/Store/authStore";

const useGetChatList = () => {
  const [initialChats, setInitialChats] = useState([]);
  const [conversations, setConversations] = useState([]);
  const { user } = useAuthStore();

  const getInitialChats = useCallback(async () => {
    if (!user?._id) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/chat/mutualFollowers/${user._id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setInitialChats(response.data.mutualFollowers);
    } catch (error) {
      console.error("Error fetching mutual followers:", error);
    }
  }, [user?._id]);

  const getConversations = useCallback(async () => {
    if (!user?._id) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/chat/${user._id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [user?._id]);

  useEffect(() => {
    getInitialChats();
    getConversations();
  }, [getInitialChats, getConversations]);

  return { initialChats, conversations, getInitialChats, getConversations };
};

export default useGetChatList;

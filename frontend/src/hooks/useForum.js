import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../components/Store/authStore";
import useSocket from "./useSocket";
const useForum = () => {
  const [forumTopics, setForumTopics] = useState([]);
  const [error, setError] = useState(null);
  const { user, token } = useAuthStore();
  const { socket } = useSocket();

  useEffect(() => {
    const fetchForumTopics = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/forum-topics`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setForumTopics(response.data.topics || []);
      } catch (error) {
        console.error("Error fetching forum topics:", error);
        setError("Failed to fetch forum topics. Please try again later.");
      }
    };

    if (token) {
      fetchForumTopics();
    }
  }, [token]);

  const addForumTopic = async (newTopic) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/forum-topics`,
        { ...newTopic, postedBy: user._id },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setForumTopics((prevTopics) => [response.data.topic, ...prevTopics]);
    } catch (error) {
      console.error("Error adding forum topic:", error);
      throw error;
    }
  };

  const addReply = async (topicId, content, topicPostedBy) => {
    try {
      console.log(topicId);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/forum-topics/${topicId}/replies`,
        { content, postedBy: user._id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const responsee = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/notification/create`,
        {
          sender: user?._id,
          receiver: topicPostedBy,
          type: "forum",
          post: topicId,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (socket) {
        socket.emit("notification", {
          sender: user,
          receiver: topicPostedBy,
          type: "forum",
          post: topicId,
        });
      }
      setForumTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic._id === topicId
            ? { ...topic, replies: [...topic.replies, response.data.reply] }
            : topic
        )
      );
    } catch (error) {
      console.error("Error adding reply:", error);
      throw error;
    }
  };
  const handleLike = async (topicId, replyId = null) => {
    try {
      const endpoint = replyId
        ? `${
            import.meta.env.VITE_API_BASE_URL
          }/forum-topics/${topicId}/replies/${replyId}/like`
        : `${import.meta.env.VITE_API_BASE_URL}/forum-topics/${topicId}/like`;

      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setForumTopics((prevTopics) =>
        prevTopics.map((topic) => {
          if (topic._id === topicId) {
            if (replyId) {
              return {
                ...topic,
                replies: topic.replies.map((reply) =>
                  reply._id === replyId
                    ? { ...reply, likes: response.data.likes }
                    : reply
                ),
              };
            } else {
              return { ...topic, likes: response.data.likes };
            }
          }
          return topic;
        })
      );
    } catch (error) {
      console.error("Error handling like:", error);
      throw error;
    }
  };

  return { forumTopics, addForumTopic, addReply, handleLike, error, setError };
};

export default useForum;

import axios from "axios";
import React, { useEffect, useState } from "react";
import useAuthStore from "../components/Store/authStore";
import useSocket from "./useSocket";

const useComment = (postId) => {
  const [comments, setComments] = useState([]);
  const { user } = useAuthStore();
  const { socket } = useSocket();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/comments/${postId}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setComments(response.data.comments || []); // Ensure comments is always an array
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]); // Add postId as a dependency

  const addComment = async (content, post) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/comments/`,
        { content, postId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("hi");
      console.log(user?._id, "and postedBy", response.data.result.postedBy._id);

      const responsee = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/notification/create`,
        {
          sender: user?._id,
          receiver: post?.postedBy,
          type: "comment",
          post: post?._id,
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
          receiver: post?.postedBy,
          type: "comment",
          post: post?._id,
        });
      }
      setComments((prevComments) => [...prevComments, response.data.result]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return { comments, addComment };
};

export default useComment;

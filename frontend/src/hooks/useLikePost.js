import { useState, useEffect } from "react";
import axios from "axios";
import useSocket from "./useSocket";
import useAuthStore from "../components/Store/authStore";

const useLikePost = (postId, initialLikes = [], userId) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLikes.includes(userId));
  const { socket } = useSocket(); // Socket connection
  const { user } = useAuthStore();

  const likePost = async () => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/like`,
        { postId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/notification/create`,
        {
          sender: user?._id,
          receiver: data.postedBy,
          type: "like",
          post: data._id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      console.log(response);

      // Emit the "like" event to the server through the socket
      if (socket) {
        socket.emit("notification", {
          sender: user,
          receiver: data?.postedBy,
          type: "like",
          post: data?._id,
        });
      }

      // Update the likes state
      setLikes(data.likes);
      setLiked(true);
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };

  const unlikePost = async () => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/unlike`,
        { postId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setLikes(data.likes);
      setLiked(false);
    } catch (error) {
      console.error("Error unliking the post", error);
    }
  };

  return { likes, liked, likePost, unlikePost };
};

export default useLikePost;

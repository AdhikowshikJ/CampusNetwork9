import React from "react";
import useUserProfileStore from "../components/Store/userProfileStore";
import axios from "axios";
import useAuthStore from "../components/Store/authStore";
import useSocket from "./useSocket";

const useFollow = () => {
  const { userProfile, setUserProfile } = useUserProfileStore();
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const authUser = useAuthStore((state) => state.user);
  const { socket } = useSocket();

  React.useEffect(() => {
    if (userProfile && authUser) {
      console.log(userProfile.followers);
      const currentUserId = authUser._id;
      console.log(currentUserId);
      setIsFollowing(userProfile.followers.includes(currentUserId));
    }
  }, [userProfile]);

  const followUser = async () => {
    setIsFollowingLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `&{import.meta.env.VITE_API_BASE_URL}/follow/${userProfile._id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const responsee = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/notification/create`,
        {
          sender: authUser?._id,
          receiver: userProfile?._id,
          type: "follow",
          post: userProfile._id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (socket) {
        socket.emit("notification", {
          sender: authUser,
          receiver: userProfile,
          type: "follow",
          post: userProfile._id,
        });
      }
      console.log("Follow response:", response.data); // Log the response
      setUserProfile(response.data);
      setIsFollowing(true);
    } catch (error) {
      console.error(
        "Follow error:",
        error.response ? error.response.data : error.message
      );
      setError(error.response ? error.response.data.error : error.message);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const unfollowUser = async () => {
    setIsFollowingLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/unfollow/${userProfile._id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("Unfollow response:", response.data); // Log the response
      setUserProfile(response.data);
      setIsFollowing(false);
    } catch (error) {
      console.error(
        "Unfollow error:",
        error.response ? error.response.data : error.message
      );
      setError(error.response ? error.response.data.error : error.message);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  return { followUser, unfollowUser, isFollowing, isFollowingLoading, error };
};

export default useFollow;

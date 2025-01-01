import React, { useState, useEffect } from "react";
import { ArrowLeftIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import InitialChats from "./InitialChats";
import useAuthStore from "../Store/authStore";
import axios from "axios";
import Loader from "./Loader";

const ConversationList = ({
  initialChats,
  conversations = [],
  activeChat,
  setActiveChat,
  getConversations,
}) => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userChatExists, setUserChatExists] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setInitialLoading(true);
        await getConversations();
        setInitialLoading(false);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setInitialLoading(false);
      }
    };

    fetchConversations();
  }, [getConversations]);

  useEffect(() => {
    let timeoutId;

    if (search) {
      // Debounce the search to prevent too many API calls
      timeoutId = setTimeout(async () => {
        try {
          setSearchLoading(true);
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/chat/mutualFollowers/${
              user._id
            }`,
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
          const mutualFollowers = response.data.mutualFollowers;
          const filtered = mutualFollowers.filter((follower) =>
            follower.username.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredUsers(filtered);
          setSearchLoading(false);
        } catch (error) {
          console.error("Error fetching mutual followers:", error);
          setSearchLoading(false);
        }
      }, 300); // Wait 300ms after last keystroke before searching
    } else {
      setFilteredUsers([]);
    }

    return () => clearTimeout(timeoutId);
  }, [search, user?._id]);

  const handleUserClick = async (receiverId) => {
    try {
      let conversation = userChatExists[receiverId];
      if (!conversation) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/chat`,
          {
            senderId: user._id,
            receiverId,
          }
        );
        conversation = response.data;
        setUserChatExists((prev) => ({ ...prev, [receiverId]: conversation }));
      }
      setActiveChat(conversation._id);
      getConversations();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  if (initialLoading) {
    return <Loader bool={initialLoading} />;
  }

  return (
    <div
      className={`w-full sm:w-1/3 border-r border-gray-700 h-full ${
        activeChat ? "hidden sm:block" : "block"
      }`}
    >
      <div className="p-4 border-b border-gray-700 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <Link to="/" className="text-gray-400 hover:text-white">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <h2 className="text-xl font-bold">Messages</h2>
          <button className="text-[#ae00ff] hover:text-[#d885fe]">
            <PencilSquareIcon className="w-6 h-6" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="p-2 mb-2 w-full border border-gray-700 bg-gray-800 text-white rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="relative">
        {searchLoading && (
          <div className="absolute top-0 right-4 mt-2">
            <Loader bool={searchLoading} size="small" />
          </div>
        )}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`flex items-center p-4 hover:bg-gray-900 cursor-pointer ${
                activeChat === user._id ? "bg-gray-800" : ""
              }`}
              onClick={() => handleUserClick(user._id)}
            >
              <img
                src={
                  user.profileImage ||
                  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                }
                alt={user.username}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold">{user.username}</h3>
                <p className="text-gray-400 text-sm">Start chat</p>
              </div>
            </div>
          ))
        ) : conversations.length > 0 ? (
          conversations.map((convo) => {
            const [member1, member2] = convo.members || [];
            const partner = member1?._id === user._id ? member2 : member1;

            return (
              <div
                key={convo._id}
                className={`flex items-center p-4 hover:bg-gray-900 cursor-pointer ${
                  activeChat === convo._id ? "bg-gray-800" : ""
                }`}
                onClick={() => setActiveChat(convo._id)}
              >
                <img
                  src={
                    partner?.profileImage ||
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                  }
                  alt={partner?.username || "User"}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold">
                    {partner?.username || "Unknown"}
                  </h3>
                  <p className="text-gray-400 text-sm">Open chat</p>
                </div>
              </div>
            );
          })
        ) : (
          <InitialChats
            initialChats={initialChats}
            setActiveChat={setActiveChat}
            getConversations={getConversations}
          />
        )}
      </div>
    </div>
  );
};

export default ConversationList;

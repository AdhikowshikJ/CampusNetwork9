import React, { useEffect, useState } from "react";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  InboxIcon,
} from "@heroicons/react/24/solid";
import useSocket from "../../hooks/useSocket";
import useAuthStore from "../Store/authStore";
import axios from "axios";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const tabs = ["All", "Follows", "Likes", "Comments", "Forum"];
  const { socket } = useSocket();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notification/`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const { unreadNotifications = [], readNotifications = [] } =
        response.data;
      setNotifications([...unreadNotifications, ...readNotifications]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/notification/read`,
        { notificationId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setNotifications(
        notifications.map((notification) => {
          if (notification._id === notificationId) {
            return { ...notification, isRead: true };
          }
          return notification;
        })
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("receive-notification", (data) => {
        console.log("Notification received:", data);
        setNotifications((prevNotifications) => [
          {
            post: data.post,
            reciever: data.reciever?._id,
            sender: data?.sender,
            type: data.type,
            _id: data.post,
          },
          ...prevNotifications,
        ]);
      });
    }

    return () => {
      if (socket) {
        socket.off("receive-notification");
      }
    };
  }, [socket]);

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <HeartIcon className="w-5 h-5 text-red-500" />;
      case "comment":
        return <ChatBubbleLeftIcon className="w-5 h-5 text-blue-500" />;
      case "follow":
        return <UserPlusIcon className="w-5 h-5 text-green-500" />;
      case "forum":
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "All") return true;
    return (
      notification.type.toLowerCase() === activeTab.toLowerCase().slice(0, -1)
    );
  });

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <InboxIcon className="w-16 h-16 text-gray-600 mb-4" />
      <h3 className="text-lg font-medium text-gray-300 mb-2">
        No notifications yet
      </h3>
      <p className="text-gray-500 text-center max-w-sm">
        When you get notifications, they'll show up here.
      </p>
    </div>
  );

  const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-black text-white min-h-screen">
      <div className="sticky top-0 bg-black z-10">
        <h1 className="text-xl font-bold p-4">Notifications</h1>
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 px-4 focus:outline-none ${
                activeTab === tab ? "border-b-2 border-purple-700" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-700">
        {isLoading ? (
          <LoadingState />
        ) : filteredNotifications.length === 0 ? (
          <EmptyState />
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex items-start p-4 hover:bg-gray-900 transition-colors duration-200 ${
                !notification.isRead ? "bg-gray-900" : ""
              }`}
              onClick={() => markAsRead(notification._id)}
            >
              <Link to={`/${notification.sender.username}`}>
                <img
                  src={notification.sender.profileImage}
                  alt={notification.sender.username}
                  className="w-12 h-12 rounded-full mr-4"
                />
              </Link>
              <div className="flex-1">
                <Link to={`/${notification.sender.username}`}>
                  <p className="hover:underline">
                    {notification.sender.username}
                  </p>
                </Link>
                <p className="text-gray-400">
                  {notification.type === "like" && "liked your post"}
                  {notification.type === "comment" && "commented on your post"}
                  {notification.type === "follow" && "followed you"}
                  {notification.type === "forum" && "replied to your forum"}
                </p>
              </div>
              <div className="ml-4">{getIcon(notification.type)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;

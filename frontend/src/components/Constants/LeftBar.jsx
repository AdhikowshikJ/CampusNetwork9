import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Hash,
  Users,
  Gift,
  GraduationCap,
  MessageSquare,
  User,
  Search,
  Bell,
  LogOut,
  Briefcase,
} from "lucide-react";
import useAuthStore from "../Store/authStore";
import SearchDialog from "../actions/SearchDialog";
import NotificationBadge from "../Reusable/NotificationBadge";
import axios from "axios";
import useSocket from "../../hooks/useSocket";

function LeftBar() {
  const [activePath, setActivePath] = useState("/");
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notification/`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  console.log(unreadCount);
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  useEffect(() => {
    if (socket && user) {
      socket.on("receive-notification", (data) => {
        console.log("letsgo");
        console.log(data.receiver);
        console.log("user", user._id);
        if (data.receiver._id === user._id) {
          setUnreadCount((prev) => prev + 1);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("receive-notification");
      }
    };
  }, [socket, user]);

  const menuItems = [
    { name: "Feed", icon: Home, path: "/home" },
    { name: "Explore", icon: Hash, path: "/explore" },
    { name: "Leaderboard", icon: Gift, path: "/leaderboard" },
    { name: "Forums", icon: MessageSquare, path: "/forum" },
    {
      name: "Notifications",
      icon: (props) => (
        <NotificationBadge
          icon={Bell}
          className="text-gray-500 hover:text-gray-300"
          unreadCount={unreadCount}
          {...props}
        />
      ),
      path: "/notifications",
    },
    { name: "Profile", icon: User, path: `/${user?.username}` },
    { name: "Message", icon: MessageSquare, path: "/chat" },
    { name: "Jobs", icon: Briefcase, path: "/jobs" },
  ];

  const handleLinkClick = (path) => {
    setActivePath(path);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="lg:w-64 w-20 p-4 h-screen hidden md:flex flex-col">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-start lg:flex-row flex-col justify-center mb-8">
          <img
            src="https://www.creativefabrica.com/wp-content/uploads/2021/09/25/NC-CN-logo-design-vector-Graphics-17819044-1.jpg"
            alt="Logo 1"
            className="w-10 h-10 lg:mr-2 mb-2 lg:mb-0 rounded-full object-fill"
          />
          <img
            src="https://play-lh.googleusercontent.com/oaX-jfd-OLVV0rl-OgE2LHGDWzjANgZzxV55cL7jlpqZ1q5bBECtW5Yp_z1yG1DHznY"
            alt="Logo 2"
            className="w-10 h-10 lg:mr-2 lg:mb-0 mb-2 rounded-full object-fill"
          />
        </div>
        <nav className="mb-4">
          <ul>
            <li className="mb-2">
              <SearchDialog />
            </li>
            <div className="border-b mb-2 border-gray-800  relative" />
            {menuItems.map((item) => (
              <li key={item.name} className="mb-4">
                <Link
                  to={item.path}
                  onClick={() => handleLinkClick(item.path)}
                  className={`flex items-center lg:justify-start justify-center sm:relative text-lg rounded-full p-1 lg:px-2 ${
                    activePath === item.path
                      ? "bg-gray-800"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {typeof item.icon === "function" ? (
                    <item.icon size={24} className="lg:mr-4" />
                  ) : (
                    <item.icon size={24} className="lg:mr-4" />
                  )}
                  <span className="lg:block hidden">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="bg-primary text-white rounded-full py-3 px-4 w-full font-bold text-lg flex items-center justify-center hover:bg-primary/90"
      >
        <LogOut size={24} className="lg:mr-2" />
        <span className="hidden lg:inline">Logout</span>
      </button>
    </div>
  );
}

export default LeftBar;

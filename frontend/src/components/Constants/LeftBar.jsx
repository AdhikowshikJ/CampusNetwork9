import React, { useState } from "react";
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
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "../Store/authStore";
import SearchDialog from "../actions/SearchDialog";

function LeftBar() {
  const [activePath, setActivePath] = useState("/");
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Feed", icon: Home, path: "/home" },
    { name: "Explore", icon: Hash, path: "/explore" },
    { name: "Leaderboard", icon: Gift, path: "/leaderboard" },
    { name: "Forums", icon: MessageSquare, path: "/forum" },
    { name: "Notifications", icon: Bell, path: "/notifications" },

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
        <div
          className="flex items-center justify-start
        
         lg:flex-row flex-col justify-center mb-8"
        >
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
            <div className="border-b mb-2 border-gray-800" />
            {menuItems.map((item) => (
              <li key={item.name} className="mb-4">
                <Link
                  to={item.path}
                  onClick={() => handleLinkClick(item.path)}
                  className={`flex items-center lg:justify-start justify-center  text-lg rounded-full p-1 lg:px-2 ${
                    activePath === item.path
                      ? "bg-gray-800"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <item.icon size={24} className="lg:mr-4" />
                  <span className="lg:block hidden">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="bg-primary  text-white rounded-full py-3 px-4 w-full font-bold text-lg flex items-center justify-center hover:bg-primary/90"
      >
        <LogOut size={24} className="lg:mr-2" />
        <span className="hidden lg:inline">Logout</span>
      </button>
    </div>
  );
}

export default LeftBar;

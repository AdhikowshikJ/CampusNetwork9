import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import useSocket from "../../hooks/useSocket";
import useAuthStore from "../Store/authStore";

const NotificationBadge = ({ icon: Icon, className = "", unreadCount = 0 }) => {
  return (
    <div className="relative">
      <Icon className={`w-6 h-6 ${className}`} />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 lg:-top-[3px] lg:-right-[109px] bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
          <span className="text-white text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        </div>
      )}
    </div>
  );
};

export default NotificationBadge;

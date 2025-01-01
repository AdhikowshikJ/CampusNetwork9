import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import MobileBottomBar from "./components/Constants/MobileBottomBar";
import Profile from "./components/pages/Profile";
import Home from "./components/pages/Home";
import StudentOfTheWeek from "./components/pages/StudentOfTheWeek";
import Forum from "./components/pages/Forum";
import Community from "./components/pages/Community";
import LeftBar from "./components/Constants/LeftBar";
import RightBar from "./components/Constants/RightBar";
import MobileTopBar from "./components/Constants/MobileTopBar";
import {
  Explore,
  Leaderboard,
  Message,
  Notifications,
} from "./components/pages";
import Post from "./components/Reusable/Post";

import { Toaster } from "./components/ui/toaster";
import useAuthStore from "./components/Store/authStore";
import EditProfile from "./components/actions/EditProfile";
import AuthPage from "./components/actions/authPage";
import useSocket from "./hooks/useSocket";
import OtpVerification from "./components/actions/OtpVerification";
import Jobs from "./components/pages/Jobs";

const ProtectedRoute = ({ children }) => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token) {
      navigate("/", { replace: true });
    }
  }, [user, token, navigate]);

  return user || token ? children : null;
};

const AuthRoute = ({ children }) => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user || token) {
      navigate("/home", { replace: true });
    }
  }, [user, token, navigate]);

  return !user && !token ? children : null;
};

function App() {
  const { pathname } = useLocation();
  const { user, token, fetchUserInfo, isLoading } = useAuthStore();
  const [data, setData] = useState({});
  const { socket } = useSocket();
  const navigate = useNavigate();
  useEffect(() => {
    if (token && !user) {
      fetchUserInfo();
    }

    if ((user || token) && pathname === "/") {
      navigate("/home", { replace: true });
    }
  }, [token, pathname, navigate, fetchUserInfo]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }
  return (
    <>
      <Toaster className="text-white" />
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <AuthPage />
            </AuthRoute>
          }
        />

        <Route
          path="/verify-otp"
          element={
            <AuthRoute>
              <OtpVerification />
            </AuthRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className="flex flex-col w-full justify-center md:flex-row max-h-screen bg-black text-white">
                <LeftBar />
                <main className="flex-grow border-x border-gray-800 w-full pb-5 sm:pb-0 sm:text-md h-screen overflow-auto overflow-x-hidden no-scrollbar">
                  {pathname === "/home" && <MobileTopBar />}
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/:username" element={<Profile />} />
                    <Route
                      path="/studentoftheweek"
                      element={<StudentOfTheWeek />}
                    />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/post/:pid" element={<Post />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/chat" element={<Message />} />
                    <Route path="/chat/:id" element={<Message />} />
                    <Route
                      path="/edit-profile/:username"
                      element={<EditProfile />}
                    />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                    <Route path="/jobs" element={<Jobs />} />
                  </Routes>
                </main>
                <RightBar />
                {pathname !== "/chat" && <MobileBottomBar />}
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

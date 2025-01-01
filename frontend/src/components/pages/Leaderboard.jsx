import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaChevronLeft,
  FaBell,
  FaCog,
  FaCrown,
  FaSearch,
  FaExchangeAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import useAuthStore from "../Store/authStore";

const TrendIcon = ({ trend }) =>
  trend === "up" ? (
    <FaArrowUp className="text-green-400 ml-1" />
  ) : (
    <FaArrowDown className="text-red-400 ml-1" />
  );

const Leaderboard = () => {
  const [students, setStudents] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(0);
  const { user } = useAuthStore();
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/leaderboard`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const data = response.data.users || [];
        console.log(data);
        setStudents(data);

        // Determine current user's rank if needed
        const currentUserId = user?._id; // Replace with actual user ID logic
        const rank = data.findIndex((user) => user._id === currentUserId) + 1;
        setCurrentUserRank(rank || 0);
      } catch (error) {
        console.error("Error fetching leaderboard data", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const sortedStudents = [...students].sort((a, b) => b.points - a.points);
  if (!Array.isArray(students)) {
    return <div>Error: Data not available</div>;
  }
  return (
    <div className="bg-black min-h-screen text-white p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <FaChevronLeft className="mr-2 cursor-pointer text-accent" />
            <h1 className="text-xl sm:text-2xl font-semibold text-accent">
              Leaderboard
            </h1>
          </div>
        </header>

        <div className="relative mb-12">
          <div className="flex justify-between items-end">
            {sortedStudents.slice(0, 3).map((student, index) => (
              <div
                key={student._id}
                className={`flex flex-col items-center ${
                  index === 0 ? "order-first" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={student.profileImage}
                    alt={student.username}
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-4 ${
                      index === 0 ? "border-yellow-400" : "border-[#ae00ff]"
                    }`}
                  />
                  {index === 0 && (
                    <FaCrown className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 text-2xl" />
                  )}
                </div>
                <p className="text-sm sm:text-base font-medium mt-2 text-white">
                  {student.username}
                </p>
                <div className="flex items-center">
                  <p className="text-gray-300 font-bold">{student.points}pts</p>
                  {/* <TrendIcon trend={student.trend} /> */}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-12 bg-sky-800 rounded-xl -z-10"></div>
        </div>

        <div className="border border-accent bg-gray-800 rounded-xl p-4 mb-6">
          <h2 className="text-highlight mb-2">Your Rank</h2>
          <div className="flex items-center  p-3 rounded-lg shadow-lg">
            <span className="text-lg font-bold mr-4 text-yellow-400">
              {currentUserRank}
            </span>
            {students[currentUserRank - 1] && (
              <>
                <img
                  src={students[currentUserRank - 1].profileImage}
                  alt={students[currentUserRank - 1].username}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-4"
                />
                <span className="flex-grow text-white">
                  {students[currentUserRank - 1].username}
                </span>
                <div className="flex items-center">
                  <span className="font-bold text-accent">
                    {students[currentUserRank - 1].points}pts
                  </span>
                  {/* <TrendIcon trend={students[currentUserRank - 1].trend} /> */}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-highlight" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-12 text-highlight pr-4 py-3 bg-gray-700 rounded-full border border-gray-800 focus:outline-none focus:border-[#ae00ff]"
          />
          <FaExchangeAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#ae00ff] cursor-pointer" />
        </div>

        <div className="space-y-4">
          {sortedStudents.slice(3).map((student, index) => (
            <div
              key={student._id}
              className={`flex items-center bg-gray-800 rounded-xl p-3 ${
                index + 4 === currentUserRank
                  ? "border-2 border-yellow-400"
                  : ""
              }`}
            >
              <span className="text-lg font-bold mr-4 w-6 text-center">
                {index + 4}
              </span>
              <img
                src={student.profileImage}
                alt={student.username}
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full mr-4"
              />
              <span className="flex-grow text-white">{student.username}</span>
              <div className="flex items-center">
                <span className="font-bold text-[#d083f4]">
                  {student.points}pts
                </span>
                {/* <TrendIcon trend={student.trend} /> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

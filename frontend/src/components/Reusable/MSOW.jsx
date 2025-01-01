import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TrophyIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import Lottie from "react-lottie";
import animationData from "../lottie/Animation - 1720455401049.json";

const MobileStudentOfWeek = () => {
  const [topStudent, setTopStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const fetchTopStudent = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/sow`
        );
        const { student } = response.data;

        if (student) {
          setTopStudent({
            ...student,
            handle: student.email.split("@")[0],
            section: `${student.branch}-${student.section}`,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student of the week:", error);
        setError("Failed to load student of the week");
        setLoading(false);
      }
    };

    fetchTopStudent();
  }, []);

  if (loading || error || !topStudent) {
    return null;
  }

  return (
    <div className="p-4 pb-0 mb-4 md:hidden bg-black shadow-primary shadow-sm rounded-lg relative overflow-hidden">
      <div className="flex flex-col items-center mb-2 relative z-10">
        <h2 className="text-2xl font-bold text-white flex items-center mb-2">
          <TrophyIcon className="w-6 h-6 mr-2 text-yellow-400" />
          Student of the Week
        </h2>
        <div className="absolute top-8 left-0 right-0 z-0">
          <Lottie options={defaultOptions} height="100%" width="100%" />
        </div>
      </div>
      <div className="flex items-start p-4 rounded-lg relative z-10">
        <img
          src={topStudent.profileImage}
          className="md:w-12 md:h-12 w-8 h-8 rounded-full border-2 border-indigo-500"
          onError={(e) => {
            e.target.src =
              "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg";
          }}
          alt={topStudent.name}
        />
        <div className="flex-grow items-center">
          <div className="flex flex-col ml-2 pb-2">
            <div className="text-xl font-bold text-white">
              {topStudent.name || topStudent.username}
            </div>
            <div className="text-sm text-gray-400">
              @{topStudent.handle} • {topStudent.section}
            </div>
          </div>
          <div className="mx-2flex items-center">
            <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-semibold">
              {topStudent.points} points
            </span>
          </div>

          <div className="mt-5 flex justify-between text-sm text-gray-400">
            <div className="flex flex-col items-center">
              <DocumentTextIcon className="w-5 h-5 mb-1 text-white" />
              <span>{topStudent.postCount || 0} posts</span>
            </div>

            <div className="flex flex-col items-center">
              <UserGroupIcon className="w-5 h-5 mb text-white" />
              <span>{topStudent.followers?.length || 0} follows</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileStudentOfWeek;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrophyIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { RainbowButton } from "../ui/rainbow-button";

const NeonGradientCard = ({ className, children }) => {
  return (
    <div className={`group relative rounded-xl bg-gray-900 p-0.5 ${className}`}>
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#ee82ee] to-[#9c40ff] opacity-30 blur-lg transition-all duration-500 group-hover:opacity-70 group-hover:duration-200" />
      <div className="relative flex rounded-xl bg-black p-4">{children}</div>
    </div>
  );
};

const StudentOfWeek = () => {
  const [topStudent, setTopStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            section: `${student.branch} ${student.section}`,
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

  const LoadingCard = () => (
    <NeonGradientCard className="w-full md:max-w-md">
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4 flex items-center text-white">
          <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
          Student of the Week
        </h2>
        <div className="text-gray-400">Loading...</div>
      </div>
    </NeonGradientCard>
  );

  const ErrorCard = () => (
    <NeonGradientCard className="w-full md:max-w-md">
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4 flex items-center text-white">
          <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
          Student of the Week
        </h2>
        <div className="text-red-500">{error}</div>
      </div>
    </NeonGradientCard>
  );

  if (loading) return <LoadingCard />;
  if (error) return <ErrorCard />;
  if (!topStudent) {
    return (
      <NeonGradientCard className="w-full md:max-w-md">
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4 flex items-center text-white">
            <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
            Student of the Week
          </h2>
          <div className="text-gray-400">No student found</div>
        </div>
      </NeonGradientCard>
    );
  }

  return (
    <NeonGradientCard className="w-full md:max-w-md">
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4 flex items-center text-white">
          <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
          <span className="">Student of the Week</span>
        </h2>
        <div className="flex items-center mb-4">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#ee82ee] to-[#9c40ff] opacity-30 blur" />
            <Link to={`/${topStudent.username}`}>
              <img
                src={topStudent.profileImage}
                alt={topStudent.username}
                className="relative w-16 h-16 rounded-full object-cover border-2 border-transparent bg-gray-900"
                onError={(e) => {
                  e.target.src =
                    "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg";
                }}
              />{" "}
            </Link>
          </div>
          <div className="ml-4">
            <Link to={`/${topStudent.username}`}>
              <h3 className="text-lg font-semibold ">
                {topStudent.name || topStudent.username}
              </h3>
            </Link>
            <p className="text-sm text-gray-400">@{topStudent.handle}</p>
            <p className="text-xs text-gray-300">{topStudent.section}</p>
            <div className="flex items-center mt-1">
              <CurrencyDollarIcon className="w-4 h-4 text-yellow-500 mr-1" />
              <span className=" font-bold mr-2">{topStudent.points} pts</span>
            </div>
          </div>
        </div>
        <Link
          to={`/${topStudent.username}`}
          className="block text-center  text-black font-bold py-2 px-4 rounded-full transition duration-300 hover:opacity-90"
        >
          <RainbowButton className="bg-white text-white">
            View Profile
          </RainbowButton>
        </Link>
      </div>
    </NeonGradientCard>
  );
};

export default StudentOfWeek;

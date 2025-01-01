import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaLink,
} from "react-icons/fa";
import PostCard from "../Reusable/PostCard";
import { PencilIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/logo.svg";
import useUserProfileStore from "../Store/userProfileStore";
import useFollow from "../../hooks/useFollow";
import Loader from "../Reusable/Loader";
import { BorderBeam } from "../ui/border-beam";
import CreatePostSection from "../Reusable/CreatePostSection";
import useAuthStore from "../Store/authStore";

const iconMap = { FaGithub, FaLinkedin, FaInstagram, FaTwitter };

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();
  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const authUserr = useAuthStore((state) => state.user);

  // Use the useFollow hook
  const { followUser, unfollowUser, isFollowing, isFollowingLoading } =
    useFollow(user._id);

  const handleFollow = async () => {
    if (isFollowing) {
      await unfollowUser();
    } else {
      await followUser();
    }
    fetchUser(); // Refresh user data after follow/unfollow action
  };

  const handleEditProfile = () => {
    navigate(`/edit-profile/${username}`);
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/getUserByName/${username}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setUser(response.data.user);
      setUserProfile(response.data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [username]);

  useEffect(() => {
    async function fetchAuthUser() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/me`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setAuthUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAuthUser();
  }, []);

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/userposts/${username}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setPosts(response.data.posts);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    getPosts();
  }, [username]);

  if (loading) {
    return <Loader bool={loading} />;
  }

  const isCurrentUserProfile = authUser?._id === user._id;

  return (
    <div className="flex justify-center items-center ">
      <div className="w-full max-w-4xl bg-black text-white">
        <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg">
            {/* Banner Image */}
            <div className="relative h-48 md:h-64 lg:h-80">
              <img
                src={
                  userProfile?.bannerImage ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHbtV5aC0oxrn_VsYScvBA4QaU1zGpseU20tW7Tj5EeBwNKVKYCbd8eTMRm4uWhCQJ-Kg&usqp=CAU"
                }
                alt="Banner"
                className="w-full h-full object-cover "
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-32 md:h-40 lg:h-48" />
            </div>

            {/* Profile Section */}
            <div className="relative -mt-20 md:-mt-24 lg:-mt-28 mx-6 md:mx-8 lg:mx-10 flex flex-col md:flex-row gap-4 md:items-center text-inherit">
              <img
                className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-gray-900"
                src={
                  userProfile?.profileImage ||
                  "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                }
                alt={userProfile.name}
              />

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold">
                      {userProfile.name
                        ? userProfile.name
                        : userProfile.username}{" "}
                      {true && (
                        <img
                          src={Logo}
                          className="inline-block w-8 h-8 lg:w-12 lg:h-12 ml-2"
                        />
                      )}
                    </div>
                    <div className="text-sm md:text-base lg:text-lg text-gray-400">
                      @{userProfile.email.split("@")[0]}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-2">
                    {isCurrentUserProfile ? (
                      <Button
                        onClick={handleEditProfile}
                        className="flex items-center gap-2 px-4 py-2 text-sm md:text-base lg:text-lg bg-[#ae00ff] hover:bg-[#ce6bfc] transition-colors duration-200"
                      >
                        <PencilIcon className="w-5 h-5" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={handleFollow}
                          disabled={isFollowingLoading}
                          variant={isFollowing ? "outline" : "default"}
                          className="px-4 py-2 text-sm md:text-base lg:text-lg"
                        >
                          {isFollowingLoading
                            ? "Loading..."
                            : isFollowing
                            ? "Unfollow"
                            : "Follow"}
                        </Button>
                        <Button className="px-4 py-2 text-sm md:text-base lg:text-lg">
                          Message
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Branch and Year */}
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="text-gray-300">
                    <span className="font-semibold">Branch:</span>{" "}
                    {userProfile?.branch || "N/A"}
                  </div>
                  <div className="text-gray-300">
                    <span className="font-semibold">Section:</span>{" "}
                    {userProfile?.section || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6 px-6 md:px-8 lg:px-10">
              <p className="text-gray-300 text-sm md:text-base">
                {userProfile.bio}
              </p>
            </div>

            {/* Bio Links */}
            <div className="mt-4 px-6 md:px-8 lg:px-10 flex flex-wrap gap-2">
              {userProfile.bioLinks &&
                userProfile.bioLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <FaLink className="w-4 h-4" />
                    {link.label}
                  </a>
                ))}
            </div>

            {/* Skills and Points */}
            <div className=" flex justify-center w-full max-w-2xl mx-auto">
              <div className=" w-full flex justify-center border-gray-800 mt-1 px-6 md:px-8 lg:px-10 pb-4">
                <div className="grid w-full grid-cols-2 bg-[#000000]  border border-gray-800 gap-4 md:gap-6 place-items-center py-6 rounded-lg">
                  <div className="">
                    <div className="text-sm md:text-base lg:text-lg font-medium">
                      Skills
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2 md:gap-3 lg:gap-4">
                      {userProfile.skills ? (
                        <>
                          {userProfile.skills.map((skill) => (
                            <Badge
                              variant="secondary"
                              className="bg-gray-600"
                              key={skill}
                            >
                              {skill}
                            </Badge>
                          ))}
                        </>
                      ) : (
                        <p className="bg-gray-600 text-sm md:text-base lg:text-lg">
                          N/A
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm md:text-base lg:text-lg font-medium">
                      Points
                    </div>
                    <div className="flex pt-2 items-center gap-2 text-sm md:text-base lg:text-lg">
                      <TrophyIcon className="w-5 h-5 text-yellow-500" />
                      <span>{userProfile.points}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 px-6 bg-gray-900 rounded-lg border border-gray-700 w-full max-w-2xl m-auto flex justify-center md:px-8 lg:px-10">
            <div className="flex justify-between space-x-32 md:space-x-16 lg:space-x-24  rounded-t-lg  w-full md:max-w-2xl  p-4">
              <div className="flex flex-row items-center gap-2">
                <div className="text-lg md:text-xl lg:text-2xl font-bold">
                  {userProfile.followerCount}
                </div>
                <div className="text-sm md:text-base text-gray-400">
                  Followers
                </div>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="text-lg md:text-xl lg:text-2xl font-bold">
                  {userProfile.followingCount}
                </div>
                <div className="text-sm md:text-base text-gray-400">
                  Following
                </div>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="text-lg md:text-xl lg:text-2xl font-bold">
                  {posts.length}
                </div>
                <div className="text-sm md:text-base text-gray-400">Posts</div>
              </div>
            </div>
          </div>

          {isCurrentUserProfile && (
            <div className="max-w-2xl mx-auto">
              <CreatePostSection
                authUser={authUserr}
                isCreatePostOpen={isCreatePostOpen}
                setIsCreatePostOpen={setIsCreatePostOpen}
              />
            </div>
          )}
          {/* Posts Section */}
          <div className="max-w-2xl  mt-8 mx-auto">
            <h2 className="text-2xl font-bold mb-4">Posts</h2>
            <div className="flex-col">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  id={post._id}
                  createdAt={post.createdAt}
                  likes={post.likes}
                  likesCount={post.likes.length}
                  userId={authUser?._id}
                  avatar={userProfile.profileImage}
                  name={userProfile.name}
                  username={userProfile.username}
                  email={post.postedBy.email}
                  content={post.content}
                  image={post.image}
                  section={userProfile.section}
                  branch={userProfile.branch ? userProfile.branch : null}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import PostCard from "../Reusable/PostCard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreatePost from "../actions/CreatePost";
import Lottie from "react-lottie";
import animationData from "../lottie/Animation - 1720455401049.json";
import {
  UserIcon,
  HeartIcon,
  UserGroupIcon,
  DocumentTextIcon,
  TrophyIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import useAuthStore from "../Store/authStore";
import Loader from "../Reusable/Loader";
import MobileStudentOfWeek from "../Reusable/MSOW";
import { Sparkles } from "lucide-react";
import { BorderBeam } from "../ui/border-beam";
import ScratchToReveal from "../ui/scratch-to-reveal";
import CreatePostSection from "../Reusable/CreatePostSection";

const EmptyState = ({ type }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 mb-6 text-purple-500">
        {type === "following" ? (
          <UserGroupIcon className="w-full h-full" />
        ) : (
          <DocumentTextIcon className="w-full h-full" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-200 mb-2">
        {type === "following"
          ? "No Posts from Your Network Yet"
          : "No Posts to Show"}
      </h3>
      <p className="text-gray-400 max-w-sm mb-6">
        {type === "following"
          ? "Start following other students to see their posts here. Connect with peers who share your interests!"
          : "Be the first to share something interesting! Your post could inspire others."}
      </p>
    </div>
  );
};

function Home() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [forYouPosts, setForYouPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchForYouPosts();
    fetchFollowingPosts();
  }, []);

  const fetchFollowingPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/followingposts`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setFollowingPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching 'Following' posts:", error);
      setLoading(false);
    }
  };

  const fetchForYouPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/foryouposts`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setForYouPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  const handleCloseCreatePost = () => {
    setIsCreatePostOpen(false);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (loading) {
    return <Loader bool={loading} />;
  }

  return (
    <div className="max-w-2xl mx-auto overflow-hidden">
      <Tabs defaultValue="foryou" className="w-full border-b border-gray-800">
        <TabsList className="w-full m-2 bg-transparent flex">
          <TabsTrigger value="foryou" className="flex-1">
            For You
          </TabsTrigger>
          <TabsTrigger value="following" className="flex-1">
            Following
          </TabsTrigger>
        </TabsList>

        <TabsContent value="foryou">
          <MobileStudentOfWeek />
          <CreatePostSection
            authUser={authUser}
            isCreatePostOpen={isCreatePostOpen}
            setIsCreatePostOpen={setIsCreatePostOpen}
          />

          {forYouPosts.length === 0 ? (
            <EmptyState type="foryou" />
          ) : (
            forYouPosts.map((post) => (
              <PostCard
                key={post._id}
                avatar={
                  post.postedBy.profileImage ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsslVRNcMaUQHy-iIuLvLOHJGFx3dTODzpcg&s"
                }
                id={post._id}
                createdAt={post.createdAt}
                likes={post.likes}
                likesCount={post.likes.length}
                userId={authUser?._id}
                name={post.postedBy.name}
                username={post.postedBy.username}
                content={post.content}
                image={post.image}
                comments={post.comments}
                email={post.postedBy.email}
                section={post.postedBy.section}
                branch={post.postedBy.branch}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="following">
          <CreatePostSection
            authUser={authUser}
            isCreatePostOpen={isCreatePostOpen}
            setIsCreatePostOpen={setIsCreatePostOpen}
          />
          {followingPosts.length === 0 ? (
            <EmptyState type="following" />
          ) : (
            followingPosts.map((post) => (
              <PostCard
                key={post._id}
                avatar={
                  post.postedBy.profileImage ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsslVRNcMaUQHy-iIuLvLOHJGFx3dTODzpcg&s"
                }
                id={post._id}
                likes={post.likes}
                likesCount={post.likes.length}
                userId={authUser?._id}
                createdAt={post.createdAt}
                name={post.postedBy.name}
                email={post.postedBy.email}
                username={post.postedBy.username}
                content={post.content}
                image={post.image}
                comments={post.comments}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Home;

import React, { useState, useEffect } from "react";
import { PhotoIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import PostCard from "../Reusable/PostCard";
import BlurFade from "../magicui/blur-fade";
import axios from "axios";
import useAuthStore from "../Store/authStore";
import Loader from "../Reusable/Loader";

const Explore = () => {
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem("activeTab") || "media"
  );
  const [activeSection, setActiveSection] = useState("all");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const authUser = useAuthStore((state) => state.user);

  const sections = ["all", "CSE", "IT", "ECE", "AI/ML", "EEE", "MECH", "CS"];

  useEffect(() => {
    fetchPosts();
  }, [activeSection]); // Add activeSection as dependency to refetch when it changes

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${activeSection}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Reset scroll position when changing sections
    window.scrollTo(0, 0);
  };

  const mediaPosts = posts.filter((post) => post.image);
  const textPosts = posts.filter((post) => !post.image);

  return (
    <div className="max-w-2xl mx-auto bg-black text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Explore</h1>

      {/* Tabs */}
      <div className="flex mb-4 border-b border-gray-700">
        <button
          className={`flex items-center mr-4 pb-2 ${
            activeTab === "media" ? "border-b-2 border-[#ae00ff]" : ""
          }`}
          onClick={() => handleTabChange("media")}
        >
          <PhotoIcon className="w-5 h-5 mr-2" />
          Media
        </button>
        <button
          className={`flex items-center pb-2 ${
            activeTab === "text" ? "border-b-2 border-[#ae00ff]" : ""
          }`}
          onClick={() => handleTabChange("text")}
        >
          <DocumentTextIcon className="w-5 h-5 mr-2" />
          Text
        </button>
      </div>

      {/* Section Badges */}

      <div className="relative h-full">
        <div className="absolute block md:hidden top-0 right-0 h-full -mr-6 w-20 pointer-events-none bg-gradient-to-l from-black to-transparent"></div>
        <div className="flex  mb-4 w-full overflow-auto no-scrollbar">
          {sections.map((section) => (
            <button
              key={section}
              className={`mr-2 mb-2 px-3 py-1 rounded-full text-sm ${
                activeSection === section ? "bg-[#ae00ff]" : "bg-gray-700"
              } hover:bg-[#ae00ff] transition-colors`}
              onClick={() => handleSectionChange(section)}
            >
              {section.toUpperCase()}
            </button>
          ))}
          <button>{"                              "}</button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader bool={loading} />
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No posts found in this section
        </div>
      ) : activeTab === "media" ? (
        <div className="grid grid-cols-3 gap-2">
          {mediaPosts.map((post) => (
            <Link key={post._id} to={`/post/${post._id}`}>
              <BlurFade delay={0.25}>
                <img
                  src={post.image}
                  alt={`Post by ${post.postedBy.username}`}
                  className="w-full h-auto rounded"
                />
              </BlurFade>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {textPosts.map((post) => (
            <div key={post._id} className="rounded">
              <PostCard
                avatar={
                  post.postedBy.profileImage ||
                  "https://www.creativefabrica.com/wp-content/uploads/2021/09/25/NC-CN-logo-design-vector-Graphics-17819044-1.jpg"
                }
                id={post._id}
                createdAt={post.createdAt}
                branch={post.postedBy.branch}
                section={post.postedBy.section}
                name={post.postedBy.name}
                email={post.postedBy.email}
                username={post.postedBy.username}
                content={post.content}
                comments={post.comments}
                userId={authUser?._id}
                likes={post.likes}
                likesCount={post.likes.length}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;

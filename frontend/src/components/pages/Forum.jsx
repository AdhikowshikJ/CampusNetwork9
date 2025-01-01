import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import useForum from "../../hooks/useForum";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";

const Forum = () => {
  const [activeTab, setActiveTab] = useState("events");
  const { forumTopics, addForumTopic, addReply, handleLike, error, setError } =
    useForum();
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [newTopic, setNewTopic] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [showReplies, setShowReplies] = useState({});

  function timeAgo(timestamp) {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  }

  const handleReply = async (topicId, topicPostedBy) => {
    if (newReply.trim() === "") return;
    try {
      await addReply(topicId, newReply, topicPostedBy);
      setNewReply("");
      setActiveTopicId(null);
    } catch (error) {
      setError("Failed to add reply. Please try again.");
    }
  };

  const handleAddTopic = async () => {
    if (newTopic.title.trim() === "" || newTopic.content.trim() === "") return;
    try {
      await addForumTopic(newTopic);
      setNewTopic({ title: "", content: "", category: "" });
    } catch (error) {
      setError("Failed to add new topic. Please try again.");
    }
  };

  const toggleReplies = (topicId) => {
    setShowReplies((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const handleTopicLike = async (topicId) => {
    try {
      await handleLike(topicId);
    } catch (error) {
      setError("Failed to like the topic. Please try again.");
    }
  };

  const handleReplyLike = async (topicId, replyId) => {
    try {
      await handleLike(topicId, replyId);
    } catch (error) {
      setError("Failed to like the reply. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-black min-h-screen p-4 lg:px-8">
      <div className="max-w-[850px] mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-[#ae00ff] to-purple-400 bg-clip-text text-transparent">
          Forums
        </h1>
        {error && (
          <Alert
            variant="destructive"
            className="mb-4 bg-red-900/20 border border-red-500/50"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {/* Tabs */}
        {/* <div className="flex mb-8 border-b border-gray-800"> */}
        {/* <button
            className={`flex items-center mr-4 pb-2 px-4 transition-all duration-300 ${
              activeTab === "events"
                ? "border-b-2 border-[#ae00ff] text-[#ae00ff]"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("events")}
          >
            <CalendarIcon className="w-5 h-5 mr-2" />
            Events
          </button> */}
        {/* <button
            className={`flex items-center pb-2 px-4 transition-all duration-300 ${
              activeTab === "forums"
                ? "border-b-2 border-[#ae00ff] text-[#ae00ff]"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("forums")}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
            Forums
          </button>
        </div> */}
        {/* {activeTab === "events" ? (
          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6 hover:border-[#ae00ff]/30 transition-all duration-300">
              <img
                src="path_to_event_image.jpg"
                alt="Event banner"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="text-sm text-[#ae00ff] mb-2 font-medium">
                Podcasts
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                How to Crack a Data Scientist Interview
              </h3>
              <p className="text-gray-400 mb-6">
                Learn some of the Best tips from a Senior Data Scientist to ace
                Data Science Interviews!
              </p>
              <div className="grid grid-cols-2 gap-6 text-gray-300 mb-6">
                <div>
                  <p className="font-medium text-gray-400 mb-1">Start Date</p>
                  <p>14 Jul, 2024</p>
                </div>
                <div>
                  <p className="font-medium text-gray-400 mb-1">Duration</p>
                  <p>1 hour</p>
                </div>
                <div>
                  <p className="font-medium text-gray-400 mb-1">Start Time</p>
                  <p>11:00 AM</p>
                </div>
                <div>
                  <p className="font-medium text-gray-400 mb-1">Status</p>
                  <p>Not Registered</p>
                </div>
              </div>
              <button className="w-full bg-[#ae00ff] hover:bg-[#ae00ff]/80 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(174,0,255,0.3)]">
                View Details
              </button>
            </div>
            <button className="w-full bg-gray-900/50 hover:bg-gray-800/50 text-white font-semibold py-3 px-4 rounded-lg border border-gray-800 hover:border-[#ae00ff]/30 transition-all duration-300">
              <PlusIcon className="w-5 h-5 inline mr-2" />
              Add New Event
            </button>
          </div>
        ) : ( */}
        <div className="space-y-6">
          {/* New Topic Form */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-[#ae00ff]/30 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-6 text-white">
              Create New Topic
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-3 bg-gray-800/50 text-white border border-gray-700 rounded-lg focus:border-[#ae00ff]/50 focus:ring-1 focus:ring-[#ae00ff]/50 transition-all duration-300"
                value={newTopic.title}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, title: e.target.value })
                }
              />
              <textarea
                placeholder="Content"
                className="w-full p-3 bg-gray-800/50 text-white border border-gray-700 rounded-lg focus:border-[#ae00ff]/50 focus:ring-1 focus:ring-[#ae00ff]/50 transition-all duration-300"
                rows="3"
                value={newTopic.content}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, content: e.target.value })
                }
              ></textarea>
              <input
                type="text"
                placeholder="Category"
                className="w-full p-3 bg-gray-800/50 text-white border border-gray-700 rounded-lg focus:border-[#ae00ff]/50 focus:ring-1 focus:ring-[#ae00ff]/50 transition-all duration-300"
                value={newTopic.category}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, category: e.target.value })
                }
              />
              <button
                className="w-full bg-[#ae00ff] hover:bg-[#ae00ff]/80 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(174,0,255,0.3)]"
                onClick={handleAddTopic}
              >
                <PlusIcon className="w-5 h-5 inline mr-2" />
                Start New Discussion
              </button>
            </div>
          </div>

          {/* Existing Topics */}
          {forumTopics.map((topic) => (
            <div
              key={topic._id}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-[#ae00ff]/30 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-[#ae00ff] mb-4">
                {topic.title}
              </h3>
              <div className="flex items-center mb-6">
                <img
                  src={topic.postedBy.profileImage}
                  alt={topic.postedBy.username}
                  className="w-10 h-10 rounded-full mr-4 border-2 border-[#ae00ff]/20"
                />
                <div>
                  <span className="text-white font-medium block">
                    {topic.postedBy.username}
                  </span>
                  <span className="text-sm text-gray-400">
                    {topic.createdAt && timeAgo(topic.createdAt)}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {topic.content}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <span className="bg-[#ae00ff]/20 text-[#ae00ff] text-sm px-3 py-1 rounded-full border border-[#ae00ff]/30">
                  {topic.category}
                </span>
                <div className="flex items-center gap-4">
                  <button
                    className="text-gray-400 hover:text-[#ae00ff] transition-colors duration-300"
                    onClick={() => handleTopicLike(topic._id)}
                  >
                    <HandThumbUpIcon className="w-5 h-5 inline mr-1" />
                    <span>{topic.likes.length}</span>
                  </button>
                  <button
                    className="text-gray-400 hover:text-[#ae00ff] transition-colors duration-300"
                    onClick={() => toggleReplies(topic._id)}
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 inline mr-1" />
                    <span>{topic.replies.length} Replies</span>
                  </button>
                  <button
                    className="text-gray-400 hover:text-[#ae00ff] transition-colors duration-300"
                    onClick={() =>
                      setActiveTopicId(
                        activeTopicId === topic._id ? null : topic._id
                      )
                    }
                  >
                    <ArrowLeftIcon className="w-5 h-5 inline mr-1" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>

              {showReplies[topic._id] && (
                <div className="space-y-4 mb-6">
                  {topic.replies.map((reply) => (
                    <div
                      key={reply._id}
                      className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50"
                    >
                      <div className="flex items-center mb-3 text-gray-300">
                        <UserCircleIcon className="w-5 h-5 mr-2" />
                        <span className="font-medium">
                          {reply.postedBy.username}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{reply.content}</p>
                      <button
                        className="text-gray-400 hover:text-[#ae00ff] transition-colors duration-300"
                        onClick={() => handleReplyLike(topic._id, reply._id)}
                      >
                        <HandThumbUpIcon className="w-4 h-4 inline mr-1" />
                        <span>{reply.likes.length}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTopicId === topic._id && (
                <div className="mt-6">
                  <textarea
                    className="w-full p-3 bg-gray-800/50 text-white border border-gray-700 rounded-lg focus:border-[#ae00ff]/50 focus:ring-1 focus:ring-[#ae00ff]/50 transition-all duration-300"
                    rows="3"
                    placeholder="Write your reply..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                  ></textarea>
                  <button
                    className="mt-3 bg-[#ae00ff] hover:bg-[#ae00ff]/80 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                    onClick={() => handleReply(topic._id, topic.postedBy._id)}
                  >
                    Post Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;

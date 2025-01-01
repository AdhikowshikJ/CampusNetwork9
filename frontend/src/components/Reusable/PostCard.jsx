import React from "react";
import {
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  BadgeCheck,
  Share,
} from "lucide-react";
import useLikePost from "../../hooks/useLikePost";
import { Link } from "react-router-dom";
import useComment from "../../hooks/useComment";
import { formatDistanceToNow } from "date-fns";
import { CoolMode } from "../ui/cool-mode";
import HeartImage from "../../assets/heart.png";

function PostCard({
  avatar,
  name,
  username,
  id,
  isVerified,
  section,
  branch,
  content,
  image,
  email,
  rollNo,
  commentsCount,
  createdAt,
  likes,
  userId,
  onComment,
  onShare,
  onSave,
}) {
  const {
    likes: likesArr,
    liked,
    likePost,
    unlikePost,
  } = useLikePost(id, likes, userId);
  const { comments } = useComment(id);
  const handleLike = () => {
    liked ? unlikePost() : likePost();
  };

  function timeAgo(timestamp) {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  }
  console.log(section);
  return (
    <div className="bg-black text-white rounded-lg shadow-lg p-4 mb-2 md:p-6 transition-all duration-300 hover:shadow-xl border border-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full border-2 object-cover border-[#ae00ff]"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">{username}</span>
              {isVerified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
            </div>
            <div className="text-[10px] font-bold  text-pink-300">
              @{email.split("@")[0].toUpperCase()} ·{" "}
              <span className="font-bold text-yellow-200">{section}</span> ·{" "}
              <span className="font-normal text-gray-300">
                {timeAgo(createdAt)}
              </span>
            </div>
          </div>
        </div>
        {section && (
          <span className="bg-[#ae00ff] text-white px-3 py-1 rounded-full text-sm font-semibold">
            {branch}
          </span>
        )}
      </div>
      <Link to={`/post/${id}`}>
        {image && (
          <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
            <img
              src={image}
              alt="Post image"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        )}

        <p className="mt-4 text-gray-300 text-md leading-relaxed">{content}</p>
      </Link>

      <div className="flex justify-between mt-6 text-gray-400">
        <div className="flex space-x-4">
          <button
            className={`flex items-center space-x-2 transition-colors duration-200 ${
              liked ? "text-red-500" : "hover:text-red-500"
            }`}
            onClick={handleLike}
          >
            {liked ? (
              <Heart className="w-6 h-6 fill-current" />
            ) : (
              <CoolMode
                options={{
                  particle: HeartImage,
                }}
              >
                <Heart className="w-6 h-6" />
              </CoolMode>
            )}
            <span className="text-sm">{likesArr.length}</span>
          </button>

          <Link to={`/post/${id}`}>
            <button
              className="flex items-center space-x-2 hover:text-blue-500 transition-colors duration-200"
              onClick={onComment}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm">{comments?.length}</span>
            </button>
          </Link>
          <button
            className="flex items-center space-x-2 hover:text-green-500 transition-colors duration-200"
            onClick={onShare}
          >
            <Share className="w-6 h-6" />
          </button>
        </div>
        <button
          className="flex items-center space-x-2 hover:text-yellow-500 transition-colors duration-200 ml-auto"
          onClick={onSave}
        >
          <Bookmark className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default PostCard;

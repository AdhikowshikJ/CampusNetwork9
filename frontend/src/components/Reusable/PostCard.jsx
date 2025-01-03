import React, { useState } from "react";
import {
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  BadgeCheck,
  Share,
  BadgeX,
  EllipsisVertical,
} from "lucide-react";
import useLikePost from "../../hooks/useLikePost";
import { Link, useNavigate } from "react-router-dom";
import useComment from "../../hooks/useComment";
import { formatDistanceToNow } from "date-fns";
import { CoolMode } from "../ui/cool-mode";
import HeartImage from "../../assets/heart.png";
import useAuthStore from "../Store/authStore";
import { useToast } from "../ui/use-toast";

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
  postedBy,
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const { comments } = useComment(id);
  const handleLike = () => {
    liked ? unlikePost() : likePost();
  };
  const user = useAuthStore((state) => state.user);
  const iscurrentUser = user?._id === postedBy?._id;
  const { toast } = useToast();
  function timeAgo(timestamp) {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  }
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/deletepost/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Post Deleted",
          variant: "success",
          description: "Your post has been deleted successfully",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "error",
      });
    }
  };

  return (
    <div className="bg-black text-white rounded-lg shadow-lg p-4 mb-2 md:p-6 transition-all duration-300 hover:shadow-xl border border-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Link to={`/${username}`} className="">
            <img
              src={avatar}
              alt={name}
              className="w-12 h-12 rounded-full border-2 object-cover border-[#ae00ff]"
            />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Link to={`/${username}`} className="hover:text-purple-300">
                {" "}
                <span className="font-bold text-lg">{username}</span>{" "}
              </Link>
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
            className="flex items-center space-x-2 hover:text-yellow-500 transition-colors duration-200 ml-auto"
            onClick={onSave}
          >
            <Bookmark className="w-6 h-6" />
          </button>
        </div>
        {iscurrentUser && (
          <>
            <button
              className="hover:text-green-500 transition-colors duration-200"
              onClick={() => setShowDeleteDialog(true)}
            >
              <EllipsisVertical className="w-6 h-6" />
            </button>

            {showDeleteDialog && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 max-w-sm w-full m-4">
                  <h2 className="text-xl font-bold mb-4">Delete Post?</h2>
                  <p className="text-gray-400 mb-6">
                    This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                      onClick={() => setShowDeleteDialog(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PostCard;

import React, { useState, useEffect, useRef } from "react";
import PostCard from "./PostCard";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import useComment from "../../hooks/useComment";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../Store/authStore";
import Loader from "./Loader";

function Post() {
  const [newComment, setNewComment] = useState("");
  const { pid } = useParams();

  const [post, setPost] = useState(null);
  const authUser = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { comments, addComment } = useComment(pid);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/post/${pid}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setPost(response.data.post);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [pid]);

  const handleComment = () => {
    addComment(newComment, post);
    setNewComment("");
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [newComment]);

  if (!post) {
    return <Loader bool={!post} />;
  }

  return (
    <div className="max-w-2xl mx-auto mt-4 bg-black text-white">
      <h1
        className="
      ml-4
      text-xl
      font-bold
      flex
      pb-4
      items-center
      gap-2
      "
        onClick={() => {
          navigate(-1);
        }}
      >
        <ArrowLeftIcon className="h-6 w-6" /> Post
      </h1>
      <PostCard
        id={post._id}
        avatar={post?.postedBy?.profileImage}
        name={post?.postedBy?.name}
        username={post?.postedBy?.username}
        branch={post?.postedBy?.branch}
        section={post?.postedBy?.section}
        createdAt={post.createdAt}
        content={post.content}
        image={post.image}
        email={post.postedBy.email}
        comments={comments}
        likes={post.likes || []} // Ensure likes is always an array
        userId={authUser?._id}
      />
      <div className="mt-4 p-4 border-t border-gray-800">
        <div className="flex items-start mb-4 relative">
          <img
            src={post?.postedBy?.profileImage}
            alt="User"
            className="w-10 h-10 rounded-full mr-3"
          />
          <textarea
            ref={textareaRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Post your reply"
            className="flex-grow bg-transparent rounded-lg p-2 text-white resize-none focus:outline-none"
            rows="1"
            style={{ overflow: "hidden" }}
          />
          <button
            onClick={handleComment}
            className="bg-blue-500 text-white px-4 py-2 rounded-full ml-2"
          >
            Reply
          </button>
        </div>
        <div className="space-y-4">
          {comments.map((comment, index) => {
            console.log(comment);
            return (
              <div
                key={index}
                className="flex items-start py-3 border-t border-gray-800"
              >
                <img
                  src={comment?.postedBy?.profileImage}
                  alt={comment?.postedBy?.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-bold">
                    {comment?.postedBy?.username}{" "}
                    <span className="font-normal text-gray-500">
                      @{comment?.postedBy?.email.split("@")[0]}
                    </span>
                  </p>
                  <p>{comment?.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;

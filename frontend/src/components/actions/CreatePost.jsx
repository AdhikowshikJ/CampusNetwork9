import React, { useRef, useState, useEffect, useCallback } from "react";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useToast } from "../ui/use-toast"; // Update this path based on your file structure

const CreatePost = ({ handleClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const { toast } = useToast();

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Please select a valid image file.",
          variant: "success",
        });
      }
    },
    [toast]
  );

  const handleRemoveImage = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const handlePostSubmit = useCallback(async () => {
    if (!description.trim() && !selectedFile) {
      toast({
        title: "Please add content or an image before posting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imgUrl = "";

      if (selectedFile) {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", "campusnetwork");
        data.append("cloud_name", "campusn");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/campusn/image/upload",
          data
        );
        imgUrl = res.data.url;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const postRes = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/createpost`,
        {
          content: description.trim(),
          image: imgUrl,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: postRes.data.message || "Post created successfully.",
        variant: "success",
      });

      setSelectedFile(null);
      setDescription("");
      handleClose();
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Error creating post.",
        variant: "destructive",
      });

      setError(
        err.response?.data?.message ||
          "An error occurred while creating the post."
      );
    } finally {
      setLoading(false);
    }
  }, [description, selectedFile, handleClose, toast]);

  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(URL.createObjectURL(selectedFile));
      }
    };
  }, [selectedFile]);

  return (
    <div className="bg-black text-white p-4 rounded-lg shadow-xl max-w-xl">
      <textarea
        className="w-full bg-transparent text-white text-lg resize-none outline-none mb-4"
        rows="4"
        placeholder="What's happening?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {selectedFile && (
        <div className="relative mb-4">
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Selected Media"
            className="w-full h-auto rounded-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex justify-between items-center">
        <button
          onClick={() => inputRef.current?.click()}
          className="text-primary hover:bg-primary hover:bg-opacity-10 rounded-full p-2 transition duration-200"
        >
          <CameraIcon className="w-6 h-6" />
        </button>
        <input
          type="file"
          id="mediaInput"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          ref={inputRef}
        />
        <button
          className={`px-4 py-2 rounded-full font-bold ${
            description.trim() || selectedFile
              ? "bg-primary text-white"
              : "bg-primary bg-opacity-50 text-white cursor-not-allowed"
          } transition duration-200`}
          onClick={handlePostSubmit}
          disabled={(!description.trim() && !selectedFile) || loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;

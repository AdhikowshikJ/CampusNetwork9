const mongoose = require("mongoose");

// Define the Post schema
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false, // Optional if not always present
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "COMMENT", // Reference to a Comment model if comments are stored separately
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER", // Reference to a User model if likes are stored separately
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Post model
mongoose.model("POST", postSchema);

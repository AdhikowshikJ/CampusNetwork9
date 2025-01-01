const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "USER" },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "POST" },
  },
  {
    timestamps: true,
  }
);

mongoose.model("COMMENT", commentSchema);

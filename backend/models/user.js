const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    name: { type: String, trim: true },
    bio: { type: String, trim: true },
    branch: {
      type: String,
    },
    section: {
      type: String,
    },
    skills: [{ type: String, trim: true }],
    socialLinks: [
      {
        icon: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
    bioLinks: [
      {
        label: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    points: { type: Number, default: 0 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "USER" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "USER" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "POST" }],
    profileImage: {
      type: String,
      trim: true,
      default:
        "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg",
    },
    bannerImage: { type: String, trim: true },
  },
  { timestamps: true }
);

mongoose.model("USER", userSchema);

const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const POST = mongoose.model("POST");

// Get user by username
router.get("/getUserByName/:username", requireLogin, async (req, res) => {
  try {
    const user = await USER.findOne({ username: req.params.username })
      .select("-password") // Exclude password from the response
      .lean(); // Convert to a plain JavaScript object

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Count followers, following, and posts
    user.followerCount = user.followers ? user.followers.length : 0;
    user.followingCount = user.following ? user.following.length : 0;
    user.postCount = user.posts ? user.posts.length : 0;

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user by ID
router.get("/user/id/:id", requireLogin, async (req, res) => {
  try {
    const user = await USER.findById(req.params.id).select("-password").lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Count followers, following, and posts
    user.followerCount = user.followers ? user.followers.length : 0;
    user.followingCount = user.following ? user.following.length : 0;
    user.postCount = user.posts ? user.posts.length : 0;

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", requireLogin, async (req, res) => {
  try {
    const user = await USER.findById(req.user._id).select("-password").lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/searchUsers", requireLogin, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const users = await USER.find({
      $and: [
        {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { name: { $regex: query, $options: "i" } },
          ],
        },
        { _id: { $ne: req.user._id } }, // Exclude the logged-in user
      ],
    }).select("username name profileImage email branch section");

    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

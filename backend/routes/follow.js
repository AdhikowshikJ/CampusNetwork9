const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const mongoose = require("mongoose");
const USER = mongoose.model("USER");

// Follow route
router.put("/follow/:userId", requireLogin, async (req, res) => {
  const { userId } = req.params;
  console.log(`Attempting to follow user: ${userId}`);
  console.log(`Current user: ${req.user._id}`);

  if (userId === req.user._id.toString()) {
    console.log("Attempt to follow self");
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  try {
    const userToFollow = await USER.findById(userId);
    const currentUser = await USER.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    if (currentUser.following.includes(userId)) {
      console.log("Already following");
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    userToFollow.followers.push(req.user._id);
    currentUser.following.push(userId);

    await Promise.all([userToFollow.save(), currentUser.save()]);

    console.log("Follow successful");
    res.json(userToFollow);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Unfollow route
router.put("/unfollow/:userId", requireLogin, async (req, res) => {
  const { userId } = req.params;
  console.log(`Attempting to unfollow user: ${userId}`);
  console.log(`Current user: ${req.user._id}`);

  if (userId === req.user._id.toString()) {
    console.log("Attempt to unfollow self");
    return res.status(400).json({ error: "You cannot unfollow yourself" });
  }

  try {
    const userToUnfollow = await USER.findById(userId);
    const currentUser = await USER.findById(req.user._id);

    if (!userToUnfollow || !currentUser) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    if (!currentUser.following.includes(userId)) {
      console.log("Not following");
      return res.status(400).json({ error: "You are not following this user" });
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userId
    );

    await Promise.all([userToUnfollow.save(), currentUser.save()]);

    console.log("Unfollow successful");
    res.json(userToUnfollow);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;

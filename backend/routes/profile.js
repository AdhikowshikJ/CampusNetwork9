const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const mongoose = require("mongoose");
const User = mongoose.model("USER"); // Make sure the model name matches the one in your schema definition

// Update profile route
router.put("/updateProfile", requireLogin, async (req, res) => {
  const {
    name,
    username,
    bio,
    profileImage,
    bannerImage,
    skills,
    socialLinks,
    bioLinks,
    branch,
    section,
  } = req.body;
  console.log(socialLinks);

  try {
    // Find the user by ID (extracted from token by requireLogin middleware)
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user fields
    user.name = name || user.name;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.profileImage = profileImage || user.profileImage;
    user.bannerImage = bannerImage || user.bannerImage;
    user.skills = skills || user.skills;
    user.socialLinks = socialLinks || user.socialLinks;
    user.bioLinks = bioLinks || user.bioLinks;
    user.branch = branch || user.branch;
    user.section = section || user.section;

    // Save the updated user
    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/follow", requireLogin, async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    );
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.userId },
      },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    res.status(422).json({ error: err });
  }
});

router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    );
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.userId },
      },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    res.status(422).json({ error: err });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const COMMENT = mongoose.model("COMMENT");

router.get("/posts/:section", requireLogin, async (req, res) => {
  try {
    const { section } = req.params;
    let query = {};

    if (section !== "all") {
      // Find users of the specified section
      const usersInSection = await USER.find({ branch: section }).select("_id");
      const userIds = usersInSection.map((user) => user._id);

      // Add postedBy filter to query
      query.postedBy = { $in: userIds };
    }

    const posts = await POST.find(query)
      .populate(
        "postedBy",
        "_id username name profileImage branch section email"
      )
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    res.json({ posts });
  } catch (err) {
    console.error("Error fetching posts by section:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/foryouposts", requireLogin, async (req, res) => {
  try {
    const posts = await POST.find({}).populate(
      "postedBy",
      "_id username name profileImage branch section email"
    );
    res.json({ posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/followingposts", requireLogin, async (req, res) => {
  try {
    // Find the authenticated user's following list
    const user = await USER.findById(req.user._id).select("following");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch posts from users that the authenticated user follows
    const posts = await POST.find({ postedBy: { $in: user.following } })
      .populate(
        "postedBy",
        "_id username name profileImage branch section email"
      )
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/userposts/:username", requireLogin, async (req, res) => {
  try {
    const user = await USER.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await POST.find({ postedBy: user._id })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .populate("postedBy", "username name profileImage branch section email")
      .lean();

    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/createpost", requireLogin, async (req, res) => {
  const { content, image } = req.body;

  if (!content) {
    return res.status(422).json({ error: "Please add content" });
  }

  const post = new POST({
    content,
    image,
    postedBy: req.user,
  });

  try {
    // Save the post
    const result = await post.save();

    const today = new Date().toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format

    // Check if points have already been incremented today
    const user = await USER.findById(req.user._id);

    if (user.lastPostDate !== today) {
      const pointsForPost = 10; // Set the points for posting

      // Increment user points and update lastPostDate
      user.points += pointsForPost;
      user.lastPostDate = today;
      await user.save();
    }

    res.json({
      result: result,
      message: "Post created successfully",
      updatedPoints: user.points, // Return updated points if needed in response
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

// Update the like route
router.put("/like", requireLogin, async (req, res) => {
  try {
    const result = await POST.findByIdAndUpdate(
      req.body.postId,
      {
        $addToSet: { likes: req.user._id }, // Use $addToSet to prevent duplicate likes
      },
      { new: true }
    ).populate(
      "postedBy likes",
      "_id username name profileImag branch section email"
    );

    res.json(result);
  } catch (err) {
    res.status(422).json({ error: err });
  }
});

router.put("/unlike", requireLogin, async (req, res) => {
  try {
    const result = await POST.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    ).populate("postedBy likes", "_id username name email");

    res.json(result);
  } catch (err) {
    res.status(422).json({ error: err });
  }
});

// Create the comment route
router.post("/comments", requireLogin, async (req, res) => {
  const { content, postId } = req.body;
  console.log(req.body);

  if (!content) {
    return res.status(422).json({ error: "Please add content" });
  }

  const comment = new COMMENT({
    content,
    postedBy: req.user,
    postId,
  });

  try {
    const result = await comment.save();
    res.json({
      result: result,
      message: "Comment created successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/comments/:postId", requireLogin, async (req, res) => {
  try {
    const comments = await COMMENT.find({ postId: req.params.postId })
      .populate(
        "postedBy",
        "_id username name profileImage email branch section email"
      )
      .lean();
    res.json({ comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/post/:id", requireLogin, async (req, res) => {
  try {
    console.log(req.params.id);
    const post = await POST.findById(req.params.id)
      .populate(
        "postedBy",
        "_id username name profileImage branch section  email"
      )
      .populate(
        "comments.postedBy",
        "_id username name profileImage branch section email"
      )
      .lean();
    res.json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.delete("/deletepost/:postId", requireLogin, async (req, res) => {
  try {
    const post = await POST.findOne({ _id: req.params.postId });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Delete all comments for this post
    await COMMENT.deleteMany({ postId: req.params.postId });

    // Delete the post
    await post.deleteOne();

    // Decrement points by 1
    const user = await USER.findByIdAndUpdate(
      req.user._id,
      { $inc: { points: -1 } }, // Decrement points by 1
      { new: true }
    );

    res.json({
      message: "Post deleted successfully",
      updatedPoints: user.points, // Return updated points if needed in response
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

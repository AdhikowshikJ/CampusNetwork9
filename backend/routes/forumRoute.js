const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");

const FORUM_TOPIC = mongoose.model("FORUM");

// Get all forum topics
router.get("/forum-topics", requireLogin, async (req, res) => {
  try {
    const topics = await FORUM_TOPIC.find({})
      .populate("postedBy", "_id username name profileImage")
      .populate("replies.postedBy", "_id username name profileImage")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ topics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new forum topic
router.post("/forum-topics", requireLogin, async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content) {
    return res.status(422).json({ error: "Please add title and content" });
  }

  const topic = new FORUM_TOPIC({
    title,
    content,
    category,
    postedBy: req.user,
  });

  try {
    const result = await topic.save();
    console.log(result);
    res.json({
      topic: result,
      message: "Forum topic created successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Add a reply to a forum topic
router.post(
  "/forum-topics/:topicId/replies",
  requireLogin,
  async (req, res) => {
    const { content } = req.body;

    if (!content) {
      return res.status(422).json({ error: "Please add content" });
    }

    try {
      const result = await FORUM_TOPIC.findByIdAndUpdate(
        req.params.topicId,
        {
          $push: {
            replies: {
              content,
              postedBy: req.user._id,
            },
          },
        },
        { new: true }
      ).populate("replies.postedBy", "_id username name profileImage");

      res.json({
        reply: result.replies[result.replies.length - 1],
        message: "Reply added successfully",
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// Like a forum topic
router.post("/forum-topics/:topicId/like", requireLogin, async (req, res) => {
  try {
    const result = await FORUM_TOPIC.findByIdAndUpdate(
      req.params.topicId,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    ).populate("postedBy likes", "_id username name profileImage");

    res.json(result);
  } catch (err) {
    res.status(422).json({ error: err });
  }
});

// Like a reply in a forum topic
router.post(
  "/forum-topics/:topicId/replies/:replyId/like",
  requireLogin,
  async (req, res) => {
    try {
      const result = await FORUM_TOPIC.findOneAndUpdate(
        { _id: req.params.topicId, "replies._id": req.params.replyId },
        {
          $addToSet: { "replies.$.likes": req.user._id },
        },
        { new: true }
      ).populate(
        "replies.postedBy replies.likes",
        "_id username name profileImage"
      );

      res.json(result);
    } catch (err) {
      res.status(422).json({ error: err });
    }
  }
);

// Get a specific forum topic
router.get("/forum-topics/:topicId", requireLogin, async (req, res) => {
  try {
    const topic = await FORUM_TOPIC.findById(req.params.topicId)
      .populate("postedBy", "_id username name profileImage")
      .populate("replies.postedBy", "_id username name profileImage")
      .lean();
    res.json({ topic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

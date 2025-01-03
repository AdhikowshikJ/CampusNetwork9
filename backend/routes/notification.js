const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const USER = mongoose.model("USER");
const NOTIFICATION = mongoose.model("NOTIFICATION");
const UNREAD_NOTIFICATION_COUNT = mongoose.model("UNREAD_NOTIFICATION_COUNT");

// Create notification
router.post("/create", requireLogin, async (req, res) => {
  const { sender, receiver, type, post } = req.body;
  try {
    const notification = new NOTIFICATION({
      sender,
      receiver,
      type,
      post,
    });
    await notification.save();

    // Update or create unread count
    await UNREAD_NOTIFICATION_COUNT.findOneAndUpdate(
      { userId: receiver },
      { $inc: { count: 1 } },
      { upsert: true }
    );

    res.json({ notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get notifications and count
router.get("/", requireLogin, async (req, res) => {
  try {
    const notifications = await NOTIFICATION.find({ receiver: req.user._id })
      .populate("sender", "_id username name profileImage email")
      .lean();

    const unreadNotifications = notifications.filter((n) => !n.isRead);
    const readNotifications = notifications.filter((n) => n.isRead);

    // Get or create unread count
    let unreadCount = await UNREAD_NOTIFICATION_COUNT.findOne({
      userId: req.user._id,
    });

    if (!unreadCount) {
      unreadCount = await UNREAD_NOTIFICATION_COUNT.create({
        userId: req.user._id,
        count: unreadNotifications.length,
      });
    }

    res.json({
      unreadNotifications,
      readNotifications,
      unreadCount: unreadCount.count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mark single notification as read
router.put("/read", requireLogin, async (req, res) => {
  const { notificationId } = req.body;
  try {
    const notification = await NOTIFICATION.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (!notification.isRead) {
      notification.isRead = true;
      await notification.save();

      // Decrement unread count
      await UNREAD_NOTIFICATION_COUNT.findOneAndUpdate(
        { userId: req.user._id },
        { $inc: { count: -1 } }
      );
    }

    res.json({ notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mark all as read
router.put("/read-all", requireLogin, async (req, res) => {
  try {
    const unreadNotifications = await NOTIFICATION.find({
      receiver: req.user._id,
      isRead: false,
    });

    await NOTIFICATION.updateMany(
      { receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    // Reset unread count to 0
    await UNREAD_NOTIFICATION_COUNT.findOneAndUpdate(
      { userId: req.user._id },
      { count: 0 },
      { upsert: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

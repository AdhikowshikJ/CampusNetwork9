const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const USER = mongoose.model("USER");
const NOTIFICATION = mongoose.model("NOTIFICATION");

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
    res.json({ notification });
    console.log("created notfication");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.put("/read", requireLogin, async (req, res) => {
//   const { notificationId } = req.body;
//   try {
//     const user = await USER.findById(req.user._id);
//     const notification = await NOTIFICATION.findById(notificationId);
//     if (!notification) {
//       return res.status(404).json({ error: "Notification not found" });
//     }

//     notification.isRead = true;

//     await notification.save();

//     res.json({ notification });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.get("/", requireLogin, async (req, res) => {
  try {
    const user = await USER.findById(req.user._id);
    const notifications = await NOTIFICATION.find({ receiver: user._id })
      .populate("sender", "_id username name profileImage email")
      .lean();

    const unreadNotifications = notifications.filter((n) => !n.isRead);
    const readNotifications = notifications.filter((n) => n.isRead);

    console.log("unread", unreadNotifications);
    console.log("read", readNotifications);

    res.json({ unreadNotifications, readNotifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mark notification as read
router.put("/read", requireLogin, async (req, res) => {
  const { notificationId } = req.body;
  try {
    const notification = await NOTIFICATION.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    notification.isRead = true;
    const notificationa = await notification.save();
    console.log("executed");
    console.log(notificationa);
    res.json({ notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;

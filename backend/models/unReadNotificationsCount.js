// UnreadNotificationCount.js (Mongoose Model)
const mongoose = require("mongoose");

const unreadNotificationCountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model(
  "UNREAD_NOTIFICATION_COUNT",
  unreadNotificationCountSchema
);

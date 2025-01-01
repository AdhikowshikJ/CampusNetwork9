const express = require("express");
const {
  findChat,
  createChat,
  userChats,
  findMutualFollowers,
} = require("../controllers/chatController");
const requireLogin = require("../middleware/requireLogin");
const router = express.Router();

router.post("/", createChat);
router.get("/:userId", requireLogin, userChats);
router.get("/find/:firstId/:secondId", requireLogin, findChat);
router.get("/mutualFollowers/:userId", requireLogin, findMutualFollowers);

module.exports = router;

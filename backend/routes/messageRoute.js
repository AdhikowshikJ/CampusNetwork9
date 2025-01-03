const express = require("express");
const {
  addMessage,
  getMessages,
  getLastMessage,
} = require("../controllers/messageController");
const router = express.Router();

router.post("/", addMessage);
router.get("/:chatId", getMessages);
router.get("/:chatId/last", getLastMessage);

module.exports = router;

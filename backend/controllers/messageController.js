const mongoose = require("mongoose");
const MessageModel = mongoose.model("MESSAGE");

exports.addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getLastMessage = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.findOne({ chatId })
      .sort({ createdAt: -1 })
      .limit(1);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const mongoose = require("mongoose");
const User = mongoose.model("USER");
const Conversation = mongoose.model("CONVERSATION");

exports.createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        members: [senderId, receiverId],
      });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.userChats = async (req, res) => {
  try {
    const chats = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).populate({
      path: "members",
      select: "username profileImage name", // Choose the fields you need
    });
    console.log(chats);

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.findChats = async (req, res) => {
  try {
    const chat = await Conversation.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    }).populate({
      path: "members",
      select: "username profileImage name", // Choose the fields you need
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.findChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.params;
    const chat = await Conversation.findOne({
      members: { $all: [firstId, secondId] },
    }).populate({
      path: "members",
      select: "username profileImage name", // Choose the fields you need
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.findMutualFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("followers");
    const mutualFollowers = user.followers.filter((follower) =>
      follower.following.includes(req.params.userId)
    );
    res.status(200).json({ mutualFollowers });
  } catch (error) {
    res.status(500).json(error);
  }
};

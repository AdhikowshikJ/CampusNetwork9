const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CONVERSATION", // Referencing the CONVERSATION schema
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER", // Referencing the USER schema
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model("MESSAGE", MessageSchema);

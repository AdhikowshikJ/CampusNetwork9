const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER", // Referencing the USER schema
      },
    ],
  },
  {
    timestamps: true,
  }
);

mongoose.model("CONVERSATION", conversationSchema);

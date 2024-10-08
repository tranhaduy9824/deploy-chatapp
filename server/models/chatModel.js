const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: Array,
    notificationsEnabled: {
      type: Map,
      of: Boolean,
      default: {},
    },
    nicknames: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        nickname: {
          type: String,
          trim: true,
        },
      },
    ],
    pinnedMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;

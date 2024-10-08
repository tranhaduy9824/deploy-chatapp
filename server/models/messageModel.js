const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: String,
    senderId: String,
    text: String,
    mediaUrl: {
      type: String,
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "file", "call"],
      default: "text",
    },
    reactions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reaction: {
          type: String,
        },
      },
    ],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    callDuration: {
      type: Number,
      default: null,
    },
    infoFile: {
      name: {
        type: String,
        default: null,
      },
      size: {
        type: Number,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;

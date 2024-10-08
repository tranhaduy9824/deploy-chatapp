const messageModel = require("../models/messageModel");
const cloudinary = require("../config/cloudinaryConfig");
const chatModel = require("../models/chatModel");

const createMessage = async (req, res) => {
  const senderId = req.userData._id;
  const { chatId, text } = req.body;
  const file = req.file;

  let fileUrl = "";
  let fileType = "text";
  let fileName = "";
  let fileSize = 0;

  try {
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
      });

      fileUrl = uploadResult.secure_url;
      fileType =
        uploadResult.resource_type === "image"
          ? "image"
          : uploadResult.resource_type === "video"
          ? "video"
          : "file";
      fileName = file.originalname;
      fileSize = file.size;
    }

    const message = new messageModel({
      chatId,
      senderId,
      text: text || "",
      mediaUrl: fileUrl,
      type: fileType,
      infoFile: {
        name: fileName,
        size: fileSize,
      },
    });

    const response = await message.save();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const userId = req.userData._id;

  try {
    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.members.includes(userId.toString())) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await messageModel
      .find({ chatId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("replyTo");

    const totalMessages = await messageModel.countDocuments({ chatId });

    return res.status(200).json({
      messages,
      hasMore: totalMessages > page * limit,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const reactToMessage = async (req, res) => {
  const { messageId } = req.params;
  const { reaction } = req.body;
  const userId = req.userData._id;

  try {
    const message = await messageModel.findById(messageId);

    if (!message) return res.status(404).json("Message not found");

    const existingReaction = message.reactions.find(
      (r) => r.userId.toString() === userId
    );

    if (existingReaction) {
      existingReaction.reaction = reaction;
    } else {
      message.reactions.push({ userId, reaction });
    }

    await message.save();
    return res
      .status(200)
      .json({ message: "Reaction updated", messageUpdate: message });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const replyToMessage = async (req, res) => {
  const { messageId } = req.params;
  const { text } = req.body;
  const userId = req.userData._id;
  const file = req.file;

  let fileUrl = "";
  let fileType = "text";

  try {
    const originalMessage = await messageModel.findById(messageId);

    if (!originalMessage)
      return res.status(404).json("Original message not found");

    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
      });

      fileUrl = uploadResult.secure_url;
      fileType =
        uploadResult.resource_type === "image"
          ? "image"
          : uploadResult.resource_type === "video"
          ? "video"
          : "file";
    }

    const newMessage = new messageModel({
      chatId: originalMessage.chatId,
      senderId: userId,
      text: text || "",
      mediaUrl: fileUrl,
      type: fileType,
      replyTo: messageId,
    });

    await newMessage.populate("replyTo");

    await newMessage.save();
    return res.status(200).json({ message: "Reply sent", newMessage });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const deleteMessage = async (req, res) => {
  const messageId = req.params.messageId;
  const userId = req.userData._id;

  try {
    const message = await messageModel.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this message" });
    }

    await messageModel.findByIdAndDelete(messageId);

    return res.status(200).json({ message: "Message deleted", messageId });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const editMessage = async (req, res) => {
  const messageId = req.params.messageId;
  const userId = req.userData._id;
  const { text } = req.body;

  try {
    const message = await messageModel.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this message" });
    }

    message.text = text;
    await message.save();

    return res.status(200).json({ message: "Message edited", message });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const createCallMessage = async (
  chatId,
  senderId,
  callType,
  callStatus,
  callDuration = null
) => {
  try {
    const message = new messageModel({
      chatId,
      senderId,
      text: `${callType} call ${callStatus}`,
      type: "call",
      callDuration,
    });

    const savedMessage = await message.save();
    return savedMessage;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createMessage,
  getMessages,
  reactToMessage,
  replyToMessage,
  deleteMessage,
  editMessage,
  createCallMessage,
};

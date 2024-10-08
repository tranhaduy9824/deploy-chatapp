const chatModel = require("../models/chatModel");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) {
      return res.status(200).json(chat);
    }

    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });

    return res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });

    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const addMemberToChat = async (req, res) => {
  const chatId = req.params.chatId;
  const { userId } = req.body;

  try {
    const chat = await chatModel.findById(chatId);

    if (!chat) return res.status(404).json("Chat not found");

    if (chat.members.includes(userId))
      return res.status(400).json("User already in chat");

    chat.members.push(userId);
    await chat.save();

    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const removeMemberFromChat = async (req, res) => {
  const chatId = req.params.chatId;
  const { userId } = req.body;

  try {
    const chat = await chatModel.findById(chatId);

    if (!chat) return res.status(404).json("Chat not found");

    chat.members = chat.members.filter(
      (member) => member.toString() !== userId
    );
    await chat.save();

    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const pinMessage = async (req, res) => {
  const chatId = req.params.chatId;
  const { messageId } = req.body;

  try {
    const chat = await chatModel.findById(chatId);

    if (!chat) return res.status(404).json("Chat not found");

    if (chat.pinnedMessages.includes(messageId))
      return res.status(400).json("Message already pinned");

    chat.pinnedMessages.push(messageId);
    await chat.save();

    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const unpinMessage = async (req, res) => {
  const chatId = req.params.chatId;
  const { messageId } = req.body;

  try {
    const chat = await chatModel.findById(chatId);

    if (!chat) return res.status(404).json("Chat not found");

    chat.pinnedMessages = chat.pinnedMessages.filter(
      (id) => id.toString() !== messageId
    );
    await chat.save();

    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const blockUser = async (req, res) => {
  const chatId = req.params.chatId;
  const { userId } = req.body;

  try {
    const chat = await chatModel.findById(chatId);

    if (!chat) return res.status(404).json("Chat not found");

    if (chat.blockedUsers.includes(userId))
      return res.status(400).json("User already blocked");

    chat.blockedUsers.push(userId);
    await chat.save();

    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const unblockUser = async (req, res) => {
  const chatId = req.params.chatId;
  const { userId } = req.body;

  try {
    const chat = await chatModel.findById(chatId);

    if (!chat) return res.status(404).json("Chat not found");

    chat.blockedUsers = chat.blockedUsers.filter(
      (id) => id.toString() !== userId
    );
    await chat.save();

    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const updateNickname = async (req, res) => {
  const chatId = req.params.chatId;
  const { userId, nickname } = req.body;

  try {
    const chat = await chatModel.findById(chatId);

    if (!chat) return res.status(404).json("Chat not found");

    const existingNickname = chat.nicknames.find(
      (n) => n.userId.toString() === userId
    );

    if (existingNickname) {
      existingNickname.nickname = nickname;
    } else {
      chat.nicknames.push({ userId, nickname });
    }

    await chat.save();

    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const enableNotifications = async (req, res) => {
  const chatId = req.params.chatId;
  const { userId } = req.body;

  try {
    const chat = await chatModel.findById(chatId);

    if (!chat) return res.status(404).json("Chat not found");

    chat.notificationsEnabled.set(userId, true);
    await chat.save();

    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const disableNotifications = async (req, res) => {
  const chatId = req.params.chatId;
  const { userId } = req.body;

  try {
    const chat = await chatModel.findById(chatId);

    if (!chat) return res.status(404).json("Chat not found");

    chat.notificationsEnabled.set(userId, false);
    await chat.save();

    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

module.exports = {
  createChat,
  findUserChats,
  findChat,
  addMemberToChat,
  removeMemberFromChat,
  pinMessage,
  unpinMessage,
  blockUser,
  unblockUser,
  updateNickname,
  enableNotifications,
  disableNotifications,
};

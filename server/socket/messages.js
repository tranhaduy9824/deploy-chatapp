const handleSendMessage = (io, socket, onlineUsers) => {
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotifications", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });
};

const handleReactToMessage = (io, socket, onlineUsers) => {
  socket.on("reactToMessage", (reactionData) => {
    const { messageId, reaction, members } = reactionData;

    if (Array.isArray(members)) {
      members.forEach((userId) => {
        const user = onlineUsers.find((user) => user.userId === userId);
        if (user) {
          io.to(user.socketId).emit("messageReaction", {
            messageId,
            reaction,
            senderId: userId,
          });
        }
      });
    } else {
      console.error("Members list is not defined or not an array.");
    }
  });
};

const handleReplyToMessage = (io, socket, onlineUsers) => {
  socket.on("replyToMessage", (replyData) => {
    const { message, members } = replyData;

    if (Array.isArray(members)) {
      members.forEach((userId) => {
        const user = onlineUsers.find((user) => user.userId === userId);
        if (user) {
          io.to(user.socketId).emit("messageReply", message);
          io.to(user.socketId).emit("getNotifications", {
            senderId: message.senderId,
            isRead: false,
            date: new Date(),
          });
        }
      });
    } else {
      console.error("Members list is not defined or not an array.");
    }
  });
};

const handleDeleteMessage = (io, socket, onlineUsers) => {
  socket.on("deleteMessage", (deleteData) => {
    const { messageId, members } = deleteData;

    if (Array.isArray(members)) {
      members.forEach((userId) => {
        const user = onlineUsers.find((user) => user.userId === userId);
        if (user) {
          io.to(user.socketId).emit("messageDeleted", messageId);
        }
      });
    } else {
      console.error("Members list is not defined or not an array.");
    }
  });
};

const handleEditMessage = (io, socket, onlineUsers) => {
  socket.on("editMessage", (editData) => {
    const { messageId, text, members } = editData;

    if (Array.isArray(members)) {
      members.forEach((userId) => {
        const user = onlineUsers.find((user) => user.userId === userId);
        if (user) {
          io.to(user.socketId).emit("messageEdited", { messageId, text });
        }
      });
    } else {
      socket.emit("error", {
        message: "Members list is not defined or not an array.",
      });
    }
  });
};

const handleTyping = (io, socket, onlineUsers) => {
  socket.on("typing", (data) => {
    const { chatId, userId, members } = data;
    
    if (Array.isArray(members)) {
      members.forEach((memberId) => {
        if (memberId !== userId) {
          const user = onlineUsers.find((user) => user.userId === memberId);
          if (user) {
            io.to(user.socketId).emit("typing", { userId, chatId });
          }
        }
      });
    } else {
      socket.emit("error", {
        message: "Members list is not defined or not an array.",
      });
    }
  });

  socket.on("stopTyping", (data) => {
    const { chatId, userId, members } = data;

    if (Array.isArray(members)) {
      members.forEach((memberId) => {
        if (memberId !== userId) {
          const user = onlineUsers.find((user) => user.userId === memberId);
          if (user) {
            io.to(user.socketId).emit("stopTyping", { userId, chatId });
          }
        }
      });
    } else {
      socket.emit("error", {
        message: "Members list is not defined or not an array.",
      });
    }
  });
};

module.exports = {
  handleSendMessage,
  handleReactToMessage,
  handleReplyToMessage,
  handleDeleteMessage,
  handleEditMessage,
  handleTyping,
};

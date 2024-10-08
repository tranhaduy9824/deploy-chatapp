const handleUserConnection = (io, socket, onlineUsers) => {
  socket.on("addNewUser", (userId) => {
    if (!userId) {
      return;
    }

    const existingUserIndex = onlineUsers.findIndex(
      (user) => user.userId === userId
    );

    if (existingUserIndex !== -1) {
      onlineUsers[existingUserIndex].socketId = socket.id;
    } else {
      onlineUsers.push({ userId, socketId: socket.id });
    }

    console.log("onlineUsers", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
};

const handleUserDisconnection = (io, socket, onlineUsers) => {
  socket.on("disconnect", () => {
    console.log("Disconnected", socket.id);
    
    const userIndex = onlineUsers.findIndex((user) => user.socketId === socket.id);
    if (userIndex !== -1) {
      onlineUsers.splice(userIndex, 1);
    }

    console.log("onlineUsers", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
};

module.exports = {
  handleUserConnection,
  handleUserDisconnection,
};

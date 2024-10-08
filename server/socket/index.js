const { Server } = require("socket.io");
const { handleUserConnection, handleUserDisconnection } = require("./users");
const {
  handleSendMessage,
  handleReactToMessage,
  handleReplyToMessage,
  handleDeleteMessage,
  handleEditMessage,
  handleTyping,
} = require("./messages");
const { handleVideoCall } = require("./call");

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5000",
      methods: ["GET", "POST"],
    },
  });

  let onlineUsers = [];

  io.on("connection", (socket) => {
    console.log("New connection", socket.id);

    handleUserConnection(io, socket, onlineUsers);
    handleSendMessage(io, socket, onlineUsers);
    handleReactToMessage(io, socket, onlineUsers);
    handleReplyToMessage(io, socket, onlineUsers);
    handleDeleteMessage(io, socket, onlineUsers);
    handleEditMessage(io, socket, onlineUsers);
    handleVideoCall(io, socket, onlineUsers);
    handleUserDisconnection(io, socket, onlineUsers);
    handleTyping(io, socket, onlineUsers);
  });

  const socketPort = 3000;
  io.listen(socketPort);
};

module.exports = socketHandler;

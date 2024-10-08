const messageController = require("../controllers/messageController");
const User = require("../models/userModel");

const activeCalls = new Set();
const callStartTimes = new Map();
const callInitiators = new Map();

const handleVideoCall = (io, socket, onlineUsers) => {
  socket.on(
    "startCall",
    async ({ chatId, userId, members, offer, canNotAccept = false }) => {
      try {
        if (!Array.isArray(members)) {
          socket.emit("error", {
            message: "Members list is not defined or not an array.",
          });
          return;
        }

        console.log(
          "Starting call",
          userId,
          members,
          activeCalls,
          canNotAccept
        );

        const callerOnline = onlineUsers.find((user) => user.userId === userId);
        if (!callerOnline) {
          return;
        }

        const caller = await User.findById(userId).select("fullname avatar");
        if (!caller) {
          return;
        }

        const isAnyMemberInCall = members.some(
          (member) =>
            activeCalls.has(member) && !members.every((m) => activeCalls.has(m))
        );

        if (isAnyMemberInCall) {
          io.to(callerOnline.socketId).emit("activeCalls", {
            activeCalls: Array.from(activeCalls),
          });
          return;
        }

        members.forEach((member) => {
          if (member !== userId) {
            const recipient = onlineUsers.find(
              (user) => user.userId === member
            );
            if (recipient) {
              io.to(recipient.socketId).emit("incomingCall", {
                chatId,
                callerId: userId,
                callerName: caller.fullname,
                callerAvatar: caller.avatar,
                offer,
                members,
                canNotAccept,
              });
            }
          }
        });

        members.forEach((member) => activeCalls.add(member));
        callStartTimes.set(chatId, Date.now());
        if (!callInitiators.has(chatId)) {
          callInitiators.set(chatId, userId);
        }
      } catch (error) {
        console.error("Error handling startCall:", error);
      }
    }
  );

  socket.on("answerCall", async ({ chatId, userId, members, answer }) => {
    try {
      if (!Array.isArray(members)) {
        socket.emit("error", {
          message: "Members list is not defined or not an array.",
        });
        return;
      }

      console.log("Answering call", userId, members);

      members.forEach((member) => {
        if (member !== userId) {
          const caller = onlineUsers.find((user) => user.userId === member);
          if (caller) {
            io.to(caller.socketId).emit("callAnswered", { answer });
          }
        }
      });
    } catch (error) {
      console.error("Error handling answerCall:", error);
    }
  });

  socket.on("iceCandidate", ({ candidate, chatId, members }) => {
    try {
      if (!Array.isArray(members)) {
        socket.emit("error", {
          message: "Members list is not defined or not an array.",
        });
        return;
      }

      members.forEach((member) => {
        const recipient = onlineUsers.find((user) => user.userId === member);
        if (recipient) {
          io.to(recipient.socketId).emit("iceCandidate", candidate);
        }
      });
    } catch (error) {
      console.error("Error handling iceCandidate:", error);
    }
  });

  socket.on("endCall", async ({ chatId, userId, members, createMessage }) => {
    try {
      if (!Array.isArray(members)) {
        socket.emit("error", {
          message: "Members list is not defined or not an array.",
        });
        return;
      }

      const isAnyMemberInCall = members.some(
        (member) =>
          activeCalls.has(member) && !members.every((m) => activeCalls.has(m))
      );

      if (isAnyMemberInCall) {
        socket.emit("error", {
          message:
            "Cannot start call. One or more members are already in a call.",
        });
        return;
      }

      console.log(createMessage);
      console.log("Ending call");

      members.forEach((member) => {
        const recipient = onlineUsers.find((user) => user.userId === member);
        if (recipient) {
          io.to(recipient.socketId).emit("callEnded");
        }
        activeCalls.delete(member);
      });

      if (createMessage) {
        const startTime = callStartTimes.get(chatId);
        const callDuration = startTime
          ? Math.floor((Date.now() - startTime) / 1000)
          : null;
        const callerId = callInitiators.get(chatId);
        console.log("callDuration", callDuration, callerId);
        const callMessage = await messageController.createCallMessage(
          chatId,
          callerId,
          "Video",
          "ended",
          callDuration
        );
        callStartTimes.delete(chatId);
        callInitiators.delete(chatId);

        members.forEach((member) => {
          const recipient = onlineUsers.find((user) => user.userId === member);
          if (recipient) {
            io.to(recipient.socketId).emit("getMessage", callMessage);
          }
        });
      }
    } catch (error) {
      console.error("Error handling endCall:", error);
    }
  });

  socket.on(
    "rejectCall",
    async ({ chatId, userId, members, showNotificateReject = true }) => {
      try {
        if (!Array.isArray(members)) {
          socket.emit("error", {
            message: "Members list is not defined or not an array.",
          });
          return;
        }

        members.forEach((member) => {
          if (showNotificateReject && member !== userId) {
            const recipient = onlineUsers.find(
              (user) => user.userId === member
            );
            if (recipient) {
              io.to(recipient.socketId).emit("callRejected");
            }
          }
          activeCalls.delete(member);
        });

        const startTime = callStartTimes.get(chatId);
        const callDuration = startTime
          ? Math.floor((Date.now() - startTime) / 1000)
          : null;
        const callerId = callInitiators.get(chatId);
        const callMessage = await messageController.createCallMessage(
          chatId,
          callerId,
          "Video",
          "missed",
          callDuration
        );
        callStartTimes.delete(chatId);
        callInitiators.delete(chatId);

        members.forEach((member) => {
          const recipient = onlineUsers.find((user) => user.userId === member);
          if (recipient) {
            io.to(recipient.socketId).emit("getMessage", callMessage);
          }
        });
      } catch (error) {
        console.error("Error handling rejectCall:", error);
      }
    }
  );
};

module.exports = {
  handleVideoCall,
};

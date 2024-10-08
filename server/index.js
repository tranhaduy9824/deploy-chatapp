const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const socketHandler = require("./socket");

const app = express();
const server = http.createServer(app);

const assetsDir = path.join(__dirname, "assets");
const uploadsDir = path.join(__dirname, "uploads");

app.use("/assets", express.static(assetsDir));
app.use("/uploads", express.static(uploadsDir));

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

const currentDirectory = path.resolve();
app.use(express.static(path.join(currentDirectory, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(currentDirectory, "client", "dist", "index.html"));
});

app.get("/", (req, res) => {
  res.send("Welcome our web...");
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

server.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});

socketHandler(server);

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connection established"))
  .catch((err) => console.log("MongoDB connection failed: ", err.message));

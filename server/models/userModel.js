const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    avatar: {
      type: String,
      required: true,
      default: "../assets/avatar_default.png",
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

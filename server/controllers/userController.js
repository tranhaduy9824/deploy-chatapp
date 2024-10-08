const userModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const path = require("path");

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (user)
      return res.status(400).json("User with the given email already exist...");

    if (!fullname || !email || !password)
      return res.status(400).json("All fields are required...");

    if (!validator.isEmail(email))
      return res.status(400).json("Email must be a valid email...");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password must be a strong password...");

    const avatarPath = path.join("assets", "avatar_default.png");

    user = new userModel({ fullname, email, password, avatar: avatarPath });

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    return res.status(200).json({ _id: user._id, fullname, email, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("Invalid email or password");

    const isValidPassword = await bcryptjs.compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).json("Invalid email or password");

    const token = createToken(user._id);

    return res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const updateAvatar = async (req, res) => {
  const userId = req.userData._id;
  const avatar = req.file.path;

  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    );

    if (!user) return res.status(404).json("User not found");

    return res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  const userId = req.userData._id;
  const { fullname, email, currentPassword, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      return res.status(400).json("Email is already taken by another user");
    }

    const updateFields = { fullname, email };

    if (password) {
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json("User not found");
      }

      const isValidPassword = await bcryptjs.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(400).json("Current password is incorrect");
      }

      if (!validator.isStrongPassword(password)) {
        return res.status(400).json("Password must be a strong password...");
      }

      const salt = await bcryptjs.genSalt(10);
      updateFields.password = await bcryptjs.hash(password, salt);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json("User not found");
    }

    return res.status(200).json({
      fullname: updatedUser.fullname,
      email: updatedUser.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  updateAvatar,
  updateUser,
};

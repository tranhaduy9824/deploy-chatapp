const express = require("express");
const multer = require("multer");
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  updateAvatar,
  updateUser,
} = require("../controllers/userController");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);
router.patch("/avatar", checkAuth, upload.single("avatar"), updateAvatar);
router.patch("/", checkAuth, updateUser);

module.exports = router;

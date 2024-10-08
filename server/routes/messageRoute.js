const express = require("express");
const {
  createMessage,
  getMessages,
  reactToMessage,
  replyToMessage,
  deleteMessage,
  editMessage
} = require("../controllers/messageController");
const checkAuth = require("../middleware/check-auth");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/", checkAuth, upload.single("file"), createMessage);
router.get("/:chatId", checkAuth, getMessages);
router.patch("/react/:messageId", checkAuth, reactToMessage);
router.post(
  "/reply/:messageId",
  checkAuth,
  upload.single("file"),
  replyToMessage
);
router.delete("/:messageId", checkAuth, deleteMessage);
router.patch("/edit/:messageId", checkAuth, editMessage);

module.exports = router;

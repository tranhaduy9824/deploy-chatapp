const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowedFormats: ["jpg", "png", "jpeg", "gif", "mp4", "pdf"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

module.exports = upload;

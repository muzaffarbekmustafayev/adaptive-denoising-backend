const multer = require("multer");
const path = require("path");
const fs = require("fs");
const env = require("../config/env");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), env.UPLOAD_DIR, "input");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["audio/wav", "audio/mpeg", "audio/mp4", "audio/webm", "audio/x-wav", "audio/ogg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only WAV, MP3, MP4, and WEBM audio are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: (env.MAX_AUDIO_FILE_MB || 50) * 1024 * 1024
  }
});

module.exports = upload;

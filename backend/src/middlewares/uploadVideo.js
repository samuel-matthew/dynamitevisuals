import multer from "multer";

const uploadVideo = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files allowed"), false);
    }
  },
});

export default uploadVideo;

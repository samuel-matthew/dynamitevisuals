import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files allowed"), false);
  }
};

const uploadMedia = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // max 100MB (video cap)
  },
});

export default uploadMedia;

const multer = require("multer");

//file storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./recipeImages");
  },
  filename: (req, file, cb) => {
    const fileName = `image-${Date.now()}.${file.originalname}`;
    cb(null, fileName);
  },
});

//File type filter

const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only jpeg, png and jpg formats allowed"));
  }
};

const recipeUpload = multer({
  storage: storage,
  fileFilter: filefilter,
});

module.exports = recipeUpload;

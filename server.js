const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");

const port = process.env.PORT || 8080;
const fs = require("fs");
// viewed at http://localhost:8080
app.use(
  express.static(path.join(__dirname, "public"), {
    extensions: ["html"],
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

app.post("/video", upload.single("image"), (req, res) => {
  try {
    return res.status(201).json({
      message: "File uploded successfully",
    });
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

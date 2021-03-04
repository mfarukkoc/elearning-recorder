const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const multer = require("multer");
const bodyparser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const port = process.env.PORT || 8080;

// viewed at http://localhost:8080
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(
  express.static(path.join(__dirname, "public"), {
    extensions: ["html"],
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/${req.id}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    console.log("request comes with ", req.id);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "video/webm" || file.mimetype === "application/json") {
    console.log("filter success");
    cb(null, true);
  } else {
    console.log("filter failed");
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([
  { name: "video", maxCount: 1 },
  { name: "metadata", maxCount: 1 },
]);

app.post("/video", async (req, res) => {
  try {
    req.id = uuidv4();
    upload(req, res, (err) => console.log(err));
    return res.status(201).json({
      message: "File uploded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "File uploded successfully",
    });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

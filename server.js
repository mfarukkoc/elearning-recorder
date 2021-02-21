const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 8080;
const fs = require("fs");
// viewed at http://localhost:8080
app.use(
  express.static(path.join(__dirname, "public"), {
    extensions: ["html"],
  })
);

// Video POST handler.
app.post("/video", function (req, res) {
  upload_video(req, function(err, data) {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }

    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

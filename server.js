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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

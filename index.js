require("dotenv").config();
const express = require("express");
const app = express();

app.listen(8181, () => {
  console.log("server listening on 8181");
});

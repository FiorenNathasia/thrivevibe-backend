require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRouter = require("./routes/auth");

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);

app.listen(8181, () => {
  console.log("server listening on 8181");
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const videoRouter = require("./routes/videos");
const commentsRouter = require("./routes/comments");
const feedRouter = require("./routes/feed");
const verify = require("./middleware/verify");

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);

app.use(verify);

app.use("/api/user", userRouter);
app.use("/api/videos", videoRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/feed", feedRouter);

const port = process.env.PORT || 8181;
app.listen(port, () => {
  console.log(`server listening on ${port}`);
});

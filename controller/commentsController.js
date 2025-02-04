const db = require("../db/db");

//POST request for comments
const createComment = async (req, res) => {
  const userId = res.locals.userId;
  const videoId = req.params.id;
  const { comments } = req.body;
  if (!comments) {
    res.status(400).send({ message: "Please fill in all fields" });
  }

  try {
    const [{ id }] = await db("comments")
      .insert({ user_id: userId, video_id: videoId, comments })
      .returning("id");

    const insertedComment = await db("comments").where({ id }).first();
    res.status(201).send(insertedComment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment" });
  }
};
//GET request for all comments for a video
const getComments = async (req, res) => {
  const userId = res.locals.userId;
  const videoId = req.params.id;

  if (!videoId) {
    res.status(400).send({ message: "Video ID is required" });
  }

  try {
    const video = await db("videos")
      .where({ id: videoId, user_id: userId })
      .select()
      .first();

    if (!video) {
      res.status(404).send({ message: "Video not found" });
    }
  } catch (error) {
    res.status(500).send({ message: `Error retrieving video: ${error}` });
    return;
  }
  try {
    const comments = await db("comments")
      .where({ video_id: videoId })
      .select("*");
    res.status(200).send(comments);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving comments" });
  }
};
module.exports = {
  createComment,
  getComments,
};

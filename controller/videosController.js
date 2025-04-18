const db = require("../db/db");

//POST request for new feature
const newVideo = async (req, res) => {
  const { url, prompt } = req.body;

  if (!url || !prompt) {
    res.status(400).send({ message: "Please fill in all fields" });
  }
  const userId = res.locals.userId;
  try {
    const newEntry = await db("videos")
      .insert({
        user_id: userId,
        url,
        prompt,
      })
      .returning("*");
    return res.status(200).send({ data: newEntry[0] });
  } catch (error) {
    c;
  }
};

//GET request for user's videos/
const getVideos = async (req, res) => {
  const userId = res.locals.userId;
  try {
    const videos = await db("videos").where({ user_id: userId }).select();
    res.status(200).send({ data: videos });
  } catch (error) {
    res.status(400).send({ message: "There was an error retrieving videos." });
  }
};

//GET request for user's videos/
const getVideo = async (req, res) => {
  const userId = res.locals.userId;
  const videoId = req.params.id;
  try {
    const video = await db("videos")
      .where({ id: videoId, user_id: userId })
      .select()
      .first();
    res.status(200).send({ data: video });
    if (!video) {
      throw new Error("Cannot find workout.");
    }
  } catch (error) {
    res.status(400).send({ message: "There was an error retrieving video." });
  }
};

//PUT request for upvote
const updateUpvote = async (req, res) => {
  const videoId = req.params.id;
  try {
    const video = await db("videos").where({ id: videoId }).first();
    if (!video) {
      res.status(404).send({ message: `Video with ID ${videoId} not found` });
    }

    await db("videos").where({ id: videoId }).increment("upvote", 1);
    const updatedVideo = await db("videos").where({ id: videoId }).first();
    res.status(200).send({ data: updatedVideo });
  } catch (error) {
    res.status(500).send({ message: `Error updating upvote count` });
  }
};

//PUT request for downvote
const updateDownvote = async (req, res) => {
  const videoId = req.params.id;
  try {
    const video = await db("videos").where({ id: videoId }).first();
    if (!video) {
      res.status(404).send({ message: `Video with ID ${videoId} not found` });
    }

    await db("videos").where({ id: videoId }).increment("downvote", 1);
    const updatedVideo = await db("videos").where({ id: videoId }).first();
    res.status(200).send({ data: updatedVideo });
  } catch (error) {
    res.status(500).send({ message: `Error updating upvote count` });
  }
};

const editVideo = async (req, res) => {
  const userId = res.locals.userId;
  const videoId = req.params.id;
  const videoUpdates = req.body;
  try {
    const video = await db("videos")
      .where({ id: videoId, user_id: userId })
      .first();

    if (!video) {
      throw new Error("Cannot find entry");
    }

    await db("videos")
      .where({ id: videoId, user_id: userId })
      .update(videoUpdates);
    res.status(200).send({ message: "Video edited successfully!" });
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "The error occured while editing video!" });
  }
};

const deleteVideo = async (req, res) => {
  const userId = res.locals.userId;
  const videoId = req.params.id;

  try {
    const video = await db("videos")
      .where({ id: videoId, user_id: userId })
      .first();

    if (!video) {
      throw new Error("Cannot find entry!");
    }
    const deletedVideo = await db("videos").where({ id: videoId }).del();

    res.status(200).send({ message: "Video deleted successfully!" });
  } catch (error) {
    res.status(404).send({ message: "There was an error deleting video!" });
  }
};

module.exports = {
  newVideo,
  getVideos,
  getVideo,
  updateUpvote,
  updateDownvote,
  editVideo,
  deleteVideo,
};

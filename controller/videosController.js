const db = require("../db/db");
const axios = require("axios");
const chatgpt = require("../utils/openai");

//POST request for new feature
const newVideo = async (req, res) => {
  const { url, prompt } = req.body;

  if (!url || !prompt) {
    res.status(400).send({ message: "Please fill in all fields" });
  }

  const userId = res.locals.userId;
  try {
    const videoData = await axios.get(
      "https://api.supadata.ai/v1/youtube/video?id=" + url,
      {
        headers: {
          "x-api-key": process.env.SUPADATA_KEY,
        },
      }
    );

    const thumbnail = videoData.data.thumbnail;
    const newEntry = await db("videos")
      .insert({
        user_id: userId,
        url,
        prompt,
        thumbnail,
      })
      .returning("*");
    return res.status(200).send({ data: newEntry[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error retrieving video` });
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

//PATCH request for editVideo

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

//DELETE request for video
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

//GET request for video summary
const getVideoSummary = async (req, res) => {
  const userId = res.locals.userId;
  const videoId = req.params.id;

  try {
    const video = await db("videos")
      .where({ id: videoId, user_id: userId })
      .first();

    if (!video) {
      return res.status(404).send({ message: "Video not found" });
    }

    const comments = await db("comments")
      .where("video_id", videoId)
      .select("comments");

    const commentCount = comments.length;
    const commentsText = comments
      .map((comment) => `${comment.comments}`)
      .join("\n");

    // Calculate vote ratio
    const up = video.upvote;
    const down = video.downvote;
    const voteRatio = down === 0 ? up : up / down;

    // Compare with stored values
    const updateSummary =
      Math.abs(voteRatio - video.last_vote_ratio) > 0.5 ||
      commentCount - video.last_comment_count >= 3;

    if (!updateSummary) {
      return res.status(200).send({
        data: video.summary,
        updated_at: video.updated_at,
      });
    }

    const feedbackSummary = await chatgpt(commentsText, up, down);

    const [updated] = await db("videos")
      .where({ id: videoId })
      .update({
        summary: feedbackSummary,
        last_comment_count: commentCount,
        last_vote_ratio: voteRatio,
        updated_at: new Date(),
      })
      .returning(["summary", "updated_at"]);

    res
      .status(200)
      .send({ data: updated.summary, updated_at: updated.updated_at });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
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
  getVideoSummary,
};

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
    res.status(500).send({ message: "There was an  error saving the entry." });
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
    return res
      .status(400)
      .send({ message: "There was an error retrieving video." });
  }
};

module.exports = {
  newVideo,
  getVideos,
  getVideo,
};

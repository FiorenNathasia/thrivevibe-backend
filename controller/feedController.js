const db = require("../db/db");

//GET request for all videos of other users
const getFeed = async (req, res) => {
  const userId = res.locals.userId;
  try {
    const videos = await db("videos")
      .select("id", "url", "prompt")
      .where("user_id", "!=", userId)
      .orderBy("created_at", "desc")
      .limit(30);
    res.status(200).send(videos);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving videos" });
  }
};
module.exports = {
  getFeed,
};

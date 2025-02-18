const express = require("express");
const router = express.Router();
const videosController = require("../controller/videosController");

router.post("/newvideo", videosController.newVideo);
router.get("/", videosController.getVideos);
router.get("/:id", videosController.getVideo);
router.put("/:id/upvote", videosController.updateUpvote);
router.put("/:id/downvote", videosController.updateDownvote);
router.patch("/:id", videosController.editVideo);
router.delete("/:id", videosController.deleteVideo);
module.exports = router;

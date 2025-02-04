const express = require("express");
const router = express.Router();
const videoController = require("../controller/videoController");

router.post("/newvideo", videoController.newVideo);
router.get("/", videoController.getVideos);
router.get("/:id", videoController.getVideo);

module.exports = router;

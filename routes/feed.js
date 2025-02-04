const express = require("express");
const router = express.Router();
const feedController = require("../controller/feedController");

router.get("/", feedController.getFeed);

module.exports = router;

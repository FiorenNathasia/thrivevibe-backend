const express = require("express");
const router = express.Router();
const commentsController = require("../controller/commentsController");

router.post("/:id/newcomment", commentsController.createComment);
router.get("/:id/comments", commentsController.getComments);

module.exports = router;

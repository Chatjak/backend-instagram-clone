const express = require("express");
const commentRouter = express.Router();
const Comment = require("../model/comment");
const auth = require("../middleware/auth");

commentRouter.post("/comment/:postId", auth, async (req, res) => {
  try {
    const comment = new Comment({
      user_id: req.user,
      post_id: req.params.postId,
      comment: req.body.comment,
    });
    await comment.save();
    res.status(201).send(comment);
  } catch {
    res.status(500).send();
  }
});

commentRouter.get("/comment/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post_id: req.params.postId })
      .populate({
        path: "user_id",
        select: "id username userImage", // Exclude the tokens field
      })
      .sort({ createdAt: -1 });
    if (!comments) {
      res.send([]);
    }
    res.send(comments);
  } catch {
    res.status(500).send();
  }
});
module.exports = commentRouter;

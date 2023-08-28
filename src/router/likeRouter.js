const express = require("express");
const LikeRouter = express.Router();
const Like = require("../model/like");
const auth = require("../middleware/auth");

LikeRouter.post("/like/:post_id", auth, async (req, res) => {
  const like = new Like({
    user_id: req.user._id,
    post_id: req.params.post_id,
  });
  try {
    await like.save();
    res.status(201).send(like);
  } catch {
    res.status(500).send();
  }
});

LikeRouter.delete("/like/:post_id", auth, async (req, res) => {
  try {
    const like = await Like.findOneAndDelete({
      user_id: req.user._id,
      post_id: req.params.post_id,
    });
    if (!like) {
      res.status(404).send();
    }
    res.status(200).send();
  } catch {
    res.status(500).send();
  }
});

LikeRouter.get("/like/:post_id", auth, async (req, res) => {
  try {
    const like = await Like.findOne({
      user_id: req.user._id,
      post_id: req.params.post_id,
    });
    if (!like) {
      res.send(false);
    }
    res.send(true);
  } catch {
    res.status(500).send();
  }
});

LikeRouter.get("/like/:post_id/total", async (req, res) => {
  try {
    const like = await Like.find({ post_id: req.params.post_id });
    if (!like) {
      res.send(0);
    }
    const totalLikes = like.length;
    res.send(totalLikes.toString());
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = LikeRouter;

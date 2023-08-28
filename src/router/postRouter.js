const express = require("express");
const postRouter = express.Router();
const Post = require("../model/post");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const Comment = require("../model/comment");

const upload = multer({
  fileFilter(req, file, cb) {
    cb(undefined, true);
  },
});
postRouter.post(
  "/post/create",
  auth,
  upload.fields([
    {
      name: "post_img",
      maxCount: 1,
    },
    {
      name: "caption",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.post_img || !req.body.caption) {
        return res.status(400).send(req.body.caption);
      }

      const buffer = await sharp(req.files.post_img[0].buffer)
        .resize({
          width: 550,
          height: 550,
        })
        .png()
        .toBuffer();

      const post = new Post({
        user_id: req.user._id,
        post_img: buffer,
        caption: req.body.caption,
      });

      await post.save();
      res.status(201).send("Post created successfully.");
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred.");
    }
  }
);

postRouter.get("/post/:postId/image", async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error();
  }
  res.set("Content-Type", "image/png");
  res.send(post.post_img);
});
postRouter.get("/post/:postId/detail", async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error();
  }
  res.send(post);
});

postRouter.get("/post/getAll", async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate({
        path: "user_id",
        select: "-tokens -userImage -email -password", // Exclude the tokens field
      })
      .sort({ createdAt: -1 });
    res.send(posts);
  } catch (error) {
    res.status(500).send();
  }
});

postRouter.delete("/post/:postId", auth, async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (!post.user_id.equals(req.user._id)) {
      return res.status(403).send("You are not authorized to delete this post");
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);
    // Delete related comments
    await Comment.deleteMany({
      // user_id: req.user._id,
      post_id: postId,
    });

    res.status(200).send("Post and related comments deleted successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
});

module.exports = postRouter;

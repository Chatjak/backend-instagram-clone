const express = require("express");
const userRouter = express.Router();
const User = require("../model/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

userRouter.post("/user/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(500).send();
  }
});

userRouter.post("/user/signin", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.send({ user, token });
  } catch {
    res.status(500).send();
  }
});

userRouter.get("/user/me", auth, async (req, res) => {
  res.send(req.user);
});

//get user by id
userRouter.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    res.status(404).send();
  }
  res.send(user);
});

//logout token
userRouter.post("/user/me/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch {
    res.status(500).send();
  }
});

userRouter.post("/user/me/logoutAll", auth, async (req, res) => {
  req.user.tokens = [];
  await req.user.save();
  res.send();
});

const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|png|PNG)/)) {
      return cb(new Error("please upload a jpg jpeg or png"));
    }
    cb(undefined, true);
  },
});

userRouter.post(
  "/user/me/userImage",
  auth,
  upload.single("userImage"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.userImage = buffer;
    await req.user.save();
    res.send();
  }
);

//get avatar
userRouter.get("/user/me/userImage", auth, async (req, res) => {
  try {
    const user = await req.user;
    if (!user.userImage) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.userImage);
  } catch {
    res.status(500).send();
  }
});
//get avatar by id
userRouter.get("/user/userImage/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User or image not found");
    }
    res.set("Content-Type", "image/png");
    res.send(user.userImage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//get change password
userRouter.patch("/user/me/password", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["password", "username"];
  const isValidCheck = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidCheck) {
    return res.status(400).send({ error: "invalid update" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch {
    res.status(500).send();
  }
});

module.exports = userRouter;

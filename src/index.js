const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");
const postRouter = require("./router/postRouter");
const commentRouter = require("./router/commentRouter");
const LikeRouter = require("./router/likeRouter");
require("dotenv").config();

const app = express();
const API_KEY = process.env.API_KEY;
const port = process.env.PORT;
const server = async () => {
  await mongoose
    .connect(API_KEY, { useNewUrlParser: true })
    .then(() => console.log("Connected to server"));
};

server();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);
app.use("/api", LikeRouter);

app.listen(port, () => console.log(`Server is up on port ${port}`));

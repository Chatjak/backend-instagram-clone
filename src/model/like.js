const mongoose = require("mongoose");
const { Schema } = mongoose;

const likeSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;

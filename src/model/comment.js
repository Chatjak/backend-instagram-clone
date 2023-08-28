const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model, this establishes a reference to the user who created the post
      required: true,
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      require: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

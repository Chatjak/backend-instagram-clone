const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model, this establishes a reference to the user who created the post
      required: true,
    },
    post_img: {
      type: Buffer,
      required: true,
    },
    caption: {
      type: "String",
      required: true,
    },
  },
  { timestamps: true }
);

postSchema.methods.toJSON = function () {
  const post = this;
  const postObject = post.toObject();
  delete postObject.post_img;
  return postObject;
};

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

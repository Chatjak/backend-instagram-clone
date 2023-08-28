const jwt = require("jsonwebtoken");
const User = require("../model/user");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "please authenticate" });
  }
};

module.exports = auth;

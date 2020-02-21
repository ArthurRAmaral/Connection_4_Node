const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    roomName: String,
    player1: String,
    player2: String,
    key: String,
    roomUrl: String,
    isFull: Boolean
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Post", PostSchema);

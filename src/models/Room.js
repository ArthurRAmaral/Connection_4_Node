const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    roomName: String,
    playerHost: String,
    playerGuest: String,
    key: String,
    roomUrl: String,
    isFull: Boolean
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Room", RoomSchema);

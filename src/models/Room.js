const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    roomName: String,
    playerHost: String,
    playerGuest: String,
    symobolHost: String,
    symobolGuest: String,
    key: String,
    roomUrl: String,
    isFull: Boolean,
    marks: Array,
    status: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Room", RoomSchema);

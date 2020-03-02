const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    roomName: String,
    playerHost: String,
    playerGuest: String,
    symbolHost: String,
    symbolGuest: String,
    key: String,
    roomUrl: String,
    isFull: Boolean,
    marks: Array,
    status: String,
    move: Number,
    turnOf: String,
    result: Object
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Room", RoomSchema);

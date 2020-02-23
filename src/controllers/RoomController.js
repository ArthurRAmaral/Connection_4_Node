const Room = require("../models/Room");

module.exports = {
  async createARoom(req, res) {
    let { playerHost, key, roomName } = req.body;

    var matrix = [];
    for (var i = 0; i < 7; i++) {
      matrix[i] = [];
      for (var j = 0; j < 6; j++) {
        matrix[i][j] = undefined;
      }
    }

    const room = await Room.create({
      roomName,
      playerHost,
      playerGuest: "",
      symobolHost: "x",
      symobolGuest: "o",
      key: key.toLowerCase(),
      roomKey: `${roomName.toLowerCase()}#${key.toLowerCase()}`,
      isFull: false,
      marks: matrix,
      alreadyStarted: "waiting"
    });

    req.io.emit("newRoom", room);

    res.json(room);
  },

  async joinRoom(req, res) {
    const { id } = req.params;
    let { playerGuest } = req.body;
    const room = await Room.findById(id);

    room.isFull = true;
    room.playerGuest = playerGuest;

    await room.save();

    req.io.emit("join#" + id, room);

    return res.json(room);
  },

  async start(req, res) {
    const { id } = req.params;
    const room = await Room.findById(id);

    room.alreadyStarted = "started";

    await roomm.save();
    req.io.emit("started#" + id, room);
    return res.json(room);
  }
};

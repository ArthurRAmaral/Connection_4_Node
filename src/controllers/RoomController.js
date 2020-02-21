const Room = require("../models/Room");

module.exports = {
  async createARoom(req, res) {
    const { player1, key, roomName } = req.body;

    const room = await Room.create({
      roomName,
      player1,
      player2: "",
      key,
      roomUrl: `${roomName}#${key}`,
      isFull: false
    });

    req.io.emit("newRoom", room);

    res.json(room);
  }
};

const Room = require("../models/Room");

module.exports = {
  async createARoom(req, res, next) {
    console.log(req.body);
    const { playerHost, key, roomName } = req.body;

    const room = await Room.create({
      roomName,
      playerHost,
      playerGuest: "",
      key,
      roomUrl: `${roomName}#${key}`,
      isFull: false
    });

    req.io.emit("newRoom", room);

    res.json(room);
  }
};

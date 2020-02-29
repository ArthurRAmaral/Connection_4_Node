const Room = require("../models/Room");
const statusArray = require("../utils/roomStatus");
const returns = require("../messages/returns");

module.exports = {
  async putInColum(req, res) {
    const { id, column, player } = req.body;

    const room = await Room.findById(id);

    if (room != null) {
      const vet = room.marks[column];

      let i = 0;
      for (i; vet[i] != "" && i < vet.length; i++) {}
      if (player == room.playerHost && i < vet.length) {
        vet[i] = room.symbolHost;
      } else if (i < vet.length) {
        vet[i] = room.symbolGuest;
      }

      // await room.save();

      await Room.findByIdAndUpdate(id, room);

      req.io.emit("play#" + id, room.marks);

      return res.json(room.marks);
    } else return res.json(returns.roomNotFound);
  }
};

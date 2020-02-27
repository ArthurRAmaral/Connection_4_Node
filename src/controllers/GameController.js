const Room = require("../models/Room");

module.exports = {
  async putInColum(req, res) {
    const { id, column, player } = req.body;

    const room = await Room.findById(id);

    const vet = room.game.marks[column];
    let i = 0;

    if (room != null) {
      if (player == room.playerHost) {
        for (i; vet[i] != "" && i < vet.length; i++) {}
        vet[i] = room.symbolHost;
      } else {
        for (i; vet[i] != "" && i < vet.length; i++) {}
        vet[i] = room.symbolGuest;
      }

      await room.save();

      const room2 = await Room.findById(id);

      console.log("i = " + i);
      console.log(`"${room.game.marks[column][i]}"`);
      console.log(`"${room2.game.marks[column][i]}"`);

      if (room.game.marks[column][i] == room2.game.marks[column][i]) {
        req.io.emit("play#" + id, room.game);

        return res.json(room.game);
      } else return res.json({ error: "Database save error" });
    } else return res.json({ error: "Room not find" });
  }
};

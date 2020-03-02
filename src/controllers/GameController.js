const Room = require("../models/Room");
const statusArray = require("../utils/roomStatus");
const returns = require("../messages/returns");

function verifyTheGame(n, marks) {
  //objectivo: avaliar se o jogo acabou (4emlinha empate) ou nao

  let i;
  let j;

  for (i = 0; i < 6; i++) {
    for (j = 0; j < 4; j++) {
      //testar 4 em linha linhas
      if (
        marks[i][j] == marks[i][j + 1] &&
        marks[i][j + 2] == marks[i][j + 3] &&
        marks[i][j] == marks[i][j + 3] &&
        marks[i][j] != ""
      )
        return marks[i][j];
    }
  }

  for (i = 0; i < 6; i++) {
    for (j = 0; j < 4; j++) {
      //testar 4 em linha nas colunas
      if (
        marks[j][i] == marks[j + 1][i] &&
        marks[j + 2][i] == marks[j + 3][i] &&
        marks[j][i] == marks[j + 2][i] &&
        marks[j][i] != ""
      )
        return marks[j][i];
    }
  }

  for (i = 0; i < 4; i++) {
    for (j = 0; j < 3; j++) {
      //testar 4 em linha diagonais1 começar em cima
      if (
        marks[j][i] == marks[j + 1][i + 1] &&
        marks[j + 2][i + 2] == marks[j + 3][i + 3] &&
        marks[j][i] == marks[j + 2][i + 2] &&
        marks[j][i] != ""
      )
        return marks[j][i];
    }
  }

  for (i = 0; i < 4; i++) {
    for (j = 5; j > 2; j--) {
      //testar 4 em linha diagonais2 começar em baixo
      if (
        marks[j][i] == marks[j - 1][i + 1] &&
        marks[j - 2][i + 2] == marks[j - 3][i + 3] &&
        marks[j][i] == marks[j - 2][i + 2] &&
        marks[j][i] != ""
      )
        return marks[j][i];
    }
  }

  if (n == 42) return "d";

  return "";
}

module.exports = {
  async putInColum(req, res) {
    const { id, column, player } = req.body;

    const room = await Room.findById(id);

    if (room != null && room.turnOf === player) {
      const vet = room.marks[column];

      let i = 0;
      for (i; vet[i] != "" && i < vet.length; i++) {}
      if (player == room.playerHost && i < vet.length) {
        vet[i] = room.symbolHost;
      } else if (i < vet.length) {
        vet[i] = room.symbolGuest;
      }

      const verify = verifyTheGame(room.move, room.marks);

      const result = {
        win: "",
        wasDraw: false
      };

      switch (verify) {
        case "x":
          result.win = room.playerHost;
          req.io.emit("gameover#" + id, result);
          room.result = result;
          room.status = statusArray.finished;
          break;
        case "o":
          result.win = room.playerGuest;
          req.io.emit("gameover#" + id, result);
          room.result = result;
          room.status = statusArray.finished;
          break;
        case "d":
          result.win = "nobody";
          result.wasDraw = true;
          req.io.emit("gameover#" + id, result);
          room.result = result;
          room.status = statusArray.finished;
          break;
        default:
          break;
      }

      room.turnOf =
        room.turnOf === room.playerHost ? room.playerGuest : room.playerHost;

      await Room.findByIdAndUpdate(id, room);

      req.io.emit("play#" + id, room);

      return res.json(room);
    } else if (room.turnOf !== player) return res.json(returns.notYourTurn);
    else return res.json(returns.roomNotFound);
  }
};

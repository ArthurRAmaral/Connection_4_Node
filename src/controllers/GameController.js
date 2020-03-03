const Room = require("../models/Room");
const statusArray = require("../utils/roomStatus");
const returns = require("../messages/returns");

const roomHider = require("../utils/roomHider");

function verifyTheGame(n, marks) {
  //objectivo: avaliar se o jogo acabou (4emlinha empate) ou nao

  let i;
  let j;

  const res = {
    symbol: "",
    i: [],
    j: []
  };

  for (i = 0; i < marks.length; i++) {
    for (j = 0; j < marks[i].length - 3; j++) {
      //testing columns
      if (
        marks[i][j] == marks[i][j + 1] &&
        marks[i][j + 2] == marks[i][j + 3] &&
        marks[i][j] == marks[i][j + 3] &&
        marks[i][j] != ""
      ) {
        res.i = [i, i, i, i];
        res.j = [j, j + 1, j + 2, j + 3];
        res.symbol = marks[i][j];

        return res;
      }
    }
  }

  for (i = 0; i < marks.length - 3; i++) {
    for (j = 0; j < marks[i].length; j++) {
      //testing lines
      if (
        marks[i][j] == marks[i + 1][j] &&
        marks[i + 2][j] == marks[i + 3][j] &&
        marks[i][j] == marks[i + 2][j] &&
        marks[i][j] != ""
      ) {
        res.i = [i, i + 1, i + 2, i + 3];
        res.j = [j, j, j, j];
        res.symbol = marks[i][j];

        return res;
      }
    }
  }

  for (i = 0; i < marks.length - 3; i++) {
    for (j = 0; j < marks[i].length - 3; j++) {
      //testing / diagonals
      if (
        marks[i][j] == marks[i + 1][j + 1] &&
        marks[i + 2][j + 2] == marks[i + 3][j + 3] &&
        marks[i][j] == marks[i + 2][j + 2] &&
        marks[i][j] != ""
      ) {
        res.i = [i, i + 1, i + 2, i + 3];
        res.j = [j, j + 1, j + 2, j + 3];
        res.symbol = marks[i][j];

        return res;
      }
    }
  }

  for (i = 0; i < marks.length - 3; i++) {
    for (j = 3; j < marks[i].length; j++) {
      //testing \ diagonals
      if (
        marks[i][j] == marks[i + 1][j - 1] &&
        marks[i + 2][j - 2] == marks[i + 3][j - 3] &&
        marks[i][j] == marks[i + 2][j - 2] &&
        marks[i][j] != ""
      ) {
        res.i = [i, i + 1, i + 2, i + 3];
        res.j = [j, j - 1, j - 2, j - 3];
        res.symbol = marks[i][j];

        return res;
      }
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
        wasDraw: false,
        i: [],
        j: []
      };

      switch (verify.symbol) {
        case "x":
          result.win = room.playerHost;
          result.i = verify.i;
          result.j = verify.j;
          room.result = result;
          room.status = statusArray.finished;
          break;
        case "o":
          result.i = verify.i;
          result.j = verify.j;
          result.win = room.playerGuest;
          room.result = result;
          room.status = statusArray.finished;
          break;
        case "d":
          result.win = "nobody";
          result.wasDraw = true;
          room.result = result;
          room.status = statusArray.finished;
          break;
        default:
          break;
      }

      room.turnOf =
        room.turnOf === room.playerHost ? room.playerGuest : room.playerHost;

      await Room.findByIdAndUpdate(id, room);

      const readbleValues = roomHider.hideKey(room);

      if (result.win !== "") {
        req.io.emit("gameover#" + id, readbleValues);
      } else req.io.emit("play#" + id, readbleValues);

      return res.json(readbleValues);
    } else if (room.turnOf !== player) return res.json(returns.notYourTurn);
    else return res.json(returns.roomNotFound);
  }
};

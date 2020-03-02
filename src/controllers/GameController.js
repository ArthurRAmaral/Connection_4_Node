const Room = require("../models/Room");
const statusArray = require("../utils/roomStatus");
const returns = require("../messages/returns");

module.exports = {
  async putInColum(req, res) {
    const { id, column, player } = req.body;

    const room = await Room.findById(id);

    function verifyTheGame(n) {
      //objectivo: avaliar se o jogo acabou (4emlinha empate) ou nao

      let i;
      let j;

      for (i = 0; i < 6; i++) {
        for (j = 0; j < 4; j++) {
          //testar 4 em linha linhas
          if (
            tabuleiro[i][j] == tabuleiro[i][j + 1] &&
            tabuleiro[i][j + 2] == tabuleiro[i][j + 3] &&
            tabuleiro[i][j] == tabuleiro[i][j + 3] &&
            tabuleiro[i][j] != " "
          )
            return tabuleiro[i][j];
        }
      }

      for (i = 0; i < 6; i++) {
        for (j = 0; j < 4; j++) {
          //testar 4 em linha nas colunas
          if (
            tabuleiro[j][i] == tabuleiro[j + 1][i] &&
            tabuleiro[j + 2][i] == tabuleiro[j + 3][i] &&
            tabuleiro[j][i] == tabuleiro[j + 2][i] &&
            tabuleiro[j][i] != " "
          )
            return tabuleiro[j][i];
        }
      }

      for (i = 0; i < 4; i++) {
        for (j = 0; j < 3; j++) {
          //testar 4 em linha diagonais1 começar em cima
          if (
            tabuleiro[j][i] == tabuleiro[j + 1][i + 1] &&
            tabuleiro[j + 2][i + 2] == tabuleiro[j + 3][i + 3] &&
            tabuleiro[j][i] == tabuleiro[j + 2][i + 2] &&
            tabuleiro[j][i] != " "
          )
            return tabuleiro[j][i];
        }
      }

      for (i = 0; i < 4; i++) {
        for (j = 5; j > 2; j--) {
          //testar 4 em linha diagonais2 começar em baixo
          if (
            tabuleiro[j][i] == tabuleiro[j - 1][i + 1] &&
            tabuleiro[j - 2][i + 2] == tabuleiro[j - 3][i + 3] &&
            tabuleiro[j][i] == tabuleiro[j - 2][i + 2] &&
            tabuleiro[j][i] != " "
          )
            return tabuleiro[j][i];
        }
      }

      if (n == 42) return "E";

      return " ";
    }

    if (room != null) {
      const vet = room.marks[column];

      let i = 0;
      for (i; vet[i] != "" && i < vet.length; i++) {}
      if (player == room.playerHost && i < vet.length) {
        vet[i] = room.symbolHost;
      } else if (i < vet.length) {
        vet[i] = room.symbolGuest;
      }

      // switch (verifyTheGame()) {
      //   case "x":
      //     break;
      //   case "o":
      //     break;
      //   case "E":
      //     break;
      //   case "":
      //     break;
      // }

      // await room.save();

      await Room.findByIdAndUpdate(id, room);

      req.io.emit("play#" + id, room);

      return res.json(room);
    } else return res.json(returns.roomNotFound);
  }
};

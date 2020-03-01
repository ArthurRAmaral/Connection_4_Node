const Room = require("../models/Room");
const statusArray = require("../utils/roomStatus");
const returns = require("../messages/returns");

async function existThisOpenRoom(roomName) {
  let exist = (await Room.find()).filter(o => {
    return o.roomName == roomName && o.status < 3;
  }).length;

  return exist > 0;
}

function createMatrix() {
  var matrix = [];
  for (var i = 0; i < 7; i++) {
    matrix[i] = [];
    for (var j = 0; j < 6; j++) {
      matrix[i][j] = "";
    }
  }
  return matrix;
}

function hideKey(room) {
  const { _doc } = room;
  const { key, updatedAt, __v, ...onlyReadValeus } = _doc;
  return onlyReadValeus;
}

function hideKeyAndGame(room) {
  const { _doc } = room;
  const { key, game, updatedAt, __v, ...onlyReadValeus } = _doc;
  return onlyReadValeus;
}

module.exports = {
  async createARoom(req, res) {
    let { playerHost, key, roomName } = req.body;

    if (await existThisOpenRoom(roomName)) {
      return res.json(returns.existThisOpenRoom);
    }

    const room = await Room.create({
      roomName,
      playerHost,
      playerGuest: "",
      symbolHost: "x",
      symbolGuest: "o",
      key: key,
      roomKey: `${roomName.toLowerCase()}-${playerHost.toLowerCase()}`,
      isFull: false,
      marks: createMatrix(),
      status: statusArray.waitingGuest
    });

    req.io.emit("newRoom", room);
    const r = hideKey(room);
    res.json(r);
  },

  async joinRoom(req, res) {
    const { id } = req.params;
    const { key } = req.body;
    const room = await Room.findById(id);

    if (room != null) {
      if (room.status == statusArray.waitingGuest) {
        if (key == room.key) {
          let { playerGuest } = req.body;
          if (playerGuest === undefined)
            return res.json(returns.emptyGuestNick);
          if (playerGuest == room.playerHost) playerGuest += " (2)";
          room.isFull = true;
          room.playerGuest = playerGuest;
          room.status = statusArray.waitingStart;

          await room.save();

          req.io.emit("joined", room);

          return res.json(returns.joined);
        } else return res.json(returns.wrongKey);
      } else if (
        room.status == statusArray.finished ||
        room.status == statusArray.canceled
      )
        return res.json(returns.alreadyFinished);
      else if (
        room.status == statusArray.waitingStart ||
        room.status == statusArray.started
      )
        return res.json(returns.full);
    } else return res.json(returns.roomNotFound);
  },

  async start(req, res) {
    const { id } = req.params;
    const { key } = req.body;
    const room = await Room.findById(id);

    if (room != null) {
      if (room.status == statusArray.waitingStart) {
        if (key == room.key) {
          room.status = statusArray.started;

          await room.save();

          req.io.emit("started#" + id, room);

          return res.json(returns.justStarted);
        } else return res.json(returns.wrongKey);
      } else if (
        room.status == statusArray.finished ||
        room.status == statusArray.canceled
      )
        return res.json(returns.alreadyFinished);
      else if (room.status == statusArray.waitingGuest)
        return res.json(returns.notPrepared);
      else if (room.status == statusArray.started)
        return res.json(returns.alreadyStarted);
    } else return res.json(returns.roomNotFound);
  },

  async allOpenRoomsWithoutKeysAndGames(req, res) {
    const rooms = await Room.find().sort("-createdAt");
    let novalista = await rooms.map(({ _doc }) => _doc);
    novalista = await novalista.map(
      ({ marks, key, createdAt, updatedAt, __v, ...onlyReadValeus }) =>
        onlyReadValeus
    );

    const retorno = novalista.filter(room => room.status < 2 && !room.isFull);

    return res.json(retorno);
  },

  async allRoomsWithoutKeysAndGames(req, res) {
    const rooms = await Room.find().sort("-createdAt");
    let novalista = await rooms.map(({ _doc }) => _doc);
    novalista = await novalista.map(
      ({ marks, key, createdAt, updatedAt, __v, ...onlyReadValeus }) =>
        onlyReadValeus
    );

    return res.json(novalista);
  },

  async getMyRoom(req, res) {
    const { id } = req.body;
    const room = await Room.findById(id);
    const { _doc } = romm;
    const { key, ...visibleContent } = room;
    return res.json(visibleContent);
  },

  async finish(req, res) {
    const { id } = req.params;
    const { key } = req.body;
    const room = await Room.findById(id);

    if (room != null) {
      if (room.status <= statusArray.started) {
        if (key == room.key) {
          if (room.status < statusArray.started) {
            room.status = statusArray.canceled;
            await room.save();
            req.io.emit("finished", room);
            return res.json(returns.justCanceled);
          } else {
            room.status = statusArray.finished;
            await room.save();
            req.io.emit("finished", room);
            return res.json(returns.justFinished);
          }
        } else return res.json(returns.wrongKey);
      } else return res.json(returns.alreadyFinished);
    } else return res.json(returns.roomNotFound);
  }
};

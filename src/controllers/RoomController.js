const Room = require("../models/Room");

const statusArray = {
  waitingGuest: 0,
  waitingStart: 1,
  started: 2,
  finished: 3,
  canceled: 4
};

const returns = {
  joined: {
    status: 0,
    statusMsg: "joined"
  },
  full: {
    status: 1,
    statusMsg: "full"
  },
  alreadyStarted: {
    status: 2,
    statusMsg: "already started"
  },
  wrongKey: {
    status: 3,
    statusMsg: "wrong key"
  },
  notFound: {
    status: 4,
    statusMsg: "room not found"
  },
  alreadyFinished: {
    status: 5,
    statusMsg: "already finished"
  },
  notPrepared: {
    status: 6,
    statusMsg: "need another player"
  },
  justStarted: {
    status: 7,
    statusMsg: "just started"
  },
  justFinished: {
    status: 8,
    statusMsg: "just finished"
  },
  existThisOpenRoom: {
    status: 9,
    statusMsg: "already exist a room with this name"
  },
  justCanceled: {
    status: 10,
    statusMsg: "just canceled"
  }
};

module.exports = {
  async createARoom(req, res) {
    let { playerHost, key, roomName } = req.body;

    let exist = (await Room.find()).filter(o => {
      return o.roomName == roomName && o.status < 3;
    }).length;

    if (exist > 0) {
      return res.json(returns.existThisOpenRoom);
    }

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
      roomKey: `${roomName.toLowerCase()}-${playerHost.toLowerCase()}`,
      isFull: false,
      marks: matrix,
      status: statusArray.waitingGuest
    });

    req.io.emit("newRoom", room);

    res.json(room);
  },

  async joinRoom(req, res) {
    const { id } = req.params;
    const { key } = req.body;
    const room = await Room.findById(id);

    if (room != null) {
      if (room.status == statusArray.waitingGuest) {
        if (key == room.key) {
          let { playerGuest } = req.body;

          room.isFull = true;
          room.playerGuest = playerGuest;
          room.status = statusArray.waitingStart;

          await room.save();

          req.io.emit("join#" + id, room);

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
    } else return res.json(returns.notFound);
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
    } else return res.json(returns.notFound);
  },

  async allRoomsWithoutKeys(req, res) {
    const rooms = await Room.find().sort("-createdAt");
    const novalista = await rooms.map(({ _doc }) => _doc);
    const retorno = await novalista.map(
      ({ marks, key, createdAt, updatedAt, __v, ...onlyReadValeus }) =>
        onlyReadValeus
    );
    return res.json(retorno);
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
            req.io.emit("canceled#" + id, room);
            return res.json(returns.justCanceled);
          } else {
            room.status = statusArray.finished;
            await room.save();
            req.io.emit("finished#" + id, room);
            return res.json(returns.justFinished);
          }
        } else return res.json(returns.wrongKey);
      } else if (
        room.status == statusArray.finished ||
        room.status == statusArray.canceled
      )
        return res.json(returns.alreadyFinished);
    } else return res.json(returns.notFound);
  }
};

const express = require("express");
const RoomController = require("./controllers/RoomController");
const GameController = require("./controllers/GameController");

const routes = new express.Router();

routes.post("/createroom", RoomController.createARoom);

routes.put("/join/:id", RoomController.joinRoom);

routes.put("/start/:id", RoomController.start);

routes.get("/allopenrooms", RoomController.allOpenRoomsWithoutKeysAndGames);

routes.get("/allrooms", RoomController.allRoomsWithoutKeysAndGames);

routes.put("/finish/:id", RoomController.finish);

routes.post("/postplay", GameController.putInColum);

module.exports = routes;

const express = require("express");
const RoomController = require("./controllers/RoomController");

const routes = new express.Router();

routes.post("/createroom", RoomController.createARoom);

routes.put("/join/:id", RoomController.joinRoom);

routes.put("/start/:id", RoomController.start);

routes.get("/allrooms", RoomController.allRoomsWithoutKeys);

routes.put("/finish/:id", RoomController.finish);

module.exports = routes;

const express = require("express");
const RoomController = require("./controllers/RoomController");

const routes = new express.Router();

routes.post("/createroom", RoomController.createARoom);

routes.put("/join/:id", RoomController.joinRoom);
module.exports = routes;

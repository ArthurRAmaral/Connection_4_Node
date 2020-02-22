const express = require("express");
const routes = new express.Router();
const RoomController = require("./controllers/RoomController");

routes.post("/newroom/create", RoomController.createARoom);

routes.module.exports = routes;

const express = require("express");
const multer = require("multer");
const uploadConfig = require("./config/upload");
const RoomController = require("./controllers/RoomController");

const routes = new express.Router();
const upload = multer(uploadConfig);

routes.post("/createroom", RoomController.createARoom);
module.exports = routes;

const mogoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const express = require("express");
const path = require("path");
var app = express();

app.use(bodyParser.json());

const server = require("http").Server(app);
const io = require("socket.io")(server);

mogoose.connect(
  "mongodb+srv://aaagram:aaagram@aaagramdata-nmloh.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use((req, res, next) => {
  req.io = io;

  next();
});

app.use(cors());

app.post("", (req, res) => {
  console.log(req.body);
  return res.send("Foi");
});

app.use(require("./routes"));

server.listen(3333);

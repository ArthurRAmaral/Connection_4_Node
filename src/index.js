const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
var app = express();

app.use(bodyParser.json());

const server = require("http").Server(app);
const io = require("socket.io")(server);

mongoose.connect(
  "mongodb+srv://aaagram:aaagram@aaagramdata-nmloh.mongodb.net/Connect4?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
mongoose.set("useFindAndModify", false);

app.use((req, res, next) => {
  req.io = io;

  next();
});

app.use(cors());

app.use(require("./routes"));

server.listen(3333);

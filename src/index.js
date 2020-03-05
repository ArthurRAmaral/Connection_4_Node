require("dotenv").config();

const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
var app = express();

app.use(bodyParser.json());

const server = require("http").Server(app);
const io = require("socket.io")(server);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useFindAndModify", false);

app.use((req, res, next) => {
  req.io = io;

  next();
});

app.use(cors(process.env.CORS_URL_ALLOWED));

app.use(require("./routes"));

server.listen(process.env.APP_PORT);

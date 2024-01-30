require("dotenv").config();

const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const path = require("path");
const PORT = process.env.PORT || 5000;

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const { isAuth, isAdmin } = require("./middlewares");
const { authRoutes, userRoutes } = require("./routes");

const app = express();

app.use(
  cors({
    credentials: true,
    exposedHeaders: "Authorization",
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", jsonParser, authRoutes);
app.use("/api/users", isAuth, isAdmin, jsonParser, userRoutes);

const server = app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

/*const io = socketIo(server, {
  cors: {
    credentials: true,
  },
});*/
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", jsonParser, authRoutes);
app.use("/api/users", isAuth, isAdmin, jsonParser, userRoutes);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        return res.status(200).setHeader('Access-Control-Allow-Methods', 'GET,POST').setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']).end();
    }
    next();
});

const server = app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});


/*const io = socketIo(server, {
  cors: {
    credentials: true,
  },
});*/
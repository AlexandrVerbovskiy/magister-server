require("dotenv").config();

const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const cors = require("cors");
const socketIo = require("socket.io");
const path = require("path");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const { isAuth, isAdmin } = require("./middlewares");
const { authRoutes, userRoutes } = require("./routes");
const STATIC = require("./static");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  session({
    secret: process.env.APP_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_API,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.SERVER_URL + "/auth/facebook/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_API,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.SERVER_URL + "/auth/google/callback",
    },
    (token, tokenSecret, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get("/auth/facebook", passport.authenticate("facebook"));
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);

app.use("/public", express.static(path.join(STATIC.MAIN_DIRECTORY, "public")));
app.use("/api/auth", jsonParser, authRoutes);
app.use("/api/users", isAuth, isAdmin, userRoutes);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    return res
      .status(200)
      .setHeader("Access-Control-Allow-Methods", "GET,POST")
      .setHeader(
        "Access-Control-Allow-Headers",
        req.headers["access-control-request-headers"]
      )
      .end();
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

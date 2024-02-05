require("dotenv").config();

const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const cors = require("cors");
const socketIo = require("socket.io");
const path = require("path");

const { isAuth, isAdmin } = require("./middlewares");
const { apiRoutes, initAuthRoutes } = require("./routes");
const STATIC = require("./static");
const isNotAuth = require("./middlewares/isNotAuth");
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
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    (token, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_API,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      profileFields: ["id", "displayName", "email"],
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

app.use("/public", express.static(path.join(STATIC.MAIN_DIRECTORY, "public")));
app.use("/auth", isNotAuth, initAuthRoutes(passport));
app.use("/api/auth", apiRoutes.authApiRoutes);
app.use("/api/users", isAuth, isAdmin, apiRoutes.userApiRoutes);
app.use("/api/logs", isAuth, isAdmin, apiRoutes.logApiRoutes);

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

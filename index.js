require("dotenv").config();

const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const cors = require("cors");
const socketIo = require("socket.io");
const path = require("path");
const cookieParser = require("cookie-parser");

const { isAuth, isAdmin } = require("./middlewares");
const { apiRoutes } = require("./routes");
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

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_API,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/facebook/callback`,
      profileFields: ["id", "displayName", "email"],
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
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
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

app.use("/api/main", apiRoutes.mainRoutes);
app.use("/api/auth", apiRoutes.authApiRoutes);
app.use("/api/users", apiRoutes.userApiRoutes);
app.use("/api/user-verify-requests", apiRoutes.userVerifyRequestApiRoutes);
app.use("/api/logs", isAuth, isAdmin, apiRoutes.logApiRoutes);
app.use(
  "/api/user-event-logs",
  isAuth,
  isAdmin,
  apiRoutes.userEventLogApiRoutes
);

app.use("/api/listing-categories", apiRoutes.listingCategoryRoutes);
app.use("/api/listings", apiRoutes.listingRoutes);
app.use("/api/system", isAuth, isAdmin, apiRoutes.systemApiRoutes);
app.use("/api/searched-words", apiRoutes.searchedWordsRoutes);
app.use(
  "/api/listing-approval-requests",
  apiRoutes.listingApprovalRequestRoutes
);
app.use(
  "/api/listing-category-create-notification",
  apiRoutes.listingCategoryCreateNotificationRoutes
);

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

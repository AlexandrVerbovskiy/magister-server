require("dotenv").config();

const { Router } = require("express");
const router = Router();
const { isNotAuth } = require("../middlewares");
const STATIC = require("../static");

const CLIENT_URL = process.env.CLIENT_URL;

const redirectToFrontMoreInfoForm = (req, res) => {
  try {
    const name = req.user.name[0].givenName;
    const email = req.user.emails[0].value;
    const newLink = `${CLIENT_URL}/${STATIC.CLIENT_LINKS.PROFILE_COMPETING}?name=${name}&email=${email}`;

    res.redirect(newLink);
  } catch (e) {
    res.status(200).json({
      error: e.message,
    });
  }
};

function initAuthRouters(passport) {
  router.get("/facebook", isNotAuth, passport.authenticate("facebook"));
  router.get(
    "/facebook/callback",
    isNotAuth,
    passport.authenticate("facebook", { failureRedirect: "/" }),
    redirectToFrontMoreInfoForm
  );

  router.get(
    "/google",
    isNotAuth,
    passport.authenticate("google", {
      scope: ["email", "profile"],
    })
  );

  router.get(
    "/google/callback",
    isNotAuth,
    passport.authenticate("google", { failureRedirect: "/" }),
    redirectToFrontMoreInfoForm
  );

  return router;
}

module.exports = initAuthRouters;

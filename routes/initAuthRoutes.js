require("dotenv").config();
const { TokenError } = require("passport-oauth2");

const { Router } = require("express");
const router = Router();
const { isNotAuth } = require("../middlewares");
const { userController } = require("../controllers");

const handleTokenError = (redirectUrl) => (err, req, res, next) => {
  if (err instanceof TokenError && err.message === "Bad Request") {
    return res.redirect(redirectUrl);
  }
  next(err);
};

function initAuthRouters(passport) {
  router.get("/facebook", passport.authenticate("facebook"));
  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/auth/facebook" }),
    handleTokenError("/auth/facebook"),
    userController.redirectToFrontMoreInfoForm
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
    passport.authenticate("google", { failureRedirect: "/auth/google" }),
    handleTokenError("/auth/google"),
    userController.redirectToFrontMoreInfoForm
  );

  return router;
}

module.exports = initAuthRouters;

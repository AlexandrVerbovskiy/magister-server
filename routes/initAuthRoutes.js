require("dotenv").config();

const { Router } = require("express");
const router = Router();
const { isNotAuth } = require("../middlewares");
const { userController } = require("../controllers");

function initAuthRouters(passport) {
  router.get("/facebook", passport.authenticate("facebook"));
  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/" }),
    (req, res) => {
      res.status(200).json(req.user);
    }
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
    userController.redirectToFrontMoreInfoForm
  );

  return router;
}

module.exports = initAuthRouters;

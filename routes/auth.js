const express = require("express");
const passport = require("passport");
const router = express.Router();

module.exports = () => {
  router.get("/login", (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
      return;
    }
    res.render("login", { user: req.session.user });
  });
  router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.log(err);
        return res.redirect("/login");
      }
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      res.redirect("/");
    })(req, res, next);
  });
  router.get("/logout", (req, res) => {
    res.send("Logged out");
  });

  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      if (err) {
        console.log(err);
        return res.redirect("/login");
      }
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      res.json(req.session.user);
    })(req, res, next);
  });
  return router;
};

const users = require("express").Router();
const passport = require("passport");

const usersController = require("../middleware/users");
users.get(
  "/api-key/new",
  passport.authenticate("jwt", { session: false }),
  usersController.generateNewKey
);
users.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  usersController.updateUserEmail
);

users.post("/register", usersController.registerUser);
users.post("/login", usersController.login);

module.exports = users;

const users = require("express").Router();
const passport = require("passport");
const { isUser } = require("../middleware/authorisation");

const usersController = require("../middleware/users");
users.get(
  "/api-keys",
  passport.authenticate("jwt", { session: false }),
  isUser,
  usersController.getApiKeys
);
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

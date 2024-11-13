const users = require("express").Router();
const passport = require("passport");
const { isUser, isAdmin } = require("../middleware/authorisation");

const usersController = require("../middleware/users");
const apiKeyController = require("../middleware/apiKey");
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
users.put(
  "/api-key-status",
  passport.authenticate("jwt", { session: false }),
  isUser,
  apiKeyController.changeStatus
);

users.post("/register", usersController.registerUser);

users.post("/login", usersController.login);

module.exports = users;

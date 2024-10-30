const users = require("express").Router();
const { isAdmin } = require("../middleware/authorisation");

const userManagementController = require("../middleware/userManagement");
const passport = require("passport");
users.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  userManagementController.fetchUsers
);

users.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  userManagementController.fetchUserById
);
users.put(
  "/role/:id/:roleName",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  userManagementController.changeRole
);
users.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  userManagementController.deleteUser
);

module.exports = users;

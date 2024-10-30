const indexRouter = require("express").Router();
const users = require("./users");
const posts = require("./posts");
const userManagement = require("./userManagement");
const keyManagement = require("./keyManagement");

indexRouter.use("/users", users);
indexRouter.use("/admin", posts);
indexRouter.use("/blog", posts);
indexRouter.use("/admin/users", userManagement);
indexRouter.use("/admin/keys", keyManagement);

module.exports = indexRouter;

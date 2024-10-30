const indexRouter = require("express").Router();
const users = require("./users");
const posts = require("./posts");
const blog = require("./blog");
const userManagement = require("./userManagement");

indexRouter.use("/users", users);
indexRouter.use("/admin", posts);
indexRouter.use("/blog", posts);
indexRouter.use("/admin/users", userManagement);

module.exports = indexRouter;

const indexRouter = require("express").Router();
const users = require("./users");
const admin = require("./admin");
const member = require("./member");

indexRouter.use("/users", users);
indexRouter.use("/admin", admin);
indexRouter.use("/member", member);

module.exports = indexRouter;

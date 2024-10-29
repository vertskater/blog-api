const member = require("express").Router();
const apiKey = require("../middleware/apiKey");
const memberController = require("../middleware/member");
const passport = require("passport");

member.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  apiKey.apiKeyRateLimit,
  memberController.listPosts
);

module.exports = member;

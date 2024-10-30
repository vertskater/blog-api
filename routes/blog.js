const blog = require("express").Router();
const apiKey = require("../middleware/apiKey");
const blogController = require("../middleware/blog");
const passport = require("passport");

blog.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  apiKey.apiKeyRateLimit,
  blogController.listPosts
);

module.exports = blog;

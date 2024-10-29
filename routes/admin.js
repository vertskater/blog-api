const admin = require("express").Router();
const passport = require("passport");
const { isAdmin } = require("../middleware/authorisation");

const adminController = require("../middleware/admin");
admin.get("/post", adminController.getAllPosts);
admin.get("/post/:id", adminController.getPost);
admin.post(
  "/post",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  adminController.newPost
);

admin.put(
  "/post",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  adminController.updatePost
);
admin.put(
  "/post/published",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  adminController.published
);

admin.delete(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  adminController.deletePost
);

module.exports = admin;

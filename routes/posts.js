const posts = require("express").Router();
const passport = require("passport");
const apiKey = require("../middleware/apiKey");
const { isAdmin, isUser } = require("../middleware/authorisation");

const postsController = require("../middleware/posts");
const commentsController = require("../middleware/comments");

//Blog Posts get requests
posts.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  apiKey.apiKeyRateLimit,
  postsController.getAllPosts
);
posts.get(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  apiKey.apiKeyRateLimit,
  postsController.getPost
);
posts.get(
  "/posts/comments",
  passport.authenticate("jwt", { session: false }),
  apiKey.apiKeyRateLimit,
  postsController.getPostsWithComments
);
posts.get(
  "/post/comments/:id",
  passport.authenticate("jwt", { session: false }),
  apiKey.apiKeyRateLimit,
  postsController.getPostWithComments
);
// Post Requests
posts.post(
  "/post",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  postsController.newPost
);
posts.post(
  "/post/comment/:postId",
  passport.authenticate("jwt", { session: false }),
  apiKey.apiKeyRateLimit,
  isUser,
  commentsController.addComment
);
// PUT Requests
posts.put(
  "/post",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  postsController.updatePost
);
posts.put(
  "/post/published",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  postsController.published
);
posts.put(
  "/post/comment/:commentId",
  passport.authenticate("jwt", { session: false }),
  apiKey.apiKeyRateLimit,
  isUser,
  commentsController.updateComment
);
// Delete Requests
posts.delete(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  postsController.deletePost
);
posts.delete(
  "/post/comment/:commentId",
  passport.authenticate("jwt", { session: false }),
  apiKey.apiKeyRateLimit,
  isUser,
  commentsController.deleteComment
);

module.exports = posts;

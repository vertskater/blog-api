const { body, validationResult } = require("express-validator");
const dbPosts = require("../db/posts");
//TODO: use async-handler instead of try/catch

const validationSchema = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("title must at least have 3 characters."),
  body("message")
    .isLength({ min: 10 })
    .withMessage("message must have at least 10 characters."),
];

const newPost = [
  validationSchema,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "error in sent data",
        errorInfo: errors,
      });
    }
    const user = req.user;
    try {
      const post = {
        title: req.body.title,
        content: req.body.message,
        authorId: user.id,
      };
      console.log(post);
      await dbAdmin.pushNewPost(post);
      res.status(200).json({ success: true, msg: "post successfully saved" });
    } catch (err) {
      res
        .status(400)
        .json({ success: false, msg: "cant save post", error: err });
    }
  },
];
const updatePost = async (req, res, next) => {
  try {
    const post = await dbPosts.getPostById(req.body.id);
    const updatedPost = {
      id: req.body.id,
      title: req.body?.title ?? post.title,
      content: req.body?.message ?? post.content,
    };
    const updatedReturnedPost = await dbPosts.updatePost(updatedPost);
    res.status(200).json({
      success: true,
      msg: "Post successful updated",
      updatedPost: updatedReturnedPost,
    });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, msg: "cant update post", error: err.msg });
  }
};

const published = async (req, res, next) => {
  const { postId, isPublished } = req.body;
  try {
    const post = await dbPosts.publishPost(postId, isPublished);
    const msg = post.published
      ? "Post successfully published"
      : "Post successfully unpublished";
    res.status(200).json({ success: true, msg: msg });
  } catch (err) {
    res.status(400).json({ success: false, msg: "publishing failed" });
  }
};

const getPost = async (req, res, next) => {
  const postId = parseInt(req.params.id);
  try {
    const post = await dbPosts.getPostById(postId);
    console.log(post);
    res
      .status(200)
      .json({ success: true, msg: "post fetched from db", post: post });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: "Can not fetch post",
      error: "cant fetch post from db",
    });
  }
};

const getAllPosts = async (req, res, next) => {
  const limit = parseInt(req.body?.limit) || 10;
  try {
    const posts = await dbPosts.getPosts(limit);
    res.status(200).json({ success: true, msg: "posts found", posts: posts });
  } catch (err) {
    res.status(400).json({ success: false, msg: "no posts found" });
  }
};

const getPostsWithComments = async (req, res, next) => {
  const limit = parseInt(req.body?.limit) || 10;
  try {
    const postsWithComments = await dbPosts.getPostsWithComments(limit);
    res.status(200).json({
      success: true,
      msg: "posts with comments",
      posts: postsWithComments,
    });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, msg: "could not load posts with comments" });
  }
};

const getPostWithComments = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const postWithComments = await dbPosts.getPostWithComments(id);
    if (!postWithComments) {
      return res.status(404).json({ success: false, msg: "post not found" });
    }
    res.status(200).json({
      success: true,
      msg: "post with comments",
      posts: postWithComments,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, msg: "could not load post with comments" });
  }
};

const deletePost = async (req, res, next) => {
  const postId = parseInt(req.params.id);
  try {
    await dbPosts.deletePost(postId);
    res.status(200).json({ success: true, msg: "Post successfully deleted" });
  } catch (err) {
    res.status(400).json({ success: false, msg: "could not delete post" });
  }
};

module.exports = {
  newPost,
  updatePost,
  published,
  getPost,
  getAllPosts,
  getPostsWithComments,
  getPostWithComments,
  deletePost,
};

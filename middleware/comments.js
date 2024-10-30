const dbComments = require("../db/comments");

const addComment = async (req, res, next) => {
  const comment = {
    content: req.body.comment,
    postId: parseInt(req.params.postId),
    authorId: parseInt(req.user.id),
  };
  try {
    const newComment = await dbComments.pushComment(comment);
    res
      .status(200)
      .json({ success: true, msg: "new comment added", comment: newComment });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, msg: "could not add comment to post" });
  }
};

const updateComment = async (req, res, next) => {
  const updatedComment = {
    id: parseInt(req.params.commentId),
    content: req.body.comment,
  };
  try {
    const comment = await dbComments.updateComment(updatedComment);
    res
      .status(200)
      .json({ success: true, msg: "comment updated", comment: comment });
  } catch (err) {
    res.status(400).json({ success: true, msg: "could not update comment" });
  }
};

const deleteComment = async (req, res, next) => {
  const commentId = parseInt(req.params.commentId);
  try {
    await dbComments.removeComment(commentId);
    res.status(200).json({ success: true, msg: "comment deleted" });
  } catch (err) {
    res.status(400).json({ success: true, msg: "could not delete comment" });
  }
};

module.exports = {
  addComment,
  updateComment,
  deleteComment,
};

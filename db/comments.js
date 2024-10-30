const prisma = require("./prismaClient");

const pushComment = async (comment) => {
  return prisma.comment.create({
    data: {
      content: comment.content,
      postId: comment.postId,
      authorId: comment.authorId,
    },
  });
};

const removeComment = async (commentId) => {
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
};

const updateComment = async (comment) => {
  return prisma.comment.update({
    where: {
      id: comment.id,
    },
    data: {
      content: comment.content,
    },
  });
};

module.exports = {
  pushComment,
  updateComment,
  removeComment,
};

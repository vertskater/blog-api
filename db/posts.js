const prisma = require("./prismaClient");

const pushNewPost = async (post) => {
  await prisma.post.create({
    data: {
      title: post.title,
      content: post.content,
      authorId: post.authorId,
    },
  });
};

const getPosts = async (limit = 10) => {
  return prisma.post.findMany({
    take: limit,
    include: {
      author: true,
    },
  });
};

const getPostsWithComments = async (limit = 10) => {
  return prisma.post.findMany({
    take: limit,
    include: {
      comments: true,
    },
     orderBy: [
      {
        createdAt: 'desc',
      } 
    ]
  });
};

const getPostWithComments = async (postId) => {
  return prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      comments: true,
    },
  });
};

const getPostById = async (postId) => {
  return prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
};

const updatePost = async (post) => {
  return prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      title: post.title,
      content: post.content,
      updatedAt: new Date(),
    },
  });
};

const publishPost = async (postId, status) => {
  return prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      published: status,
    },
  });
};

const deletePost = async (postId) => {
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

module.exports = {
  pushNewPost,
  getPosts,
  getPostById,
  getPostsWithComments,
  getPostWithComments,
  updatePost,
  deletePost,
  publishPost,
};

const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/asyncHandler");

const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const postId = Number(req.params.postId);

  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  const comment = await prisma.comment.create({
    data: {
      text: text.trim(),
      userId: req.user.id,
      postId
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          profilePic: true
        }
      }
    }
  });

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    data: comment
  });
});

const getCommentsByPost = asyncHandler(async (req, res) => {
  const postId = Number(req.params.postId);

  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          profilePic: true
        }
      }
    }
  });

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

module.exports = {
  addComment,
  getCommentsByPost
};

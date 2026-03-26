const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/asyncHandler");

const createPost = asyncHandler(async (req, res) => {
  const { content, image } = req.body;

  const post = await prisma.post.create({
    data: {
      content: content.trim(),
      image: image?.trim() || null,
      userId: req.user.id
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
    message: "Post created successfully",
    data: post
  });
});

const getFeed = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePic: true
          }
        },
        comments: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 3
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    }),
    prisma.post.count()
  ]);

  const postIds = posts.map((post) => post.id);
  const currentUserLikes = postIds.length
    ? await prisma.like.findMany({
        where: {
          userId: req.user.id,
          postId: { in: postIds }
        },
        select: {
          postId: true
        }
      })
    : [];

  const likedPostIds = new Set(currentUserLikes.map((like) => like.postId));
  const feed = posts.map((post) => ({
    ...post,
    likedByMe: likedPostIds.has(post.id)
  }));

  res.status(200).json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    count: feed.length,
    data: feed
  });
});

const likePost = asyncHandler(async (req, res) => {
  const postId = Number(req.params.id);

  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: req.user.id,
        postId
      }
    }
  });

  if (existingLike) {
    return res.status(200).json({
      success: true,
      message: "Post already liked"
    });
  }

  await prisma.like.create({
    data: {
      userId: req.user.id,
      postId
    }
  });

  res.status(201).json({
    success: true,
    message: "Post liked successfully"
  });
});

const unlikePost = asyncHandler(async (req, res) => {
  const postId = Number(req.params.id);

  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: req.user.id,
        postId
      }
    }
  });

  if (!existingLike) {
    return res.status(200).json({
      success: true,
      message: "Post already unliked"
    });
  }

  await prisma.like.delete({
    where: {
      userId_postId: {
        userId: req.user.id,
        postId
      }
    }
  });

  res.status(200).json({
    success: true,
    message: "Post unliked successfully"
  });
});

const deletePost = asyncHandler(async (req, res) => {
  const postId = Number(req.params.id);

  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  if (post.userId !== req.user.id) {
    const error = new Error("You can only delete your own posts.");
    error.statusCode = 403;
    throw error;
  }

  await prisma.post.delete({
    where: { id: postId }
  });

  res.status(200).json({
    success: true,
    message: "Post deleted successfully"
  });
});

module.exports = {
  createPost,
  getFeed,
  likePost,
  unlikePost,
  deletePost
};

const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/asyncHandler");

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      profilePic: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true
        }
      }
    }
  });

  if (!profile) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: {
      ...profile,
      isFollowing: false
    }
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);

  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      profilePic: true,
      createdAt: true,
      posts: {
        select: {
          id: true,
          content: true,
          image: true,
          createdAt: true
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true
        }
      }
    }
  });

  if (!profile) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  const followRecord =
    userId === req.user.id
      ? null
      : await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: req.user.id,
              followingId: userId
            }
          }
        });

  res.status(200).json({
    success: true,
    data: {
      ...profile,
      isFollowing: Boolean(followRecord)
    }
  });
});

const followUser = asyncHandler(async (req, res) => {
  const followingId = Number(req.params.id);
  const followerId = req.user.id;

  if (followingId === followerId) {
    const error = new Error("You cannot follow yourself.");
    error.statusCode = 400;
    throw error;
  }

  const userToFollow = await prisma.user.findUnique({
    where: { id: followingId }
  });

  if (!userToFollow) {
    const error = new Error("User to follow not found.");
    error.statusCode = 404;
    throw error;
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId
      }
    }
  });

  if (existingFollow) {
    const error = new Error("You are already following this user.");
    error.statusCode = 409;
    throw error;
  }

  await prisma.follow.create({
    data: {
      followerId,
      followingId
    }
  });

  res.status(201).json({
    success: true,
    message: "User followed successfully"
  });
});

const unfollowUser = asyncHandler(async (req, res) => {
  const followingId = Number(req.params.id);
  const followerId = req.user.id;

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId
      }
    }
  });

  if (!existingFollow) {
    const error = new Error("You are not following this user.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId
      }
    }
  });

  res.status(200).json({
    success: true,
    message: "User unfollowed successfully"
  });
});

module.exports = {
  getMyProfile,
  getUserProfile,
  followUser,
  unfollowUser
};

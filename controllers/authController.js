const bcrypt = require("bcrypt");

const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const username = req.body.username.trim();
  const email = req.body.email.trim().toLowerCase();
  const bio = req.body.bio?.trim() || null;
  const profilePic = req.body.profilePic?.trim() || null;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }]
    }
  });

  if (existingUser) {
    const error = new Error("User with this email or username already exists.");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      bio,
      profilePic
    },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      profilePic: true,
      createdAt: true
    }
  });

  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user,
      token
    }
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const email = req.body.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user.id);

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
        createdAt: user.createdAt
      },
      token
    }
  });
});

module.exports = {
  registerUser,
  loginUser
};

const jwt = require("jsonwebtoken");

const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Not authorized. Token is missing.");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        profilePic: true,
        createdAt: true
      }
    });

    if (!user) {
      const error = new Error("User linked to this token no longer exists.");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    return next();
  } catch (error) {
    const authError = new Error("Not authorized. Token is invalid or expired.");
    authError.statusCode = 401;
    throw authError;
  }
});

module.exports = { protect };

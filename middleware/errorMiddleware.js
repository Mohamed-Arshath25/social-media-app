const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack })
  });
};

module.exports = { notFound, errorHandler };

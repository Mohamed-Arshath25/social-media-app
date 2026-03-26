require("dotenv").config();

const app = require("./app");
const prisma = require("./utils/prisma");
const validateEnv = require("./utils/validateEnv");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    validateEnv();
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing server gracefully...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();

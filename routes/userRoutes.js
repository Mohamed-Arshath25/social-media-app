const express = require("express");

const {
  getMyProfile,
  getUserProfile,
  followUser,
  unfollowUser
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { idParamValidator } = require("../utils/validators");

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.get("/:id", protect, idParamValidator, validate, getUserProfile);
router.post("/follow/:id", protect, idParamValidator, validate, followUser);
router.post("/unfollow/:id", protect, idParamValidator, validate, unfollowUser);

module.exports = router;

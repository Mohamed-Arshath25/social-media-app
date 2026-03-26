const express = require("express");

const {
  createPost,
  getFeed,
  likePost,
  unlikePost,
  deletePost
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  idParamValidator,
  createPostValidator,
  feedQueryValidator
} = require("../utils/validators");

const router = express.Router();

router.post("/", protect, createPostValidator, validate, createPost);
router.get("/feed", protect, feedQueryValidator, validate, getFeed);
router.delete("/:id", protect, idParamValidator, validate, deletePost);
router.post("/:id/like", protect, idParamValidator, validate, likePost);
router.post("/:id/unlike", protect, idParamValidator, validate, unlikePost);

module.exports = router;

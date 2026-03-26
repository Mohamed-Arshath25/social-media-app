const express = require("express");

const {
  addComment,
  getCommentsByPost
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  postIdParamValidator,
  commentValidator
} = require("../utils/validators");

const router = express.Router();

router.post("/:postId", protect, postIdParamValidator, commentValidator, validate, addComment);
router.get("/:postId", protect, postIdParamValidator, validate, getCommentsByPost);

module.exports = router;

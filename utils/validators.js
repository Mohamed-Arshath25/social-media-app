const { body, param, query } = require("express-validator");

const registerValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Bio must not exceed 160 characters."),
  body("profilePic")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Profile picture must be a valid URL.")
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required.")
];

const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("A valid numeric id is required.")
];

const postIdParamValidator = [
  param("postId")
    .isInt({ min: 1 })
    .withMessage("A valid numeric postId is required.")
];

const createPostValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Post content is required.")
    .isLength({ max: 2000 })
    .withMessage("Post content must not exceed 2000 characters."),
  body("image")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Image must be a valid URL.")
];

const commentValidator = [
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Comment text is required.")
    .isLength({ max: 500 })
    .withMessage("Comment text must not exceed 500 characters.")
];

const feedQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer."),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50.")
];

module.exports = {
  registerValidator,
  loginValidator,
  idParamValidator,
  postIdParamValidator,
  createPostValidator,
  commentValidator,
  feedQueryValidator
};

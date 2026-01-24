const { body, validationResult } = require("express-validator");

const validateImageUpload = [
  body("title")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("Title must be a string with a max length of 100 characters."),
  body("description")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Description must be under 500 characters."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateImageUpload,
};

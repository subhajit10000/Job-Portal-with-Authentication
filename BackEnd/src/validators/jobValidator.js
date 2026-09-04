const { body } = require("express-validator");

const createJobValidator = [
  body("title").trim().notEmpty().withMessage("Job title is required"),
  body("company").trim().notEmpty().withMessage("Job Company is required"),
  body("location").trim().notEmpty().withMessage("Job location is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required"),
];

module.exports = {
  createJobValidator,
};

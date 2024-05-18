const { body } = require("express-validator");

module.exports = [
  body("questions")
    .optional()
    .isArray()
    .withMessage("Questions must be an array "),
  body("questions.*.question")
    .if(body("questions").exists())
    .isString()
    .withMessage("Question name must be a string")
    .notEmpty()
    .withMessage("Question name cannot be empty"),
  body("questions.*.answer")
    .if(body("questions").exists())
    .isBoolean()
    .withMessage("Answer must be a boolean"),
  body("questions.*.description")
    .if(body("questions").exists())
    .custom((value, { req, path }) => {
      const match = path.match(/^questions\[(\d+)\]\.description$/);
      if (match) {
        const index = match[1];
        const answer = req.body.questions[index].answer;
        if (
          answer === true &&
          (!value || typeof value !== "string" || value.trim().length === 0)
        ) {
          throw new Error("Description is required when answer is true");
        }
      }
      return true;
    })
    .withMessage("Question description cannot be empty"),
];

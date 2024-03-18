const { body, param, query } = require("express-validator");

const validateString = ({
  field,
  max,
  fieldName = null,
  message = null,
  required = true,
  min = 1,
  type = "body",
}) => {
  let requireMessage = message;

  if (!requireMessage)
    requireMessage = `Body parameter '${
      fieldName ?? field
    }' is a required field`;

  let maxMessage = message;

  if (!maxMessage)
    maxMessage = `Body parameter '${
      fieldName ?? field
    }' must be lower than ${max} symbols`;

  let validate = null;

  if (type == "body") validate = body(field);
  if (type == "query") validate = query(field);
  if (type == "param") validate = param(field);

  if (required) {
    validate = validate.isLength({ min }).withMessage(requireMessage);
  } else {
    validate = validate.optional({ nullable: true });
  }

  validate = validate
    .isLength({ max })
    .withMessage(maxMessage);

  return [validate];
};

const validateSmallStringBody = ({
  field,
  fieldName = null,
  message = null,
  required = true,
}) =>
  validateString({
    field,
    fieldName,
    message,
    required,
    max: 255,
    type: "body",
  });

const validateBigStringBody = ({
  field,
  fieldName = null,
  message = null,
  required = true,
}) =>
  validateString({
    field,
    fieldName,
    message,
    required,
    max: 10000,
    type: "body",
  });

const validateSmallStringQuery = ({
  field,
  fieldName = null,
  message = null,
  required = true,
}) =>
  validateString({
    field,
    fieldName,
    message,
    required,
    max: 255,
    type: "query",
  });

module.exports = {
  validateSmallStringBody,
  validateBigStringBody,
  validateSmallStringQuery,
};

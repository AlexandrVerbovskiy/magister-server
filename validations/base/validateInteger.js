const { body, param } = require("express-validator");

const validateInteger = ({
  field,
  type = "body",
  fieldName = null,
  message = null,
  required = true,
}) => {
  if (!message) message = `Parameter '${fieldName ?? field}' must be integer`;

  let validation = null;

  if (type == "param") {
    validation = param(field);
  } else {
    validation = body(field);
  }

  if (!required) {
    validation = validation.optional({ nullable: true });
  }

  return [
    validation
      .custom((value) => {
        if (!isNaN(value)) {
          return true;
        } else {
          throw new Error(message);
        }
      })
      .toInt()
      .withMessage(message),
  ];
};

const validateIntegerParam = ({
  field,
  fieldName = null,
  message = null,
  required = true,
}) =>
  validateInteger({
    field,
    type: "param",
    fieldName,
    message,
    required,
  });

const validateIntegerBody = ({
  field,
  fieldName = null,
  message = null,
  required = true,
}) =>
  validateInteger({
    field,
    type: "body",
    fieldName,
    message,
    required,
  });

module.exports = {
  validateIntegerParam,
  validateIntegerBody,
};

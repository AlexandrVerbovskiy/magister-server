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
        const intValue = parseInt(value);

        if (
          isNaN(intValue) ||
          intValue < Number.MIN_SAFE_INTEGER ||
          intValue > Number.MAX_SAFE_INTEGER
        ) {
          throw new Error(message);
        }

        return true;
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

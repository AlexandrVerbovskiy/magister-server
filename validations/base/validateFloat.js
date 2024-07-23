const { body } = require("express-validator");

module.exports = ({
  field,
  fieldName = null,
  message = null,
  required = true,
  canBeNegative = false,
}) => {
  if (!message)
    message = `Body parameter '${
      fieldName ?? field
    }' must be a float number greater than or equal to 0`;

  let validation = body(field);
  if (!required) validation = validation.optional({ nullable: true });

  validation = validation.custom((value) => {
    const intValue = parseFloat(value);

    if (
      isNaN(intValue) ||
      intValue < Number.MIN_SAFE_INTEGER ||
      intValue > Number.MAX_SAFE_INTEGER
    ) {
      throw new Error(message);
    }

    return true;
  });

  const dopProps = {};
  if (!canBeNegative) {
    dopProps["min"] = 0;
  }

  validation = validation.isFloat(dopProps).withMessage(message);
  return [validation];
};

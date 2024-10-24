const { body, param } = require("express-validator");

module.exports = ({
  field,
  fieldName = null,
  type = "body",
  required = true,
}) => {
  let validation = null;

  if (type === "param") {
    validation = param(field);
  } else {
    validation = body(field);
  }

  if (!required) {
    validation = validation.optional({ nullable: true });
  }

  return [
    validation
      .isISO8601() // Перевірка на формат ISO 8601
      .withMessage(`Body field '${fieldName}' must be a valid ISO 8601 date`)
      .custom((startDate) => {
        const currentDate = new Date().toISOString();

        if (startDate < currentDate) {
          throw new Error(
            `Body field '${fieldName}' must be greater or equal than the current date and time`
          );
        }

        return true;
      }),
  ];
};

const { body, param } = require("express-validator");

module.exports = ({
  field,
  fieldName = null,
  message = null,
  type = "body",
  required = true,
}) => {
  if (!message)
    message = `Body field '${
      field ?? fieldName
    }' has incorrect date format ('M/D/YYYY HH:mm:ss')`;

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
    validation.custom((value) => {
      if (!value.match(/^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{1,2}:\d{1,2}$/)) {
        throw new Error(message);
      }
      return true;
    }),
  ];
};

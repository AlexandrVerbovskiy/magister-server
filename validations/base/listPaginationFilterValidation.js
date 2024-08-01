const { body } = require("express-validator");
const { validateSmallStringBody } = require("./validateString");

module.exports = [
  body("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Body parameter 'Page' must be a positive integer"),
  body("itemsPerPage")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Body parameter 'Items per page' must be a positive integer"),
  ...validateSmallStringBody({
    field: "order",
    fieldName: "Order",
    required: false,
  }),
  body("orderType")
    .optional({ nullable: true })
    .isIn(["desc", "asc"])
    .withMessage("Body parameter 'Order type' must be either 'desc' or 'asc'"),
];

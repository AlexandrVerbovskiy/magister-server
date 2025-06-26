const { validateBoolean } = require("../base");
const { body } = require("express-validator");

const validatePercent = ({ field, fieldName }) => [
  body(field).custom((value) => {
    if (isNaN(Number(value))) {
      throw new Error(`Body parameter '${fieldName}' must be an number`);
    }
    return true;
  }),
  body(field).custom((value) => {
    const parsedValue = Number(value);
    if (parsedValue < 0 || parsedValue > 99) {
      throw new Error(
        `Body parameter '${fieldName}' must be an between 0 and 99`
      );
    }
    return true;
  }),
];

module.exports = [
  ...validatePercent({
    field: "ownerBaseCommissionPercent",
    fieldName: "Listing Owner Commission",
  }),
  ...validatePercent({
    field: "ownerBoostCommissionPercent",
    fieldName: "Listing Owner Commission For Boost Position",
  }),
  ...validatePercent({
<<<<<<< HEAD
<<<<<<< HEAD
    field: "tenantBaseCommissionPercent",
    fieldName: "Tenant Rent Commission",
  }),
  ...validatePercent({
    field: "tenantCancelFeePercent",
    fieldName: "Tenant Cancel Commission",
=======
=======
>>>>>>> 45e89f9 (start)
    field: "renterBaseCommissionPercent",
    fieldName: "Renter Rent Commission",
  }),
  ...validatePercent({
    field: "renterCancelFeePercent",
    fieldName: "Renter Cancel Commission",
<<<<<<< HEAD
>>>>>>> fad5f76 (start)
=======
>>>>>>> 45e89f9 (start)
  }),
];

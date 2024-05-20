const { validateSmallStringBody } = require("../base");

module.exports = [
  ...validateSmallStringBody({
    field: "bankAccountIban",
    fieldName: "Bank Account Iban",
  }),
  ...validateSmallStringBody({
    field: "bankAccountSwiftBic",
    fieldName: "Bank Account SWIFT/BIC",
  }),
  ...validateSmallStringBody({
    field: "bankAccountBeneficiary",
    fieldName: "Bank Account Beneficiary Name and Address",
  }),
  ...validateSmallStringBody({
    field: "bankAccountReferenceConceptCode",
    fieldName: "Bank Account Reference/Concept Code",
  }),
];

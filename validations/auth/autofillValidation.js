const { validateSmallStringBody } = require("../base");

module.exports = [...validateSmallStringBody({ field: "paypalId", fieldName:"Paypal Id" })];

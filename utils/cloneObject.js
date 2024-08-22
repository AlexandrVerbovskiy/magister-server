const _ = require("lodash");

module.exports = function (elem) {
  return _.cloneDeep(elem);
};

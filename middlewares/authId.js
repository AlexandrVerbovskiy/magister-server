const { validateToken } = require("../utils");

function authId(request, response, next) {
  const authorization = request.headers.authorization;

  if (!authorization) {
    request.userData = {};
    return next();
  }

  const token = authorization.split("Bearer ")[1];
  const resValidate = validateToken(token);

  if (!resValidate || !resValidate.userId) {
    request.userData = {};
    return next();
  }

  if (isNaN(resValidate.userId)) {
    request.userData = {};
    return next();
  }

  request.userData = {
    userId: resValidate.userId,
  };
  return next();
}

module.exports = authId;

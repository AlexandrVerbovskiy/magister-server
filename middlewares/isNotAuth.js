const STATIC = require("../static");
const { validateToken } = require("../utils");

function isNotAuth(request, response, next) {
  const authorization = request.headers.authorization;

  if (!authorization) return next();

  const token = authorization.split(" ")[1];
  const userId = validateToken(token);

  if (userId)
    return response
      .status(STATIC.ERRORS.FORBIDDEN.STATUS)
      .json({
        isError: true,
        message: STATIC.ERRORS.FORBIDDEN.DEFAULT_MESSAGE,
      });

  return next();
}

module.exports = isNotAuth;

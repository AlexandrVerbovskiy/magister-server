const STATIC = require("../static");
const { validateToken } = require("../utils");

function isAuth(request, response, next) {
  const authorization = request.headers.authorization;

  if (!authorization)
    return response.status(STATIC.ERRORS.UNAUTHORIZED.STATUS).json({
      isError: true,
      message: STATIC.ERRORS.UNAUTHORIZED.DEFAULT_MESSAGE,
    });

  const token = authorization.split(" ")[1];
  const userId = validateToken(token);

  if (!userId)
    return response.status(STATIC.ERRORS.UNAUTHORIZED.STATUS).json({
      isError: true,
      message: STATIC.ERRORS.UNAUTHORIZED.DEFAULT_MESSAGE,
    });

  request.userData = {
    userId,
  };
  return next();
}

module.exports = isAuth;

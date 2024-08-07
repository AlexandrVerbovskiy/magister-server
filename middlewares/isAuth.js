const STATIC = require("../static");
const { validateToken } = require("../utils");
const { userModel } = require("../models");

async function isAuth(request, response, next) {
  const authorization = request.headers.authorization;

  if (!authorization)
    return response.status(STATIC.ERRORS.UNAUTHORIZED.STATUS).json({
      isError: true,
      message: STATIC.ERRORS.UNAUTHORIZED.DEFAULT_MESSAGE,
    });

  const token = authorization.split("Bearer ")[1];
  const resValidate = validateToken(token);

  if (!resValidate || !resValidate.userId || isNaN(resValidate.userId)) {
    return response.status(STATIC.ERRORS.UNAUTHORIZED.STATUS).json({
      isError: true,
      message: STATIC.ERRORS.UNAUTHORIZED.DEFAULT_MESSAGE,
    });
  }

  const userId = resValidate.userId;
  const user = await userModel.getById(userId);

  if (!user) {
    return response.status(STATIC.ERRORS.UNAUTHORIZED.STATUS).json({
      isError: true,
      message: STATIC.ERRORS.UNAUTHORIZED.DEFAULT_MESSAGE,
    });
  }

  request.userData = {
    userId,
  };

  return next();
}

module.exports = isAuth;

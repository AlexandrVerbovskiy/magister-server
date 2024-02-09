const STATIC = require("../static");
const { validateToken } = require("../utils");

function isAuth(request, response, next) {
  const token = request.cookies.Bearer;

  if (!token)
    return response.status(STATIC.ERRORS.UNAUTHORIZED.STATUS).json({
      isError: true,
      message: STATIC.ERRORS.UNAUTHORIZED.DEFAULT_MESSAGE,
    });

  const resValidate = validateToken(token);

  if (!resValidate || !resValidate.userId)
    return response.status(STATIC.ERRORS.UNAUTHORIZED.STATUS).json({
      isError: true,
      message: STATIC.ERRORS.UNAUTHORIZED.DEFAULT_MESSAGE,
    });
    
  if (isNaN(resValidate.userId)) {
    return response.status(STATIC.ERRORS.UNAUTHORIZED.STATUS).json({
      isError: true,
      message: STATIC.ERRORS.UNAUTHORIZED.DEFAULT_MESSAGE,
    });
  }

  request.userData = {
    userId: resValidate.userId,
  };
  return next();
}

module.exports = isAuth;

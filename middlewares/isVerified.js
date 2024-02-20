const STATIC = require("../static");
const { userModel } = require("../models");

async function isVerified(request, response, next) {
  const { userId } = request.userData;

  try {
    const isVerified = await userModel.checkIsVerified(userId);

    if (!isVerified)
      return response.status(STATIC.ERRORS.FORBIDDEN.STATUS).json({
        isError: true,
        message: STATIC.ERRORS.FORBIDDEN.DEFAULT_MESSAGE,
      });
      
    return next();
  } catch (error) {
    console.error(error);

    return response.status(STATIC.ERRORS.UNPREDICTABLE.STATUS).json({
      isError: true,
      message: STATIC.ERRORS.FORBIDDEN.DEFAULT_MESSAGE,
    });
  }
}

module.exports = isVerified;

const STATIC = require("../static");
const db = require("../database");
const { UserModel } = require("../models");

async function isAdmin(request, response, next) {
  const userModel = new UserModel(db);
  const { userId } = request.userData;

  try {
    const isAdmin = await userModel.checkIsAdmin(userId);
    if (!isAdmin)
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

module.exports = isAdmin;

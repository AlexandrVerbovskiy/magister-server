const STATIC = require("../static");
const { generateAccessToken } = require("../utils");
const Controller = require("./controller");

class User extends Controller {
  __filterUserFields = (user) => {
    delete user["password"];
  };

  __noUserByEmailCheck = async (email) => {
    const userByEmail = await this.userModel.userByEmail(email);

    if (userByEmail)
      this.setErrorResponse(
        STATIC.ERRORS.DATA_CONFLICT,
        {},
        "Email was registered earlier"
      );

    return userByEmail;
  };

  register = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { name, email } = req.body;

      const resCheck = await this.__noUserByEmailCheck(email);
      if (resCheck) return;

      const id = await this.userModel.create(req.body);
      const token = await this.userModel.generateEmailVerifyToken(id);

      this.sendEmailVerificationMail(email, name, token);
      return this.setSuccessResponse(
        STATIC.SUCCESS.CREATED,
        {},
        "Account created successfully. An account confirmation letter has been sent to the email"
      );
    });

  registerAdmin = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userToSave = {
        ...req.body,
        role: STATIC.ROLES.ADMIN,
        active: true,
      };

      const resCheck = await this.__noUserByEmailCheck(email);
      if (resCheck) return;

      await this.userModel.create(userToSave);

      return this.setSuccessResponse(
        STATIC.SUCCESS.CREATED,
        {},
        "Account created successfully. Try to login on the site"
      );
    });

  login = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { email, password } = req.body;
      const user = await this.userModel.findByEmailAndPassword(email, password);

      if (!user) {
        return this.setErrorResponse(
          STATIC.ERRORS.UNAUTHORIZED,
          {},
          "Incorrect email or password"
        );
      }

      this.__filterUserFields(user);
      const accessToken = generateAccessToken(user.id);

      return this.setSuccessResponse(STATIC.SUCCESS.OK, { accessToken, user });
    });

  setRole = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id, role } = req.body;

      await this.userModel.setRole(id, role);

      return this.setSuccessResponse(
        STATIC.SUCCESS.OK,
        { id, role },
        "Role updated successfully"
      );
    });

  changeActive = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      const active = await this.userModel.changeActive(id);

      const message = active
        ? "User activated successfully"
        : "User deactivated successfully";

      return this.setSuccessResponse(
        STATIC.SUCCESS.OK,
        { id, active },
        message
      );
    });

  verifyEmail = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { token } = req.body;
      const userId = await this.userModel.getUserIdByEmailVerifiedToken(token);

      if (!userId) {
        return this.setErrorResponse(
          STATIC.ERRORS.BAD_REQUEST,
          {},
          "No user found"
        );
      }

      await this.userModel.setEmailVerified(userId);
      await this.userModel.removeEmailVerifiedToken(userId);

      return this.setSuccessResponse(
        STATIC.SUCCESS.OK,
        {},
        "Mail has been successfully verified. Try to log in"
      );
    });

  resetPassword = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { email } = req.body;
      const user = await this.userModel.userByEmail(email);

      if (!user) {
        return this.setErrorResponse(
          STATIC.ERRORS.BAD_REQUEST,
          {},
          "No user found"
        );
      }

      const token = await this.userModel.generateResetPasswordToken(user.id);

      this.sendPasswordResetMail(email, user.name, token);

      return this.setSuccessResponse(
        STATIC.SUCCESS.OK,
        {},
        '"Password reset" email sent successfully'
      );
    });

  setNewPassword = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { token, password } = req.body;
      const userId = await this.userModel.getUserIdByResetPasswordToken(token);

      if (!userId) {
        return this.setErrorResponse(
          STATIC.ERRORS.BAD_REQUEST,
          {},
          "No user found"
        );
      }

      await this.userModel.setNewPassword(userId, password);
      await this.userModel.removeResetPasswordToken(userId);

      return this.setSuccessResponse(
        STATIC.SUCCESS.OK,
        {},
        "Password updated successfully"
      );
    });

  updateSessionInfo = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const user = await this.userModel.getById(userId);

      if (!user) {
        return this.setErrorResponse(STATIC.ERRORS.UNAUTHORIZED);
      }

      this.__filterUserFields(user);
      const accessToken = generateAccessToken(user.id);

      return this.setSuccessResponse(STATIC.SUCCESS.OK, { accessToken, user });
    });

    list = (req, res) =>this.baseWrapper(req, res, async () => {
      const { page, filter, order, orderType } = req.body;

    });
}

module.exports = new User();

const { Exception } = require("handlebars");
const STATIC = require("../static");
const { generateAccessToken } = require("../utils");
const BaseController = require("./baseController");
const CLIENT_URL = process.env.CLIENT_URL;

class UserController extends BaseController {
  constructor() {
    super();
  }

  filterUserFields = (user) => {
    delete user["password"];
  };

  noUserByEmailCheck = async (email) => {
    const getByEmail = await this.userModel.getByEmail(email);

    if (getByEmail)
      this.sendErrorResponse(
        res,
        STATIC.ERRORS.DATA_CONFLICT,
        "Email was registered earlier"
      );

    return getByEmail;
  };

  register = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { name, email } = req.body;

      const resCheck = await this.noUserByEmailCheck(email);
      if (resCheck) return;

      const id = await this.userModel.create(req.body);
      const token = await this.userModel.generateEmailVerifyToken(id);

      this.sendEmailVerificationMail(email, name, token);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.CREATED,
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

      const resCheck = await this.noUserByEmailCheck(email);
      if (resCheck) return;

      await this.userModel.create(userToSave);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.CREATED,
        "Account created successfully. Try to login on the site"
      );
    });

  login = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { email, password } = req.body;
      const user = await this.userModel.findByEmailAndPassword(email, password);

      if (!user) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.UNAUTHORIZED,
          "Incorrect email or password"
        );
      }

      if (!user.emailVerified) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.UNAUTHORIZED,
          "The mail was not confirmed. Instructions for confirmation were sent to the mail in the letter when the account was created"
        );
      }

      //if (!user.twoFactorAuthentication) {
      this.filterUserFields(user);
      const accessToken = generateAccessToken(user.id);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        accessToken,
        user,
        needCode: false,
      });
      /*} else {
        return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
          user: {
            email: user.email,
            phone: user.phone,
            id: user.id,
            name: user.name,
          },
          needCode: true,
        });
      }*/
    });

  setRole = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id, role } = req.body;

      await this.userModel.setRole(id, role);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Role updated successfully",
        { id, role }
      );
    });

  changeActive = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      const active = await this.userModel.changeActive(id);

      const message = active
        ? "User activated successfully"
        : "User deactivated successfully";

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, message, {
        id,
        active,
      });
    });

  verifyEmail = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { token } = req.body;
      const userId = await this.userModel.getUserIdByEmailVerifiedToken(token);

      if (!userId) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          "No user found"
        );
      }

      await this.userModel.setEmailVerified(userId);
      await this.userModel.removeEmailVerifiedToken(userId);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Mail has been successfully verified. Try to log in"
      );
    });

  resetPassword = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { email } = req.body;
      const user = await this.userModel.getByEmail(email);

      if (!user) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          "No user found"
        );
      }

      const token = await this.userModel.generateResetPasswordToken(user.id);

      this.sendPasswordResetMail(email, user.name, token);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        '"Password reset" email sent successfully'
      );
    });

  setNewPassword = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { token, password } = req.body;
      const userId = await this.userModel.getUserIdByResetPasswordToken(token);

      if (!userId) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          "No user found"
        );
      }

      await this.userModel.setNewPassword(userId, password);
      await this.userModel.removeResetPasswordToken(userId);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Password updated successfully"
      );
    });

  updateSessionInfo = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const user = await this.userModel.getById(userId);

      if (!user) {
        return this.sendErrorResponse(res, STATIC.ERRORS.UNAUTHORIZED);
      }

      const accessToken = generateAccessToken(user.id);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        accessToken,
        user,
      });
    });

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { options, countItems } = await this.baseListOptions(
        req,
        ({ filter }) => this.userModel.totalCount(filter)
      );

      const users = await this.userModel.list(options);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        items: users,
        options,
        countItems,
      });
    });

  delete = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      this.userModel.delete(id);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  getById = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const user = await this.userModel.getById(id);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, user);
    });

  update = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const dataToSave = req.body;
      const { id, email } = dataToSave;
      const userByEmail = await this.userModel.getByEmail(email);
      let photo = null;

      if (req.file) {
        photo = this.moveUploadsFileToFolder(req.file, "users");
        dataToSave["photo"] = photo;
      }

      if (userByEmail && id != userByEmail.id)
        throw new Error(`User with email '${email}' already exists`);

      await this.userModel.updateById(id, req.body);

      const data = { id };

      if (photo) {
        data["photo"] = photo;
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, data);
    });

  sendPhoneVerify = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const { type } = req.body;
      const resGenerate = await this.userModel.generatePhoneVerifyCode(userId);

      if (!resGenerate) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.NOT_FOUND,
          "No user found"
        );
      }

      const { phone, code } = resGenerate;

      if (!phone) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.INVALID_KEY_DATA,
          "Your account does not have a phone number saved"
        );
      }

      this.sendToPhoneVerifyCodeMessage(phone, code, type);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Code successfully sent"
      );
    });

  phoneVerify = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { code } = req.body;
      const { userId } = req.userData;
      const gotUserId = await this.userModel.getUserIdByPhoneVerifyCode(code);

      if (!gotUserId || gotUserId != userId) {
        this.sendErrorResponse(
          res,
          STATIC.ERRORS.INVALID_KEY_DATA,
          "Invalid OTP code"
        );
      }

      await this.userModel.setPhoneVerified(userId);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Phone number successfully verified"
      );
    });

  redirectToFrontMoreInfoForm = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const name = req.user.name[0].givenName;
      const email = req.user.emails[0].value;

      const user = await this.userModel.getByEmail(email);

      const newLink = `${CLIENT_URL}/${STATIC.CLIENT_LINKS.PROFILE_COMPETING}?id=${id}`;

      res.redirect(newLink);
    });

  twoFactorAuthVerify = (req, res) =>
    this.baseWrapper(req, res, async () => {});

  test = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      throw new Error("test");
    });
}

module.exports = new UserController();

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

  register = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { name, email, password, acceptedTermCondition } = req.body;

      console.log(req.body);

      const getByEmail = await this.userModel.getByEmail(email);

      if (getByEmail) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "Email was registered earlier"
        );
      }

      const id = await this.userModel.create({
        name,
        email,
        password,
        acceptedTermCondition,
      });

      const token = await this.userModel.generateEmailVerifyToken(id);

      this.sendEmailVerificationMail(email, name, token);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.CREATED,
        "Account created successfully. An account confirmation letter has been sent to the email"
      );
    });

  baseEmailPasswordCheck = async (req) => {
    const { email, password } = req.body;
    const user = await this.userModel.findByEmailAndPassword(email, password);

    if (!user) {
      return {
        error: true,
        errorBody: STATIC.ERRORS.UNAUTHORIZED,
        errorMessage: "Incorrect email or password",
      };
    }

    if (!user.emailVerified) {
      return {
        error: true,
        errorBody: STATIC.ERRORS.UNAUTHORIZED,
        errorMessage:
          "The mail was not confirmed. Instructions for confirmation were sent to the mail in the letter when the account was created",
      };
    }

    if (!user.active) {
      return {
        error: true,
        errorBody: STATIC.ERRORS.UNAUTHORIZED,
        errorMessage:
          "Your account has been blocked. For more information, contact the administrator",
      };
    }

    return { error: false, user };
  };

  login = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const resCheck = await this.baseEmailPasswordCheck(req);
      resCheck;

      if (resCheck.error) {
        return this.sendErrorResponse(
          res,
          resCheck.errorBody,
          resCheck.errorMessage
        );
      }

      const user = resCheck.user;

      //if (!user.twoFactorAuthentication) {
      this.filterUserFields(user);
      const accessToken = generateAccessToken(user.id);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        accessToken,
        user,
        needCode: false,
        canSendCodeByPhone: user.phoneVerified,
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

  twoFactorAuthGenerate = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const resCheck = await this.baseEmailPasswordCheck(req);

      if (resCheck.error) {
        return this.sendErrorResponse(
          res,
          resCheck.errorBody,
          resCheck.errorMessage
        );
      }

      const { type } = req.body;
      const user = resCheck.user;

      if (type == "phone" && !user.phoneVerified) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          "Does not have a verified phone number"
        );
      }

      const resSave = await this.userModel.generateTwoAuthCode(user.id, type);

      if (type == "phone") {
        await this.sendToPhoneTwoAuthCodeMessage(user.phone, resSave.code);
      } else {
        await this.sendTwoAuthCodeMail(user.email, user.name, resSave.code);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null);
    });

  twoFactorAuthVerify = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { code, type, id } = req.body;
      const userId = await this.userModel.getUserIdByTwoAuthCode(code, type);

      if (!userId || userId != id) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          "The code is not valid"
        );
      }

      const accessToken = generateAccessToken(userId);
      const user = await this.userModel.getFullById(userId);
      delete user["password"];

      await this.userModel.removeTwoAuthCode(code, type, userId);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        accessToken,
        user,
      });
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

  changeVerified = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      const verified = await this.userModel.changeVerified(id);

      const message = verified
        ? "User verified successfully"
        : "User unverified successfully";

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, message, {
        id,
        verified,
      });
    });

  verifyEmail = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { email, token } = req.body;
      const userId = await this.userModel.getUserIdByEmailVerifiedToken(token);

      if (!userId) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          "The token is not valid"
        );
      }

      const user = await this.userModel.getById(userId);

      if (user.email !== email) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          "The token is not valid"
        );
      }

      await this.userModel.setEmailVerified(userId);
      await this.userModel.removeEmailVerifiedToken(userId);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Mail verified successfully. For further actions, log in to the site"
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
        "Email sent successfully"
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
          "The token is not valid"
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
      const user = await this.userModel.getFullById(userId);

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

  getFullById = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const user = await this.userModel.getFullById(id);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, user);
    });

  baseUpdate = async (id, dataToSave, file) => {
    const { email } = dataToSave;
    const userByEmail = await this.userModel.getByEmail(email);
    let photo = null;

    if (file) {
      photo = this.moveUploadsFileToFolder(file, "users");
      dataToSave["photo"] = photo;
    }

    if (userByEmail && id != userByEmail.id)
      throw new Error(`User with email '${email}' already exists`);

    const info = await this.userModel.getById(id);

    const newPhone = dataToSave["phone"];

    if (info.phone != newPhone && dataToSave["phoneVerified"] !== null) {
      dataToSave["phoneVerified"] = false;
    }

    if (file && info.photo) {
      this.removeFile(info.photo);
    }

    await this.userModel.updateById(id, dataToSave);

    return { ...dataToSave, id };
  };

  update = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const dataToSave = req.body;
      const { id } = dataToSave;
      const user = await this.baseUpdate(id, dataToSave, req.file);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, { user });
    });

  saveProfile = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const dataToSave = req.body;
      const { userId } = req.userData;

      const user = await this.baseUpdate(userId, dataToSave, req.file);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, { user });
    });
  };

  sendVerifyPhone = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
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

      await this.sendToPhoneVerifyCodeMessage(phone, code);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Code successfully sent"
      );
    });

  verifyPhone = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { code } = req.body;
      const { userId } = req.userData;
      const gotUserId = await this.userModel.getUserIdByPhoneVerifyCode(code);

      if (!gotUserId || gotUserId != userId) {
        return this.sendErrorResponse(
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
      const name = req.user.displayName;
      const email = req.user.emails[0].value;

      const user = await this.userModel.getByEmail(email);

      let userId = null;

      if (user) {
        userId = user.id;
      } else {
        userId = await this.userModel.create({
          name,
          email,
          acceptedTermCondition: true,
          emailVerified: true,
          needSetPassword: true,
        });
      }

      const accessToken = generateAccessToken(userId);
      const authLink = `${CLIENT_URL}/${STATIC.CLIENT_LINKS.USER_AUTHORIZED}?token=${accessToken}`;
      return res.redirect(authLink);
    });

  myInfo = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const user = await this.userModel.getFullById(userId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, { user });
    });

  myDocuments = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const documents = await this.userModel.getDocumentsByUserId(userId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        documents,
      });
    });

  getDocumentsByUserId = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.body;
      const documents = await this.userModel.getDocumentsByUserId(userId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        documents,
      });
    });

  setMyPassword = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const { password } = req.body;

      const isEmpty = await this.userModel.checkUserPasswordEmpty(userId);

      if (isEmpty) {
        return this.sendErrorResponse(res, STATIC.ERRORS.BAD_REQUEST);
      }

      await this.userModel.setNewPassword(userId, password);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null);
    });

  updateMyPassword = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const { currentPassword, newPassword } = req.body;

      const isEqual = await this.userModel.checkUserPasswordEqual(
        userId,
        currentPassword
      );

      if (!isEqual) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.INVALID_KEY_DATA,
          "The current password is incorrect"
        );
      }

      await this.userModel.setNewPassword(userId, newPassword);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null);
    });

  getFileByName = (req, name) =>
    req.files.find((field) => field.fieldname == name);

  updateMyDocuments = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      let proofOfAddress = this.getFileByName(req, "proofOfAddress");
      let reputableBankId = this.getFileByName(req, "reputableBankId");
      let utility = this.getFileByName(req, "utility");
      let hmrc = this.getFileByName(req, "hmrc");
      let councilTaxBill = this.getFileByName(req, "councilTaxBill");
      let passportOrDrivingId = this.getFileByName(req, "passportOrDrivingId");
      let confirmMoneyLaunderingChecksAndCompliance = this.getFileByName(
        req,
        "confirmMoneyLaunderingChecksAndCompliance"
      );

      const dataToSave = {};
      const folder = "documents/" + userId;

      if (proofOfAddress) {
        proofOfAddress = this.moveUploadsFileToFolder(proofOfAddress, folder);
        dataToSave["proofOfAddressLink"] = proofOfAddress;
      }

      if (reputableBankId) {
        reputableBankId = this.moveUploadsFileToFolder(reputableBankId, folder);
        dataToSave["newReputableBankIdLink"] = reputableBankId;
      }

      if (utility) {
        utility = this.moveUploadsFileToFolder(utility, folder);
        dataToSave["utilityLink"] = utility;
      }

      if (hmrc) {
        hmrc = this.moveUploadsFileToFolder(hmrc, folder);
        dataToSave["hmrcLink"] = hmrc;
      }

      if (councilTaxBill) {
        councilTaxBill = this.moveUploadsFileToFolder(councilTaxBill, folder);
        dataToSave["councilTaxBillLink"] = councilTaxBill;
      }

      if (passportOrDrivingId) {
        passportOrDrivingId = this.moveUploadsFileToFolder(
          passportOrDrivingId,
          folder
        );
        dataToSave["passportOrDrivingIdLink"] = passportOrDrivingId;
      }

      if (confirmMoneyLaunderingChecksAndCompliance) {
        confirmMoneyLaunderingChecksAndCompliance =
          this.moveUploadsFileToFolder(
            confirmMoneyLaunderingChecksAndCompliance,
            folder
          );
        dataToSave["confirmMoneyLaunderingChecksAndComplianceLink"] =
          confirmMoneyLaunderingChecksAndCompliance;
      }

      if (Object.keys(dataToSave).length > 0) {
        const currentUserDocuments = await this.userModel.getDocumentsByUserId(
          userId
        );

        if (Object.keys(currentUserDocuments).length > 0) {
          await this.userModel.updateUserDocuments(userId, dataToSave);

          Object.keys(dataToSave).forEach((key) => {
            if (currentUserDocuments[key]) {
              this.removeFile(currentUserDocuments[key]);
            }
          });
        } else {
          await this.userModel.createUserDocuments(userId, dataToSave);
        }
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        documents: dataToSave,
      });
    });

  test = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      throw new Error("test");
    });
}

module.exports = new UserController();

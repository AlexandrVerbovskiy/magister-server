const STATIC = require("../static");
const {
  generateAccessToken,
  generateVerifyToken,
  validateToken,
} = require("../utils");
const Controller = require("./Controller");
const fetch = require("node-fetch");
const { OAuth2Client } = require("google-auth-library");

class UserController extends Controller {
  filterUserFields = (user) => {
    delete user["password"];
  };

  getEmailByFacebookToken = async (authToken) => {
    const url = `https://graph.facebook.com/me?fields=email&access_token=${authToken}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.email;
  };

  getEmailByGoogleToken = async (idToken) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_API);
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_API,
      });
      const payload = ticket.getPayload();
      const userEmail = payload["email"];
      return userEmail;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  authByProvider = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { name, email, token, provider } = req.body;
      let emailByToken = null;

      if (!email) {
        if (provider.toLowerCase() == "google") {
          return this.sendErrorResponse(
            res,
            STATIC.ERRORS.DATA_CONFLICT,
            "Your Google account has no email. Please add email to your account and try to register again"
          );
        }

        if (provider.toLowerCase() == "facebook") {
          return this.sendErrorResponse(
            res,
            STATIC.ERRORS.DATA_CONFLICT,
            "Your Facebook account has no email. Please add email to your account and try to register again"
          );
        }
      }

      if (provider.toLowerCase() == "google") {
        emailByToken = await this.getEmailByGoogleToken(token);
      }

      if (provider.toLowerCase() == "facebook") {
        emailByToken = await this.getEmailByFacebookToken(token);
      }

      if (!emailByToken || email !== emailByToken) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "Invalid token"
        );
      }

      const user = await this.userModel.getByEmail(email);

      let emailVerified = true;
      let needRegularViewInfoForm = true;

      let userId = null;

      if (user) {
        if (!user.active || user.deleted) {
          return this.sendErrorResponse(
            res,
            STATIC.ERRORS.UNAUTHORIZED,
            "Your account has been blocked. For more information, contact the administrator"
          );
        }

        userId = user.id;
        needRegularViewInfoForm = user.needRegularViewInfoForm;
      } else {
        userId = await this.userModel.create({
          name,
          email,
          emailVerified,
          acceptedTermCondition: true,
          hasPasswordAccess: false,
        });
      }

      const authToken = generateAccessToken(userId, true);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        needRegularViewInfoForm,
        authToken,
        userId,
      });
    });

  register = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { name, email, password, acceptedTermCondition } = req.body;

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

      const user = await this.userModel.getFullById(id);

      const emailVerifyToken = generateVerifyToken({ userId: id });

      this.sendEmailVerificationMail(email, name, emailVerifyToken);

      const authToken = generateAccessToken(user.id, false);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.CREATED,
        "Account created successfully. An account confirmation letter has been sent to the email",
        {
          user,
          authToken,
          userId: user.id,
          needCode: false,
          canSendCodeByPhone: user.phoneVerified,
          needRegularViewInfoForm: user.needRegularViewInfoForm,
        }
      );
    });

  sendVerifyEmail = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { email } = req.body;
      const getByEmail = await this.userModel.getByEmail(email);

      if (!getByEmail) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "Email wasn't found"
        );
      }

      const emailVerifyToken = generateVerifyToken({ userId: getByEmail.id });

      this.sendEmailVerificationMail(email, getByEmail.name, emailVerifyToken);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Letter created successfully. An account confirmation letter has been sent to the email"
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

    if (!user.active || user.deleted) {
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

      if (resCheck.error) {
        return this.sendErrorResponse(
          res,
          resCheck.errorBody,
          resCheck.errorMessage
        );
      }

      const user = resCheck.user;
      const rememberMe = req.body.rememberMe == true;

      if (!user.twoFactorAuthentication) {
        this.filterUserFields(user);
        const authToken = generateAccessToken(user.id, rememberMe);

        return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
          user,
          authToken,
          userId: user.id,
          needCode: false,
          canSendCodeByPhone: user.phoneVerified,
          needRegularViewInfoForm: user.needRegularViewInfoForm,
        });
      } else {
        if (user.phone && user.phoneVerified) {
          return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
            user: {
              email: user.email,
              phone: user.phone,
              id: user.id,
              name: user.name,
            },
            needCode: true,
            codeSent: false,
          });
        } else {
          const resSave = await this.userModel.generateTwoAuthCode(
            user.id,
            "email"
          );

          this.sendTwoAuthCodeMail(user.email, user.name, resSave.code);

          return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
            user: {
              email: user.email,
              phone: user.phone,
              id: user.id,
              name: user.name,
            },
            needCode: true,
            codeSent: true,
          });
        }
      }
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

      const type = req.body.type.toLowerCase();
      const user = resCheck.user;

      if (type == "phone" && !user.phoneVerified) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          "Does not have a verified phone number"
        );
      }

      const resSave = await this.userModel.generateTwoAuthCode(user.id, type);

      let message = "";

      if (type == "phone") {
        await this.sendToPhoneTwoAuthCodeMessage(user.phone, resSave.code);
        message = "The code has been successfully sent to the mobile phone";
      } else {
        await this.sendTwoAuthCodeMail(user.email, user.name, resSave.code);
        message = "The code has been successfully sent to the email";
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, message);
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

      const rememberMe = req.body.rememberMe == true;
      const authToken = generateAccessToken(userId, rememberMe);

      const user = await this.userModel.getFullById(userId);
      delete user["password"];

      await this.userModel.removeTwoAuthCode(code, type, userId);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        user,
        authToken,
        userId: user.id,
        needRegularViewInfoForm: user.needRegularViewInfoForm,
      });
    });

  setRole = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id, role } = req.body;

      if (role === "admin") {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      await this.userModel.setRole(id, role);

      this.saveUserAction(
        req,
        `Set role '${role}' for the user with id '${id}'`
      );

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

      const hasOrders = await this.orderModel.getUserTotalCountOrders(id);

      if (hasOrders) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.FORBIDDEN,
          "User has unfinished orders"
        );
      }

      this.saveUserAction(
        req,
        `Made user with id '${id}' ${active ? "active" : "inactive"}`
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, message, {
        id,
        active,
      });
    });

  changeTwoFactorAuth = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const twoFactorAuthentication = await this.userModel.changeTwoFactorAuth(
        userId
      );

      const message = twoFactorAuthentication
        ? "Two-Factor Authentication activated successfully"
        : "Two-Factor Authentication deactivated successfully";

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, message, {
        id: userId,
        twoFactorAuthentication,
      });
    });

  changeVerified = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      const verified = await this.userModel.changeVerified(id);

      if (verified) {
        await this.userVerifyRequestModel.updateUserVerifyById(id);
      }

      const message = verified
        ? "User verified successfully"
        : "User unverified successfully";

      this.saveUserAction(
        req,
        `Made user with id '${id}' ${verified ? "verified" : "unverified"}`
      );
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, message, {
        id,
        verified,
      });
    });

  baseVerifyEmail = async (email, token) => {
    const resValidate = validateToken(token);

    if (!resValidate || !resValidate.userId) {
      return {
        error: STATIC.ERRORS.BAD_REQUEST,
        message: "Token is not valid",
      };
    }

    const userId = resValidate.userId;
    const user = await this.userModel.getByIdWithEmailVerified(userId);

    if (user.email !== email || user.emailVerified) {
      return {
        error: STATIC.ERRORS.BAD_REQUEST,
        message: "Token is not valid",
      };
    }

    await this.userModel.setEmailVerified(userId);

    return { error: null };
  };

  verifyEmail = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { email, token } = req.body;
      const result = await this.baseVerifyEmail(email, token);

      if (result.error) {
        return this.sendErrorResponse(res, result.error, result.message);
      }

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

      if (!user.hasPasswordAccess) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          "The user can log into the account only through Google or Facebook"
        );
      }

      const resetPasswordToken = generateVerifyToken({ userId: user.id });

      this.sendPasswordResetMail(email, user.name, resetPasswordToken);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Email sent successfully"
      );
    });

  setNewPassword = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { token, password } = req.body;
      const resValidate = validateToken(token);

      if (!resValidate || !resValidate.userId) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          "Token is not valid"
        );
      }

      const userId = resValidate.userId;

      const checkPasswordEquals = await this.userModel.checkUserPasswordEqual(
        userId,
        password
      );

      if (checkPasswordEquals) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          "New password can't be equal with current password"
        );
      }

      await this.userModel.setNewPassword(userId, password);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Password updated successfully"
      );
    });

  baseUserList = async (req) => {
    const timeInfos = await this.listTimeNameOption(req);

    const { active = "all", role = "all", verified = "all" } = req.body;

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
      this.userModel.totalCount(filter, timeInfos, { active, role, verified })
    );

    options = this.addTimeInfoToOptions(options, timeInfos);

    options["active"] = active;
    options["role"] = role;
    options["verified"] = verified;

    let users = await this.userModel.list(options);

<<<<<<< HEAD
    users = await this.tenantCommentModel.bindAverageForKeyEntities(
      users,
      "id",
      {
        commentCountName: "tenantCommentCount",
        averageRatingName: "tenantAverageRating",
=======
    users = await this.renterCommentModel.bindAverageForKeyEntities(
      users,
      "id",
      {
        commentCountName: "renterCommentCount",
        averageRatingName: "renterAverageRating",
>>>>>>> fad5f76 (start)
      }
    );

    users = await this.ownerCommentModel.bindAverageForKeyEntities(
      users,
      "id",
      {
        commentCountName: "ownerCommentCount",
        averageRatingName: "ownerAverageRating",
      }
    );

<<<<<<< HEAD
    users = await this.disputeModel.bindTenantsCounts(
      users,
      "id",
      "tenantDisputesCount"
    );

    users = await this.disputeModel.bindTenantsCounts(
=======
    users = await this.disputeModel.bindRentersCounts(
      users,
      "id",
      "renterDisputesCount"
    );

    users = await this.disputeModel.bindRentersCounts(
>>>>>>> fad5f76 (start)
      users,
      "id",
      "ownerDisputesCount"
    );

    return {
      items: users,
      options,
      countItems,
    };
  };

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseUserList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  delete = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;

      const { userId: currentId } = req.userData;

      if (id == currentId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const hasOrders = await this.orderModel.getUserTotalCountOrders(id);

      if (hasOrders) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.FORBIDDEN,
          "User has unfinished orders"
        );
      }

      await this.userModel.delete(id);

      this.saveUserAction(req, `Removed user with id '${id}'`);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  getById = (req, res) => this.baseGetById(req, res, this.userModel);

  getFullById = (req, res) =>
    this.baseGetById(req, res, this.userModel, "getFullById");

  baseCheckEmailUnique = async (dataToSave, id = null) => {
    const { email } = dataToSave;
    const userByEmail = await this.userModel.getByEmail(email);

    if (userByEmail && id != userByEmail.id)
      throw new Error(`User with email '${email}' already exists`);
  };

  baseUpdate = async (id, dataToSave, file) => {
    if (dataToSave["email"]) {
      await this.baseCheckEmailUnique(dataToSave, id);
    }

    if (file) {
      dataToSave["photo"] = await this.moveUploadsFileToFolder(file, "users");
    }

    const info = await this.userModel.getById(id);

    const newPhone = dataToSave["phone"] ?? null;

    if (info.phone != newPhone && dataToSave["phoneVerified"] !== null) {
      dataToSave["phoneVerified"] = false;
    }

    if (file && info.photo) {
      this.removeFile(info.photo);
    }

    await this.userModel.updateById(id, dataToSave);
    return await this.userModel.getFullById(id);
  };

  update = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const dataToSave = req.body;
      const { id, role } = dataToSave;
      const { userId: currentId } = req.userData;

      if (id == currentId || role === "admin") {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (dataToSave["verified"] === "true") {
        await this.userVerifyRequestModel.updateUserVerifyById(id);
      }

      if (!dataToSave["paypalId"]) {
        dataToSave["paypalId"] = "";
      }

      const user = await this.baseUpdate(id, dataToSave, req.file);
      this.saveUserAction(req, `Updated user with id '${id}'`);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, { user });
    });

  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const dataToSave = req.body;
      await this.baseCheckEmailUnique(dataToSave);

      if (req.file) {
        dataToSave["photo"] = await this.moveUploadsFileToFolder(
          req.file,
          "users"
        );
      }

      const userId = await this.userModel.createFull(dataToSave);
      const user = await this.userModel.getFullById(userId);

      this.saveUserAction(req, `Created user. Generated id '${userId}'`);

      const resetPasswordToken = generateVerifyToken({ userId });
      this.sendAccountCreationMail(user.email, user.name, resetPasswordToken);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        user,
      });
    });

  saveProfile = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const dataToSave = req.body;
      const { userId } = req.userData;

      dataToSave["needRegularViewInfoForm"] = false;
      delete dataToSave["email"];

      const user = await this.baseUpdate(userId, dataToSave, req.file);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, { user });
    });

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

  myInfo = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const user = await this.userModel.getFullById(userId);
      delete user["password"];
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, { user });
    });

  getDocumentsByUserId = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.body;

      const documents = await this.userModel.getDocumentsByUserId(userId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        documents,
      });
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

      const isNewEqual = await this.userModel.checkUserPasswordEqual(
        userId,
        newPassword
      );

      if (isNewEqual) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.INVALID_KEY_DATA,
          "New password can be equal to the current password"
        );
      }

      await this.userModel.setNewPassword(userId, newPassword);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null);
    });

  updateMyDocuments = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      let userPhoto = this.getFileByName(req, "userPhoto");
      let documentFront = this.getFileByName(req, "documentFront");
      let documentBack = this.getFileByName(req, "documentBack");

      const dataToSave = {};
      const folder = "documents/" + userId;

      if (userPhoto) {
        userPhoto = await this.moveUploadsFileToFolder(userPhoto, folder);
        dataToSave["userPhoto"] = userPhoto;
      }

      if (documentFront) {
        documentFront = await this.moveUploadsFileToFolder(
          documentFront,
          folder
        );
        dataToSave["documentFront"] = documentFront;
      }

      if (documentBack) {
        documentBack = await this.moveUploadsFileToFolder(documentBack, folder);
        dataToSave["documentBack"] = documentBack;
      }

      if (Object.keys(dataToSave).length > 0) {
        const user = await this.userModel.getFullById(userId);

        if (user.verified) {
          await this.userModel.setVerified(userId, false);
          this.sendProfileVerificationMail(user.email);
        }

        const hasUnansweredRequest =
          await this.userVerifyRequestModel.checkUserHasUnansweredRequest(
            userId
          );

        if (!hasUnansweredRequest) {
          this.userVerifyRequestModel.create(userId);
        }

        const currentUserDocuments = await this.userModel.getDocumentsByUserId(
          userId
        );

        let hasRealPhoto = false;

        Object.keys(currentUserDocuments).forEach((documentKey) => {
          if (currentUserDocuments[documentKey]) {
            hasRealPhoto = true;
          }
        });

        if (hasRealPhoto) {
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
}

module.exports = UserController;

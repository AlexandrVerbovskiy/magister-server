require("dotenv").config();

const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const {
  timeConverter,
  getDateByCurrentAdd,
  getDateByCurrentReject,
  adaptClientTimeToServer,
  clientServerHoursDifference,
} = require("../utils");

const {
  userModel,
  logModel,
  userVerifyRequestModel,
  systemOptionModel,
  userEventLogModel,
  listingCategoriesModel,
  searchedWordModel,
  listingModel,
  listingApprovalRequestModel,
} = require("../models");

const STATIC = require("../static");
const { generateRandomString } = require("../utils");
const CLIENT_URL = process.env.CLIENT_URL;
const axios = require("axios");

class Controller {
  mailTransporter = null;

  constructor() {
    this.userModel = userModel;
    this.logModel = logModel;
    this.userVerifyRequestModel = userVerifyRequestModel;
    this.systemOptionModel = systemOptionModel;
    this.userEventLogModel = userEventLogModel;
    this.listingCategoriesModel = listingCategoriesModel;
    this.searchedWordModel = searchedWordModel;
    this.listingModel = listingModel;
    this.listingApprovalRequestModel = listingApprovalRequestModel;

    this.mailTransporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    this.mailTransporter.use(
      "compile",
      hbs({
        viewEngine: {
          partialsDir: path.resolve("./mails/"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./mails/"),
      })
    );
  }

  sendResponse = (response, baseInfo, message, body, isError) => {
    return response.status(baseInfo.STATUS).json({
      message: message ?? baseInfo.DEFAULT_MESSAGE,
      body,
      isError,
    });
  };

  sendSuccessResponse = (
    response,
    baseInfo = null,
    message = null,
    body = {}
  ) => {
    if (!baseInfo) baseInfo = STATIC.SUCCESS.OK;
    return this.sendResponse(response, baseInfo, message, body, false);
  };

  sendErrorResponse = (response, baseInfo, message = null, body = {}) => {
    return this.sendResponse(response, baseInfo, message, body, true);
  };

  baseWrapper = async (req, res, func) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error = errors.array()[0].msg;
        return this.sendErrorResponse(res, STATIC.ERRORS.BAD_REQUEST, error);
      }

      await func();
    } catch (e) {
      console.log(e);
      const errorType = e.type ?? STATIC.ERRORS.UNPREDICTABLE.KEY;

      const currentErrorKey = Object.keys(STATIC.ERRORS).find(
        (error) => STATIC.ERRORS[error].KEY === errorType
      );

      if (errorType === STATIC.ERRORS.UNPREDICTABLE.KEY) {
        try {
          this.logModel.saveByBodyError(e.stack, e.message);
        } catch (localError) {}
      }

      const currentError = STATIC.ERRORS[currentErrorKey];
      this.sendErrorResponse(res, currentError, e.message);
    }
  };

  sendMail = async (to, subject, template, context) => {
    const mailOptions = {
      from: `"${process.env.MAIL_FROM}" ${process.env.MAIL_EMAIL}`,
      to,
      subject,
      template,
      context,
    };

    try {
      return await this.mailTransporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  sendEmailVerificationMail = async (email, name, token) => {
    const title = "Account Verification";
    await this.sendMail(email, title, "emailVerification", {
      name,
      link:
        CLIENT_URL + "/" + STATIC.CLIENT_LINKS.EMAIL_VERIFICATION + "/" + token,
      title,
    });
  };

  sendPasswordResetMail = async (email, name, token) => {
    const title = "Reset Password";
    await this.sendMail(email, title, "passwordReset", {
      name,
      link: CLIENT_URL + "/" + STATIC.CLIENT_LINKS.PASSWORD_RESET + "/" + token,
      title,
    });
  };

  sendAccountCreationMail = async (email, name, token) => {
    const title = "Account Creation";
    await this.sendMail(email, title, "accountCreation", {
      name,
      link: CLIENT_URL + "/" + STATIC.CLIENT_LINKS.PASSWORD_RESET + "/" + token,
      title,
    });
  };

  sendTwoAuthCodeMail = async (email, name, code) => {
    const title = "Two Authentication Code";
    await this.sendMail(email, title, "twoAuthCode", {
      name,
      code,
    });
  };

  moveUploadsFileToFolder = (file, folder) => {
    const originalFilePath = file.path;
    const name = generateRandomString();
    const type = mime.extension(file.mimetype) || "bin";

    const destinationDir = path.join(STATIC.MAIN_DIRECTORY, "public", folder);

    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    const newFilePath = path.join(destinationDir, name + "." + type);
    fs.renameSync(originalFilePath, newFilePath);
    return folder + "/" + name + "." + type;
  };

  removeFile = (filePath) => {
    const fullPath = path.join(STATIC.MAIN_DIRECTORY, "public", filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  };

  sendToPhoneMessage = async (phone, text) => {
    const data = {
      recipients: [phone],
      sms: {
        sender: process.env.TURBOSMS_SENDER,
        text,
      },
    };

    const url = `https://api.turbosms.ua/message/send.json?token=${process.env.TURBOSMS_TOKEN}`;

    const res = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data.response_result;
  };

  sendToPhoneVerifyCodeMessage = async (phone, code) => {
    await this.sendToPhoneMessage(phone, `Your OTP code is: ${code}`);
  };

  sendToPhoneTwoAuthCodeMessage = async (phone, code) => {
    await this.sendToPhoneMessage(phone, `Your Authorization code is: ${code}`);
  };

  baseList = async (req, countByFilter) => {
    const {
      filter = "",
      itemsPerPage = 20,
      order = null,
      orderType,
    } = req.body;

    let { page = 1 } = req.body;

    const countItems = await countByFilter(req.body);
    const totalPages =
      countItems > 0 ? Math.ceil(countItems / itemsPerPage) : 1;

    if (page > totalPages) page = totalPages;

    const start = (page - 1) * itemsPerPage;

    return {
      options: {
        filter,
        order,
        orderType: orderType ?? "asc",
        start,
        count: itemsPerPage,
        page,
        totalPages,
      },
      countItems,
    };
  };

  listTimeOption = async (
    req,
    startFromCurrentDaysAdd = 1,
    endToCurrentDaysReject = 0
  ) => {
    const { clientTime } = req.body;
    const clientServerHoursDiff = clientServerHoursDifference(clientTime);

    let { fromTime, toTime } = req.body;

    if (!fromTime) {
      fromTime = timeConverter(
        getDateByCurrentReject(clientTime, startFromCurrentDaysAdd)
      );
    }

    if (!toTime) {
      toTime = timeConverter(
        getDateByCurrentAdd(clientTime, endToCurrentDaysReject)
      );
    }

    const serverFromTime = adaptClientTimeToServer(
      fromTime,
      clientServerHoursDiff
    );
    const serverToTime = adaptClientTimeToServer(toTime, clientServerHoursDiff);

    return { fromTime, serverFromTime, toTime, serverToTime };
  };

  saveUserAction = async (req, event_name) => {
    const { userId } = req.userData;
    const active = await this.systemOptionModel.getUserLogActive();
    if (!active) return;

    const user = await this.userModel.getById(userId);

    await this.userEventLogModel.create({
      user_id: userId,
      user_email: user["email"],
      user_role: user["role"],
      event_name,
    });
  };

  baseGetById = (req, res, model, method = ["getById"]) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;

      if (isNaN(id)) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const entity = await model[method](id);

      if (!entity) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, entity);
    });

  getFileByName = (req, name) =>
    req.files.find((field) => field.fieldname == name);
}

module.exports = Controller;

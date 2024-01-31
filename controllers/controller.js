require("dotenv").config();

const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const fs = require("fs");
const path = require("path");

const db = require("../database");
const { UserModel } = require("../models");
const STATIC = require("../static");
const CLIENT_URL = process.env.CLIENT_URL;

class Controller {
  __mailTransporter = null;

  constructor() {
    this.userModel = new UserModel(db);

    this.__mailTransporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    this.__mailTransporter.use(
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

  __sendResponse(response, baseInfo, body, message, isError) {
    response.status(baseInfo.STATUS).json({
      message: message ?? baseInfo.DEFAULT_MESSAGE,
      body,
      isError,
    });
  }

  sendSuccessResponse(response, baseInfo = null, body = {}, message = null) {
    if (!baseInfo) baseInfo = STATIC.SUCCESS.OK;

    this.__sendResponse(response, baseInfo, body, message, false);
  }

  sendErrorResponse(response, baseInfo, body = {}, message = null) {
    this.__sendResponse(response, baseInfo, body, message, true);
  }

  async baseWrapper(req, res, func) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error = errors.array()[0].msg;
        return this.sendErrorResponse(
          res,
          { error },
          STATIC.ERRORS.BAD_REQUEST.STATUS
        );
      }

      await func();
    } catch (e) {
      const errorType = e.type ?? STATIC.ERRORS.UNPREDICTABLE.KEY;

      const currentErrorKey = Object.keys(STATIC.ERRORS).find(
        (error) => STATIC.ERRORS[error].KEY === errorType
      );
      const currentError = STATIC.ERRORS[currentErrorKey];
      this.sendErrorResponse(res, currentError, {
        error: e.message,
      });
    }
  }

  async sendMail(to, subject, template, context) {
    const mailOptions = {
      from: `"${process.env.MAIL_FROM}" ${process.env.MAIL_EMAIL}`,
      to,
      subject,
      template,
      context,
    };

    try {
      return await this.__mailTransporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  async sendEmailVerificationMail(email, name, token) {
    const title = "Account Verification";
    this.sendMail(email, title, "emailVerification", {
      name,
      link:
        CLIENT_URL + "/" + STATIC.CLIENT_LINKS.EMAIL_VERIFICATION + "/" + token,
      title,
    });
  }

  async sendPasswordResetMail(email, name, token) {
    const title = "Reset Password";
    this.sendMail(email, title, "passwordReset", {
      name,
      link: CLIENT_URL + "/" + STATIC.CLIENT_LINKS.PASSWORD_RESET + "/" + token,
      title,
    });
  }
}

module.exports = Controller;

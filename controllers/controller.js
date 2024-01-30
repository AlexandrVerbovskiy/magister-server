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

  __actualResponseStatus = null;
  __actualResponseIsError = false;
  __actualResponseBody = null;
  __actualResponseMessage = null;

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

  __setResponse(baseInfo, body, message, isError) {
    this.__actualResponseBody = body;
    this.__actualResponseStatus = baseInfo.STATUS;
    this.__actualResponseMessage = message ?? baseInfo.DEFAULT_MESSAGE;
    this.__actualResponseIsError = isError;
  }

  setSuccessResponse(baseInfo = null, body = {}, message = null) {
    if (!baseInfo) baseInfo = STATIC.SUCCESS.OK;

    this.__setResponse(baseInfo, body, message, false);
  }

  setErrorResponse(baseInfo, body = {}, message = null) {
    this.__setResponse(baseInfo, body, message, true);
  }

  async baseWrapper(req, res, func) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error = errors.array()[0].msg;
        return this.setErrorResponse(
          { error },
          STATIC.ERRORS.BAD_REQUEST.STATUS
        );
      }

      await func();
    } catch (e) {
      console.log(e);
      const errorType = e.type ?? STATIC.ERRORS.UNPREDICTABLE.KEY;

      const currentErrorKey = Object.keys(STATIC.ERRORS).find(
        (error) => STATIC.ERRORS[error].KEY === errorType
      );
      const currentError = STATIC.ERRORS[currentErrorKey];
      const error = e.message;
      this.setErrorResponse(currentError, {
        error,
      });
    } finally {
      res.status(this.__actualResponseStatus).json({
        message: this.__actualResponseMessage,
        body: this.__actualResponseBody,
        isError: this.__actualResponseIsError,
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

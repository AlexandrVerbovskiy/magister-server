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
  shortTimeConverter,
  tenantPaymentCalculate,
  getDaysDifference,
  getStartAndEndOfLastWeek,
  getStartAndEndOfLastMonth,
  getStartAndEndOfLastYear,
  getStartAndEndOfYesterday,
} = require("../utils");
const htmlToPdf = require("html-pdf");
const handlebars = require("handlebars");
const qrcode = require("qrcode");

const {
  userModel,
  logModel,
  userVerifyRequestModel,
  systemOptionModel,
  userEventLogModel,
  listingCategoryModel,
  searchedWordModel,
  listingModel,
  listingApprovalRequestModel,
  listingCategoryCreateNotificationModel,
  orderModel,
  orderUpdateRequestModel,
  senderPaymentModel,
  recipientPaymentModel,
  listingDefectModel,
  listingDefectQuestionModel,
  listingCommentModel,
  ownerCommentModel,
  tenantCommentModel,
  userListingFavoriteModel,
  disputeModel,
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

    this.listingCategoryModel = listingCategoryModel;
    this.searchedWordModel = searchedWordModel;

    this.listingModel = listingModel;
    this.listingDefectModel = listingDefectModel;

    this.orderModel = orderModel;
    this.orderUpdateRequestModel = orderUpdateRequestModel;
    this.disputeModel = disputeModel;

    this.listingApprovalRequestModel = listingApprovalRequestModel;
    this.listingCategoryCreateNotificationModel =
      listingCategoryCreateNotificationModel;
    this.listingDefectQuestionModel = listingDefectQuestionModel;

    this.listingCommentModel = listingCommentModel;
    this.ownerCommentModel = ownerCommentModel;
    this.tenantCommentModel = tenantCommentModel;

    this.senderPaymentModel = senderPaymentModel;
    this.recipientPaymentModel = recipientPaymentModel;
    this.userListingFavoriteModel = userListingFavoriteModel;

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
      console.log("Server error: ", e);
      const errorType = e.type ?? STATIC.ERRORS.UNPREDICTABLE.KEY;

      const currentErrorKey =
        Object.keys(STATIC.ERRORS).find(
          (error) => STATIC.ERRORS[error].KEY === errorType
        ) ?? "UNPREDICTABLE";

      if (currentErrorKey === "UNPREDICTABLE") {
        try {
          this.logModel.saveByBodyError(e.stack, e.message);
        } catch (localError) {}
      }

      this.sendErrorResponse(res, STATIC.ERRORS[currentErrorKey], e.message);
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
    const link =
      CLIENT_URL + "/" + STATIC.CLIENT_LINKS.EMAIL_VERIFICATION + "/" + token;

    await this.sendMail(email, title, "emailVerification", {
      name,
      link,
      title,
    });
  };

  sendProfileVerificationMail = async (email) => {
    const title = "Owner Verification";
    const link = CLIENT_URL + "/";

    await this.sendMail(email, title, "userDocumentsVerification", {
      link,
    });
  };

  sendBookingApprovalRequestMail = async (email) => {
    const title = "Booking Approval Request";
    const link = CLIENT_URL + "/";

    await this.sendMail(email, title, "bookingApprovalRequest", {
      link,
    });
  };

  //???
  sendAssetPickupMail = async (email, orderId) => {
    const title = "Asset Pickup Confirmation";
    //const link = CLIENT_URL + "/dashboard/orders/" + orderId;
    const link = CLIENT_URL + "/";

    await this.sendMail(email, title, "assetPickup", {
      link,
    });
  };

  //???
  sendAssetDropOffMail = async (email, invoiceId) => {
    const title = "Asset Drop Off Confirmation";
    //const link = CLIENT_URL + "/dashboard/invoices/" + invoiceId;
    const link = CLIENT_URL + "/";

    await this.sendMail(email, title, "assetDropOff", {
      link,
    });
  };

  //???
  sendLateReturnNotificationMail = async (email, orderId) => {
    const title = "Late Return Notification";
    //const link = CLIENT_URL + "/dashboard/orders/" + orderId;
    const link = CLIENT_URL + "/";

    await this.sendMail(email, title, "assetDropOff", {
      link,
    });
  };

  //???
  sendEarlyReturnOfAssetMail = async (email, orderId) => {
    const title = "Early Return of Asset";
    //const link = CLIENT_URL + "/dashboard/orders/" + orderId;
    const link = CLIENT_URL + "/";

    await this.sendMail(email, title, "assetDropOff", {
      link,
    });
  };

  sendBookingExtensionMail = async (email, orderId) => {
    const title = "Booking Extension Request";
    //const link = CLIENT_URL + "/dashboard/orders/" + orderId;
    const link = CLIENT_URL + "/";

    await this.sendMail(email, title, "bookingExtension", {
      link,
    });
  };

  sendBookingCancellationRenterMail = async (email, orderId) => {
    const title = "Booking Cancellation Request";
    //const link = CLIENT_URL + "/dashboard/orders/" + orderId;
    const link = CLIENT_URL + "/";

    await this.sendMail(email, title, "bookingCancellationRenter", {
      link,
    });
  };

  sendBookingCancellationOwnerMail = async (email, orderId) => {
    const title = "Booking Cancellation Request";
    //const link = CLIENT_URL + "/dashboard/orders/" + orderId;
    const link = CLIENT_URL + "/";

    await this.sendMail(email, title, "bookingCancellationOwner", {
      link,
    });
  };

  sendPaymentNotificationMail = async (email, orderId) => {
    const title = "Payment to Partners";
    //const link = CLIENT_URL + "/dashboard/orders/" + orderId;
    const link = CLIENT_URL + "/";

    await this.sendMail(email, title, "paymentNotification", {
      link,
    });
  };

  sendRefundProcessMail = async (email, orderId) => {
    const title = "Refund Process";
    //const link = CLIENT_URL + "/dashboard/orders/" + orderId;
    const link = CLIENT_URL + "/";

    await this.sendMail(email, title, "refundProcess", {
      link,
    });
  };

  sendListingVerifiedMail = async (email, name, id) => {
    const title = "Asset Registration Approved";
    const link = CLIENT_URL + "/listing/" + id;

    await this.sendMail(email, title, "listingVerified", {
      link,
      name,
    });
  };

  sendCreatedListingCategory = async (email, categoryName) => {
    const title = "A new listing category has been created";
    const link =
      CLIENT_URL +
      "/" +
      STATIC.CLIENT_LINKS.LISTING_PAGE +
      "?categories=" +
      categoryName;

    await this.sendMail(email, title, "createdListingCategory", {
      link,
      title,
    });
  };

  sendPasswordResetMail = async (email, name, token) => {
    const title = "Reset Password";
    const link =
      CLIENT_URL + "/" + STATIC.CLIENT_LINKS.PASSWORD_RESET + "/" + token;

    await this.sendMail(email, title, "passwordReset", {
      name,
      link,
      title,
    });
  };

  sendAccountCreationMail = async (email, name, token) => {
    const title = "Account Creation";
    const link =
      CLIENT_URL + "/" + STATIC.CLIENT_LINKS.PASSWORD_RESET + "/" + token;

    await this.sendMail(email, title, "accountCreation", {
      name,
      link,
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
      itemsPerPage = this.defaultItemsPerPage ?? 20,
      order = null,
      orderType = null,
    } = req.body;

    let { page = 1 } = req.body;

    let countItems = await countByFilter(req.body);
    countItems = Number(countItems);
    const totalPages =
      countItems > 0 ? Math.ceil(countItems / itemsPerPage) : 1;

    if (page > totalPages) page = totalPages;

    const start = (page - 1) * itemsPerPage;

    return {
      options: {
        filter,
        order,
        orderType: orderType ?? "desc",
        start,
        count: itemsPerPage,
        page,
        totalPages,
      },
      countItems,
    };
  };

  listTimeOption = async ({
    req,
    startFromCurrentDaysAdd = 1,
    endToCurrentDaysReject = 1,
    type = STATIC.TIME_OPTIONS_TYPE_DEFAULT.BASE,
  }) => {
    const { clientTime } = req.body;
    let { fromTime = null, toTime = null } = req.body;
    const clientServerHoursDiff = clientServerHoursDifference(clientTime);

    let serverFromTime = null;
    let serverToTime = null;

    if (type == STATIC.TIME_OPTIONS_TYPE_DEFAULT.TODAY) {
      startFromCurrentDaysAdd = 0;

      if (!fromTime) {
        fromTime = timeConverter(
          getDateByCurrentReject(clientTime, startFromCurrentDaysAdd)
        );
      }
    }

    if (type == STATIC.TIME_OPTIONS_TYPE_DEFAULT.BASE) {
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
    }

    if (fromTime) {
      serverFromTime = adaptClientTimeToServer(
        fromTime,
        clientServerHoursDiff,
        { h: 0, m: 0, s: 0, ms: 0 }
      );
    }

    if (toTime) {
      serverToTime = adaptClientTimeToServer(toTime, clientServerHoursDiff, {
        h: 23,
        m: 59,
        s: 59,
        ms: 999,
      });
    }

    return { fromTime, serverFromTime, toTime, serverToTime };
  };

  listTimeNameOption = async (req) => {
    const { clientTime, timeFilterType = "last-month" } = req.body;
    const clientServerHoursDiff = clientServerHoursDifference(clientTime);

    let fromTime = null;
    let toTime = null;

    if (timeFilterType === "last-week") {
      const { startDate, endDate } = getStartAndEndOfLastWeek(clientTime);
      fromTime = startDate;
      toTime = endDate;
    } else if (timeFilterType === "last-month") {
      const { startDate, endDate } = getStartAndEndOfLastMonth(clientTime);
      fromTime = startDate;
      toTime = endDate;
    } else if (timeFilterType === "last-year") {
      const { startDate, endDate } = getStartAndEndOfLastYear(clientTime);
      fromTime = startDate;
      toTime = endDate;
    } else {
      const { startDate, endDate } = getStartAndEndOfYesterday(clientTime);
      fromTime = startDate;
      toTime = endDate;
    }

    const serverFromTime = adaptClientTimeToServer(
      fromTime,
      clientServerHoursDiff,
      {
        h: 0,
        m: 0,
        s: 0,
        ms: 0,
      }
    );

    const serverToTime = adaptClientTimeToServer(
      toTime,
      clientServerHoursDiff,
      {
        h: 23,
        m: 59,
        s: 59,
        ms: 999,
      }
    );

    return {
      timeFilterType,
      clientFromTime: fromTime,
      serverFromTime,
      clientToTime: toTime,
      serverToTime,
      clientServerHoursDiff,
    };
  };

  getListTimeAutoOption = async (
    req,
    timeFilterType,
    defaultValue = STATIC.TIME_OPTIONS_TYPE_DEFAULT.NULL
  ) => {
    let timeInfos = {};

    if (timeFilterType == STATIC.TIME_FILTER_TYPES.TYPE) {
      timeInfos = await this.listTimeNameOption(req);
    } else {
      timeInfos = await this.listTimeOption({
        req,
        type: defaultValue,
      });
    }

    return timeInfos;
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
      const entity = await model[method](id);

      if (!entity) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, entity);
    });

  getFileByName = (req, name) =>
    req.files.find((field) => field.fieldname == name);

  generateHtmlByHandlebars(templatePath, params = {}) {
    const source = fs.readFileSync(
      path.resolve(`./${templatePath}.handlebars`),
      "utf8"
    );
    const template = handlebars.compile(source);
    return template(params);
  }

  addTimeInfoToOptions = (options, timeInfos) => {
    options["timeInfos"] = timeInfos;
    Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));
    return options;
  };

  async generatePdf(
    templatePath,
    params = {},
    width = "210mm",
    height = "297mm"
  ) {
    const htmlContent = this.generateHtmlByHandlebars(templatePath, params);

    const pdf = await new Promise((resolve, reject) => {
      htmlToPdf
        .create(htmlContent, {
          format: "A4",
          orientation: "portrait",
          width,
          height,
          childProcessOptions: {
            env: {
              OPENSSL_CONF: "/dev/null",
            },
          },
        })
        .toBuffer((err, buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(buffer);
          }
        });
    });

    return pdf;
  }

  async generateQrCodeInfo(clientLink) {
    const token = generateRandomString();
    const image = await qrcode.toDataURL(
      process.env.CLIENT_URL + clientLink + "/" + token
    );

    return { token, image };
  }

  baseInvoicePdfGeneration = async (payment) => {
    const offerStartDate = payment.orderOfferStartDate;
    const offerEndDate = payment.orderOfferEndDate;
    const offerPricePerDay = payment.orderOfferPricePerDay;

    const offerTotalPrice = tenantPaymentCalculate(
      offerStartDate,
      offerEndDate,
      payment.tenantFee,
      offerPricePerDay
    );

    const offerSubTotalPrice =
      getDaysDifference(offerStartDate, offerEndDate) * offerPricePerDay;

    const factTotalFee = (offerSubTotalPrice * payment.tenantFee) / 100;

    const durationString =
      offerStartDate == offerEndDate
        ? shortTimeConverter(offerStartDate)
        : `${shortTimeConverter(offerStartDate)} - ${shortTimeConverter(
            offerEndDate
          )}`;

    const createdInfo = payment.createdAt
      ? shortTimeConverter(payment.createdAt)
      : "-";

    const dueInfo = payment.dueAt ? shortTimeConverter(payment.dueAt) : "-";

    const params = {
      billTo: payment.listingAddress ?? payment.listingCity,
      shipTo: payment.listingAddress ?? payment.listingCity,
      invoiceId: payment.orderId,
      invoiceDate: createdInfo,
      purchaseOrder: payment.orderId,
      dueDate: dueInfo,
      offer: {
        factTotalPrice: offerTotalPrice.toFixed(2),
        fee: payment.tenantFee,
        listingName: payment.listingName,
        pricePerDay: offerPricePerDay.toFixed(2),
        subTotalPrice: offerSubTotalPrice.toFixed(2),
        factTotalFee: factTotalFee.toFixed(2),
        durationString,
      },
      payed: payment.adminApproved
        ? offerTotalPrice.toFixed(2)
        : (0).toFixed(2),
    };

    return await this.generatePdf("/pdfs/invoice", params);
  };
}

module.exports = Controller;

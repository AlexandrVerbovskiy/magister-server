require("dotenv").config();

const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const AWS = require("aws-sdk");

const twilioClient = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

AWS.config.update({
  region: process.env.BUCKET_REGION,
  accessKeyId: process.env.BUCKET_ACCESS_KEY,
  secretAccessKey: process.env.BUCKET_ACCESS_SECRET_KEY,
});

const {
  timeConverter,
  getDateByCurrentAdd,
  getDateByCurrentReject,
  adaptClientTimeToServer,
  clientServerHoursDifference,
  shortTimeConverter,
  tenantPaymentCalculate,
  getStartAndEndOfLastWeek,
  getStartAndEndOfLastMonth,
  getStartAndEndOfLastYear,
  getStartAndEndOfYesterday,
  removeDuplicates,
  getFactOrderDays,
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
  listingCommentModel,
  ownerCommentModel,
  tenantCommentModel,
  userListingFavoriteModel,
  disputeModel,
  chatMessageContentModel,
  chatMessageModel,
  chatModel,
  chatRelationModel,
  socketModel,
  activeActionModel,
} = require("../models");

const STATIC = require("../static");
const { generateRandomString } = require("../utils");
const CLIENT_URL = process.env.CLIENT_URL;

class Controller {
  mailTransporter = null;
  io = null;

  constructor(io = null) {
    this.io = io;

    this.userModel = userModel;

    this.logModel = logModel;
    this.userVerifyRequestModel = userVerifyRequestModel;
    this.systemOptionModel = systemOptionModel;
    this.userEventLogModel = userEventLogModel;
    this.activeActionModel = activeActionModel;

    this.listingCategoryModel = listingCategoryModel;
    this.searchedWordModel = searchedWordModel;

    this.listingModel = listingModel;

    this.orderModel = orderModel;
    this.orderUpdateRequestModel = orderUpdateRequestModel;
    this.disputeModel = disputeModel;

    this.listingApprovalRequestModel = listingApprovalRequestModel;
    this.listingCategoryCreateNotificationModel =
      listingCategoryCreateNotificationModel;

    this.listingCommentModel = listingCommentModel;
    this.ownerCommentModel = ownerCommentModel;
    this.tenantCommentModel = tenantCommentModel;

    this.senderPaymentModel = senderPaymentModel;
    this.recipientPaymentModel = recipientPaymentModel;
    this.userListingFavoriteModel = userListingFavoriteModel;

    this.chatMessageContentModel = chatMessageContentModel;
    this.chatMessageModel = chatMessageModel;
    this.chatModel = chatModel;
    this.chatRelationModel = chatRelationModel;

    this.socketModel = socketModel;

    this.mailTransporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
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

    this.awsS3 = new AWS.S3();
    this.awsBucketName = process.env.BUCKET_NAME;
  }

  sendSocketIoMessage = (socket, messageKey, message) => {
    this.io.to(socket).emit(messageKey, message);
  };

  sendSocketMessageToUsers = async (userIds, message, data) => {
    const sockets = await this.socketModel.findUserSockets(userIds);

    sockets.forEach((socket) =>
      this.sendSocketIoMessage(socket, message, data)
    );
  };

  sendSocketMessageToUser = async (userId, message, data) => {
    await this.sendSocketMessageToUsers([userId], message, data);
  };

  sendError = async (userId, error) => {
    await this.sendSocketMessageToUser(userId, "error", error);
  };

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
    if (!baseInfo) {
      baseInfo = STATIC.SUCCESS.OK;
    }

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

    return await this.sendMail(email, title, "userDocumentsVerification", {
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

  sendAssetPickupMail = async (email, orderId) => {
    const title = "Asset Pickup Confirmation";
    const link = CLIENT_URL + "/dashboard/orders/" + orderId;

    await this.sendMail(email, title, "assetPickup", {
      link,
    });
  };

  sendAssetPickupOffMail = async (email, orderId) => {
    const title = "Asset Drop Off Confirmation";
    const link = CLIENT_URL + "/dashboard/orders/" + orderId;

    await this.sendMail(email, title, "assetDropOff", {
      link,
    });
  };

  sendLateReturnNotificationMail = async (email, orderId) => {
    const title = "Late Return Notification";
    const link = CLIENT_URL + "/dashboard/orders/" + orderId;

    await this.sendMail(email, title, "lateReturnNotification", {
      link,
    });
  };

  sendEarlyReturnOfAssetMail = async (email, orderId) => {
    const title = "Early Return of Asset";
    const link = CLIENT_URL + "/dashboard/orders/" + orderId;

    await this.sendMail(email, title, "earlyReturnOfAsset", {
      link,
    });
  };

  sendBookingExtensionMail = async (email, orderId) => {
    const title = "Booking Extension Request";
    const link = CLIENT_URL + "/dashboard/orders/" + orderId;

    await this.sendMail(email, title, "bookingExtension", {
      link,
    });
  };

  sendAssetListingConfirmation = async (email, listingId) => {
    const title = "Asset Listing Confirmation";
    const link = CLIENT_URL + "/dashboard/listings/" + listingId;

    await this.sendMail(email, title, "assetListedSuccessfully", {
      link,
    });
  };

  sendBookingCancellationRenterMail = async (email, orderId) => {
    const title = "Booking Cancellation Request";
    const link = CLIENT_URL + "/dashboard/orders/" + orderId;

    await this.sendMail(email, title, "bookingCancellationRenter", {
      link,
    });
  };

  sendBookingCancellationOwnerMail = async (email, orderId) => {
    const title = "Booking Cancellation Request";
    const link = CLIENT_URL + "/dashboard/orders/" + orderId;

    await this.sendMail(email, title, "bookingCancellationOwner", {
      link,
    });
  };

  sendPaymentNotificationMail = async (email, orderId) => {
    const title = "Payment to Partners";
    const link = CLIENT_URL + "/dashboard/orders/" + orderId;

    await this.sendMail(email, title, "paymentNotification", {
      link,
    });
  };

  sendRefundProcessMail = async (email, orderId) => {
    const title = "Refund Process";
    const link = CLIENT_URL + "/dashboard/orders/" + orderId;

    await this.sendMail(email, title, "refundProcess", {
      link,
    });
  };

  sendListingVerifiedMail = async (email, name, id) => {
    const title = "Asset Registration Approved";
    const link = CLIENT_URL + "/listings/" + id;

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

  moveUploadsFileToFolder = async (file, folder) => {
    const originalFilePath = file.path;
    const name = generateRandomString();
    const type = mime.extension(file.mimetype) || "bin";

    const fileContent = fs.readFileSync(originalFilePath);
    const filePath = `${folder}/${name}.${type}`;

    try {
      await this.awsS3
        .putObject({
          Bucket: this.awsBucketName,
          Key: `public/${filePath}`,
          Body: fileContent,
          ContentType: file.mimetype,
        })
        .promise();

      console.log("File uploaded successfully");
      return filePath;
    } catch (err) {
      console.log("Error uploading file:", err);
      throw err;
    }
  };

  removeFile = async (filePath) => {
    try {
      await this.awsS3
        .deleteObject({
          Bucket: this.awsBucketName,
          Key: `public/${filePath}`,
        })
        .promise();

      console.log("File deleted successfully");
    } catch (err) {
      console.log("Error deleting file:", err);
    }
  };

  sendToPhoneMessage = async (phone, text) => {
    const message = await twilioClient.messages.create({
      body: text,
      to: `+${phone}`,
      from: process.env.TWILIO_PHONE,
    });

    return message.sid;
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
      getFactOrderDays(offerStartDate, offerEndDate) * offerPricePerDay;

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

    const dueInfo = payment.createdAt
      ? shortTimeConverter(payment.createdAt)
      : "-";

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

  sendSocketMessageToUserOpponent = async (
    chatId,
    userId,
    messageKey,
    message
  ) => {
    const sockets = await this.chatModel.getChatOpponentSockets(chatId, userId);
    sockets.forEach((socket) =>
      this.sendSocketIoMessage(socket, messageKey, message)
    );
  };

  sendSocketMessageToAdmins = async (messageKey, message) => {
    const sockets = await this.socketModel.getAdminsSockets();
    sockets.forEach((socket) =>
      this.sendSocketIoMessage(socket, messageKey, message)
    );
  };

  sendSocketMessageToChatUsers = async (chatId, messageKey, message) => {
    const sockets = await this.chatModel.getChatUsersSockets(chatId);
    sockets.forEach((socket) =>
      this.sendSocketIoMessage(socket, messageKey, message)
    );
  };

  createAndSendMessageForUpdatedOrder = async ({
    chatId,
    senderId,
    orderPart,
    createMessageFunc,
    messageData = {},
  }) => {
    if (!chatId) {
      return { chatMessage: null };
    }

    const message = await createMessageFunc({
      chatId,
      senderId,
      data: messageData,
    });

    const sender = await this.userModel.getById(senderId);

    await this.sendSocketMessageToUserOpponent(
      chatId,
      senderId,
      "update-order-message",
      {
        message,
        opponent: sender,
        orderPart,
      }
    );

    return { chatMessage: message };
  };

  onCreateCategory = async (categoryName, categoryId) => {
    const notificationInfos =
      await this.listingCategoryCreateNotificationModel.getForCategoryName(
        categoryName
      );

    await this.searchedWordModel.setCategoryByName(categoryName, categoryId);

    const successSentIds = notificationInfos.map((info) => info.id);
    const toSentMessageEmails = removeDuplicates(
      notificationInfos.map((info) => info.userEmail)
    );

    toSentMessageEmails.forEach((email) =>
      this.sendCreatedListingCategory(email, categoryName)
    );

    await this.listingCategoryCreateNotificationModel.markAsSent(
      successSentIds
    );
  };

  baseListingDatesValidation = (startDate, endDate, minRentalDays) => {
    if (
      getFactOrderDays(startDate, endDate) > STATIC.LIMITS.MAX_RENTAL_DURATION
    ) {
      return `You can't rent a listing more than ${STATIC.LIMITS.MAX_RENTAL_DURATION} days`;
    }

    if (minRentalDays && getFactOrderDays(startDate, endDate) < minRentalDays) {
      return `You can rent ads only for a period of more than ${minRentalDays} days`;
    }

    return null;
  };
}

module.exports = Controller;

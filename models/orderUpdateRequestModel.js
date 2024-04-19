require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const ORDER_UPDATE_REQUESTS_TABLE = STATIC.TABLES.ORDER_UPDATE_REQUESTS;

class OrderUpdateRequestModel extends Model {
  visibleFields = [
    `${ORDER_UPDATE_REQUESTS_TABLE}.id`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.sender_id as senderId`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.order_id as orderId`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date as newStartDate`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date as newEndDate`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_price_per_day as newPricePerDay`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.active`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.created_at as createdAt`,
  ];

  create = async ({
    orderId,
    newStartDate,
    newEndDate,
    newPricePerDay,
    senderId,
    fee,
  }) => {
    const newDuration = getDaysDifference(newStartDate, newEndDate);
    const factTotalPrice = (newDuration * newPricePerDay * (100 + fee)) / 100;

    const res = await db(ORDER_UPDATE_REQUESTS_TABLE).insert({
      order_id: orderId,
      new_start_date: newStartDate,
      new_end_date: newEndDate,
      new_price_per_day: newPricePerDay,
      new_duration: newDuration,
      sender_id: senderId,
      fee,
      fact_total_price: factTotalPrice,
    });

    return res[0]["id"];
  };

  closeLast = async (orderId) => {
    await db(ORDER_UPDATE_REQUESTS_TABLE)
      .where("order_id", orderId)
      .where("active", true)
      .update({ active: false });
  };

  getAllForOrder = async (orderId) => {
    const res = await db(ORDER_UPDATE_REQUESTS_TABLE)
      .select(this.visibleFields)
      .where("order_id", orderId);
    return res;
  };

  getFullById = async (requestId) => {
    const request = await db(ORDER_UPDATE_REQUESTS_TABLE)
      .select(this.visibleFields)
      .where("id", requestId)
      .first();
    return request;
  };

  getFullForLastActive = async (orderId) => {
    const request = await db(ORDER_UPDATE_REQUESTS_TABLE)
      .select(this.visibleFields)
      .where("order_id", orderId)
      .where("active", true)
      .first();
    return request;
  };

  getPreviousRequestInfo = async (orderId) => {
    const request = await db(ORDER_UPDATE_REQUESTS_TABLE)
      .select([
        `${ORDER_UPDATE_REQUESTS_TABLE}.sender_id as senderId`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date as startDate`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date as endDate`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_price_per_day as pricePerDay`,
      ])
      .where("order_id", orderId)
      .where("active", false)
      .orderBy("id", desc)
      .first();
    return request;
  };

  getActualRequestInfo = async (orderId) => {
    const request = await db(ORDER_UPDATE_REQUESTS_TABLE)
      .select([
        `${ORDER_UPDATE_REQUESTS_TABLE}.sender_id as senderId`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date as newStartDate`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date as newEndDate`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_price_per_day as newPricePerDay`,
      ])
      .where("order_id", orderId)
      .where("active", true)
      .first();
    return request;
  };
}

module.exports = new OrderUpdateRequestModel();

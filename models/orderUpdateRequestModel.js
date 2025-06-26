require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const ORDER_UPDATE_REQUESTS_TABLE = STATIC.TABLES.ORDER_UPDATE_REQUESTS;

class OrderUpdateRequestModel extends Model {
  visibleFields = [
    `${ORDER_UPDATE_REQUESTS_TABLE}.id`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.fee as newFee`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.sender_id as senderId`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.order_id as orderId`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.active`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.created_at as createdAt`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_price as newPrice`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_time as newStartTime`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_finish_time as newFinishTime`,
  ];

  create = async ({
    orderId,
    newStartTime,
    newFinishTime,
    newPrice,
    senderId,
    fee,
  }) => {
    const res = await db(ORDER_UPDATE_REQUESTS_TABLE)
      .insert({
        order_id: orderId,
        sender_id: senderId,
        new_start_time: newStartTime,
        new_finish_time: newFinishTime,
        new_price: newPrice,
        fee,
      })
      .returning("id");

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
        `${ORDER_UPDATE_REQUESTS_TABLE}.id as id`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_price as price`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_time as startTime`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_finish_time as finishTime`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.sender_id as senderId`,
      ])
      .where("order_id", orderId)
      .where("active", false)
      .orderBy("id", "desc")
      .first();
    return request;
  };

  getActualRequestInfo = async (orderId) => {
    const request = await db(ORDER_UPDATE_REQUESTS_TABLE)
      .select([
        `${ORDER_UPDATE_REQUESTS_TABLE}.id as id`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_price as newPrice`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_time as newStartTime`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_finish_time as newFinishTime`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.sender_id as senderId`,
      ])
      .where("order_id", orderId)
      .where("active", true)
      .first();
    return request;
  };
}

module.exports = new OrderUpdateRequestModel();

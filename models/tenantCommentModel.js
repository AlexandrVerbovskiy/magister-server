require("dotenv").config();
const STATIC = require("../static");
const BaseCommentModel = require("./BaseCommentModel");
const db = require("../database");

const RENTER_COMMENTS_TABLE = STATIC.TABLES.RENTER_COMMENTS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const USERS_TABLE = STATIC.TABLES.USERS;

class RenterCommentModel extends BaseCommentModel {
  type = "renter";
  keyFieldName = `userId`;
  keyField = `${ORDERS_TABLE}.renter_id`;
  reviewerIdField = `${LISTINGS_TABLE}.owner_id`;
  table = RENTER_COMMENTS_TABLE;

  pointFields = [
    "care",
    "timeliness",
    "responsiveness",
    "clarity",
    "usageGuidelines",
    "termsOfService",
    "honesty",
    "reliability",
    "satisfaction",
  ];

  visibleFields = [
    `${RENTER_COMMENTS_TABLE}.id`,
    `${RENTER_COMMENTS_TABLE}.description`,
    `${RENTER_COMMENTS_TABLE}.leave_feedback as leaveFeedback`,

    `${RENTER_COMMENTS_TABLE}.care`,
    `${RENTER_COMMENTS_TABLE}.timeliness`,
    `${RENTER_COMMENTS_TABLE}.responsiveness`,
    `${RENTER_COMMENTS_TABLE}.clarity`,
    `${RENTER_COMMENTS_TABLE}.usage_guidelines as usageGuidelines`,
    `${RENTER_COMMENTS_TABLE}.terms_of_service as termsOfService`,
    `${RENTER_COMMENTS_TABLE}.honesty`,
    `${RENTER_COMMENTS_TABLE}.reliability`,
    `${RENTER_COMMENTS_TABLE}.satisfaction`,

    `${RENTER_COMMENTS_TABLE}.approved`,
    `${RENTER_COMMENTS_TABLE}.waiting_admin as waitingAdmin`,
    `${RENTER_COMMENTS_TABLE}.rejected_description as rejectedDescription`,
    `${RENTER_COMMENTS_TABLE}.created_at as createdAt`,
    `${RENTER_COMMENTS_TABLE}.order_id as orderId`,

    `reviewers.id as reviewerId`,
    `reviewers.name as reviewerName`,
    `reviewers.email as reviewerEmail`,
    `reviewers.phone as reviewerPhone`,
    `reviewers.photo as reviewerPhoto`,
    `${USERS_TABLE}.id as userId`,
    `${USERS_TABLE}.name as userName`,
    `${USERS_TABLE}.email as userEmail`,
    `${USERS_TABLE}.phone as userPhone`,
    `${USERS_TABLE}.photo as userPhoto`,
  ];

  strFilterFields = [`${USERS_TABLE}.name`, `reviewers.name`];

  orderFields = [
    `${RENTER_COMMENTS_TABLE}.id`,
    `${RENTER_COMMENTS_TABLE}.created_at`,
    `${USERS_TABLE}.name`,
    `reviewers.name`,
  ];

  baseJoin = (query) => {
    return query
      .join(
        ORDERS_TABLE,
        `${ORDERS_TABLE}.id`,
        "=",
        `${RENTER_COMMENTS_TABLE}.order_id`
      )
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${ORDERS_TABLE}.listing_id`
      )
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", this.keyField)
      .join(
        `${USERS_TABLE} as reviewers`,
        `reviewers.id`,
        "=",
        this.reviewerIdField
      );
  };

  baseSelect = () => {
    let query = db(RENTER_COMMENTS_TABLE);
    query = this.baseJoin(query);
    return query;
  };

  getBaseUserStatisticQueryJoin = (query) => {
    return query.join(
      USERS_TABLE,
      `${USERS_TABLE}.id`,
      "=",
      `${ORDERS_TABLE}.renter_id`
    );
  };

  create = async ({
    description,
    leaveFeedback,
    orderId,
    care,
    timeliness,
    responsiveness,
    clarity,
    usageGuidelines,
    termsOfService,
    honesty,
    reliability,
    satisfaction,
  }) => {
    const res = await db(RENTER_COMMENTS_TABLE)
      .insert({
        description,
        leave_feedback: leaveFeedback,
        order_id: orderId,
        rejected_description: "",
        care,
        timeliness,
        responsiveness,
        clarity,
        usage_guidelines: usageGuidelines,
        terms_of_service: termsOfService,
        honesty,
        reliability,
        satisfaction,
      })
      .returning("id");

    return res[0]["id"];
  };

  getBaseUserStatisticQuery = () => {
    let query = db(RENTER_COMMENTS_TABLE)
      .select([
        `${USERS_TABLE}.id`,
        db.raw(`COUNT(${RENTER_COMMENTS_TABLE}.id) AS "commentCount"`),

        db.raw(`AVG(${RENTER_COMMENTS_TABLE}.care) AS "averageCare"`),
        db.raw(
          `AVG(${RENTER_COMMENTS_TABLE}.timeliness) AS "averageTimeliness"`
        ),
        db.raw(
          `AVG(${RENTER_COMMENTS_TABLE}.responsiveness) AS "averageResponsiveness"`
        ),
        db.raw(`AVG(${RENTER_COMMENTS_TABLE}.clarity) AS "averageClarity"`),
        db.raw(
          `AVG(${RENTER_COMMENTS_TABLE}.usage_guidelines) AS "averageUsageGuidelines"`
        ),
        db.raw(
          `AVG(${RENTER_COMMENTS_TABLE}.terms_of_service) AS "averageTermsOfService"`
        ),
        db.raw(`AVG(${RENTER_COMMENTS_TABLE}.honesty) AS "averageHonesty"`),
        db.raw(
          `AVG(${RENTER_COMMENTS_TABLE}.reliability) AS "averageReliability"`
        ),
        db.raw(
          `AVG(${RENTER_COMMENTS_TABLE}.satisfaction) AS "averageSatisfaction"`
        ),
        db.raw(`(
            AVG(${RENTER_COMMENTS_TABLE}.care) + AVG(${RENTER_COMMENTS_TABLE}.timeliness)
            + AVG(${RENTER_COMMENTS_TABLE}.responsiveness) + AVG(${RENTER_COMMENTS_TABLE}.clarity)
            + AVG(${RENTER_COMMENTS_TABLE}.usage_guidelines) + AVG(${RENTER_COMMENTS_TABLE}.terms_of_service)
            + AVG(${RENTER_COMMENTS_TABLE}.reliability) + AVG(${RENTER_COMMENTS_TABLE}.honesty)
             + AVG(${RENTER_COMMENTS_TABLE}.satisfaction)
            ) / 9 AS "averageRating"`),
      ])
      .join(
        ORDERS_TABLE,
        `${ORDERS_TABLE}.id`,
        "=",
        `${RENTER_COMMENTS_TABLE}.order_id`
      );

    query = this.getBaseUserStatisticQueryJoin(query);

    return query
      .where(`${USERS_TABLE}.verified`, true)
      .where(`${USERS_TABLE}.active`, true)
      .where(`${RENTER_COMMENTS_TABLE}.approved`, true)
      .where(`${RENTER_COMMENTS_TABLE}.waiting_admin`, false)
      .groupBy([`${USERS_TABLE}.id`]);
  };

  getUserDetailInfo = async (id) => {
    let userDetails = await this.getBaseUserStatisticQuery()
      .where(`${USERS_TABLE}.id`, id)
      .first();

    if (!userDetails) {
      userDetails = {
        id,
        averageCare: 0,
        averageTimeliness: 0,
        averageResponsiveness: 0,
        averageClarity: 0,
        averageUsageGuidelines: 0,
        averageTermsOfService: 0,
        averageHonesty: 0,
        averageReliability: 0,
        averageSatisfaction: 0,
      };
    }

    Object.keys(userDetails).forEach(
      (key) => (userDetails[key] = Number(userDetails[key]))
    );

    return userDetails;
  };
}

module.exports = new RenterCommentModel();

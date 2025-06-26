require("dotenv").config();
const STATIC = require("../static");
const BaseCommentModel = require("./BaseCommentModel");
const db = require("../database");

<<<<<<< HEAD:models/tenantCommentModel.js
<<<<<<< HEAD:models/tenantCommentModel.js
const TENANT_COMMENTS_TABLE = STATIC.TABLES.TENANT_COMMENTS;
=======
const RENTER_COMMENTS_TABLE = STATIC.TABLES.RENTER_COMMENTS;
>>>>>>> fad5f76 (start):models/workerCommentModel.js
=======
const RENTER_COMMENTS_TABLE = STATIC.TABLES.RENTER_COMMENTS;
>>>>>>> 45e89f9 (start):models/workerCommentModel.js
const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const USERS_TABLE = STATIC.TABLES.USERS;

<<<<<<< HEAD:models/tenantCommentModel.js
<<<<<<< HEAD:models/tenantCommentModel.js
class TenantCommentModel extends BaseCommentModel {
  type = "tenant";
  keyFieldName = `userId`;
  keyField = `${ORDERS_TABLE}.tenant_id`;
  reviewerIdField = `${LISTINGS_TABLE}.owner_id`;
  table = TENANT_COMMENTS_TABLE;
=======
=======
>>>>>>> 45e89f9 (start):models/workerCommentModel.js
class RenterCommentModel extends BaseCommentModel {
  type = "renter";
  keyFieldName = `userId`;
  keyField = `${ORDERS_TABLE}.renter_id`;
  reviewerIdField = `${LISTINGS_TABLE}.owner_id`;
  table = RENTER_COMMENTS_TABLE;
<<<<<<< HEAD:models/tenantCommentModel.js
>>>>>>> fad5f76 (start):models/workerCommentModel.js
=======
>>>>>>> 45e89f9 (start):models/workerCommentModel.js

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
<<<<<<< HEAD:models/tenantCommentModel.js
<<<<<<< HEAD:models/tenantCommentModel.js
    `${TENANT_COMMENTS_TABLE}.id`,
    `${TENANT_COMMENTS_TABLE}.description`,
    `${TENANT_COMMENTS_TABLE}.leave_feedback as leaveFeedback`,

    `${TENANT_COMMENTS_TABLE}.care`,
    `${TENANT_COMMENTS_TABLE}.timeliness`,
    `${TENANT_COMMENTS_TABLE}.responsiveness`,
    `${TENANT_COMMENTS_TABLE}.clarity`,
    `${TENANT_COMMENTS_TABLE}.usage_guidelines as usageGuidelines`,
    `${TENANT_COMMENTS_TABLE}.terms_of_service as termsOfService`,
    `${TENANT_COMMENTS_TABLE}.honesty`,
    `${TENANT_COMMENTS_TABLE}.reliability`,
    `${TENANT_COMMENTS_TABLE}.satisfaction`,

    `${TENANT_COMMENTS_TABLE}.approved`,
    `${TENANT_COMMENTS_TABLE}.waiting_admin as waitingAdmin`,
    `${TENANT_COMMENTS_TABLE}.rejected_description as rejectedDescription`,
    `${TENANT_COMMENTS_TABLE}.created_at as createdAt`,
    `${TENANT_COMMENTS_TABLE}.order_id as orderId`,
=======
=======
>>>>>>> 45e89f9 (start):models/workerCommentModel.js
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
<<<<<<< HEAD:models/tenantCommentModel.js
>>>>>>> fad5f76 (start):models/workerCommentModel.js
=======
>>>>>>> 45e89f9 (start):models/workerCommentModel.js

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
<<<<<<< HEAD:models/tenantCommentModel.js
<<<<<<< HEAD:models/tenantCommentModel.js
    `${TENANT_COMMENTS_TABLE}.id`,
    `${TENANT_COMMENTS_TABLE}.created_at`,
=======
    `${RENTER_COMMENTS_TABLE}.id`,
    `${RENTER_COMMENTS_TABLE}.created_at`,
>>>>>>> fad5f76 (start):models/workerCommentModel.js
=======
    `${RENTER_COMMENTS_TABLE}.id`,
    `${RENTER_COMMENTS_TABLE}.created_at`,
>>>>>>> 45e89f9 (start):models/workerCommentModel.js
    `${USERS_TABLE}.name`,
    `reviewers.name`,
  ];

  baseJoin = (query) => {
    return query
      .join(
        ORDERS_TABLE,
        `${ORDERS_TABLE}.id`,
        "=",
<<<<<<< HEAD:models/tenantCommentModel.js
<<<<<<< HEAD:models/tenantCommentModel.js
        `${TENANT_COMMENTS_TABLE}.order_id`
=======
        `${RENTER_COMMENTS_TABLE}.order_id`
>>>>>>> fad5f76 (start):models/workerCommentModel.js
=======
        `${RENTER_COMMENTS_TABLE}.order_id`
>>>>>>> 45e89f9 (start):models/workerCommentModel.js
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
<<<<<<< HEAD:models/tenantCommentModel.js
<<<<<<< HEAD:models/tenantCommentModel.js
    let query = db(TENANT_COMMENTS_TABLE);
=======
    let query = db(RENTER_COMMENTS_TABLE);
>>>>>>> fad5f76 (start):models/workerCommentModel.js
=======
    let query = db(RENTER_COMMENTS_TABLE);
>>>>>>> 45e89f9 (start):models/workerCommentModel.js
    query = this.baseJoin(query);
    return query;
  };

  getBaseUserStatisticQueryJoin = (query) => {
    return query.join(
      USERS_TABLE,
      `${USERS_TABLE}.id`,
      "=",
<<<<<<< HEAD:models/tenantCommentModel.js
<<<<<<< HEAD:models/tenantCommentModel.js
      `${ORDERS_TABLE}.tenant_id`
=======
      `${ORDERS_TABLE}.renter_id`
>>>>>>> fad5f76 (start):models/workerCommentModel.js
=======
      `${ORDERS_TABLE}.renter_id`
>>>>>>> 45e89f9 (start):models/workerCommentModel.js
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
<<<<<<< HEAD:models/tenantCommentModel.js
<<<<<<< HEAD:models/tenantCommentModel.js
    const res = await db(TENANT_COMMENTS_TABLE)
=======
    const res = await db(RENTER_COMMENTS_TABLE)
>>>>>>> fad5f76 (start):models/workerCommentModel.js
=======
    const res = await db(RENTER_COMMENTS_TABLE)
>>>>>>> 45e89f9 (start):models/workerCommentModel.js
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
<<<<<<< HEAD:models/tenantCommentModel.js
<<<<<<< HEAD:models/tenantCommentModel.js
    let query = db(TENANT_COMMENTS_TABLE)
      .select([
        `${USERS_TABLE}.id`,
        db.raw(`COUNT(${TENANT_COMMENTS_TABLE}.id) AS "commentCount"`),

        db.raw(`AVG(${TENANT_COMMENTS_TABLE}.care) AS "averageCare"`),
        db.raw(
          `AVG(${TENANT_COMMENTS_TABLE}.timeliness) AS "averageTimeliness"`
        ),
        db.raw(
          `AVG(${TENANT_COMMENTS_TABLE}.responsiveness) AS "averageResponsiveness"`
        ),
        db.raw(`AVG(${TENANT_COMMENTS_TABLE}.clarity) AS "averageClarity"`),
        db.raw(
          `AVG(${TENANT_COMMENTS_TABLE}.usage_guidelines) AS "averageUsageGuidelines"`
        ),
        db.raw(
          `AVG(${TENANT_COMMENTS_TABLE}.terms_of_service) AS "averageTermsOfService"`
        ),
        db.raw(`AVG(${TENANT_COMMENTS_TABLE}.honesty) AS "averageHonesty"`),
        db.raw(
          `AVG(${TENANT_COMMENTS_TABLE}.reliability) AS "averageReliability"`
        ),
        db.raw(
          `AVG(${TENANT_COMMENTS_TABLE}.satisfaction) AS "averageSatisfaction"`
        ),
        db.raw(`(
            AVG(${TENANT_COMMENTS_TABLE}.care) + AVG(${TENANT_COMMENTS_TABLE}.timeliness)
            + AVG(${TENANT_COMMENTS_TABLE}.responsiveness) + AVG(${TENANT_COMMENTS_TABLE}.clarity)
            + AVG(${TENANT_COMMENTS_TABLE}.usage_guidelines) + AVG(${TENANT_COMMENTS_TABLE}.terms_of_service)
            + AVG(${TENANT_COMMENTS_TABLE}.reliability) + AVG(${TENANT_COMMENTS_TABLE}.honesty)
             + AVG(${TENANT_COMMENTS_TABLE}.satisfaction)
=======
=======
>>>>>>> 45e89f9 (start):models/workerCommentModel.js
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
<<<<<<< HEAD:models/tenantCommentModel.js
>>>>>>> fad5f76 (start):models/workerCommentModel.js
=======
>>>>>>> 45e89f9 (start):models/workerCommentModel.js
            ) / 9 AS "averageRating"`),
      ])
      .join(
        ORDERS_TABLE,
        `${ORDERS_TABLE}.id`,
        "=",
<<<<<<< HEAD:models/tenantCommentModel.js
<<<<<<< HEAD:models/tenantCommentModel.js
        `${TENANT_COMMENTS_TABLE}.order_id`
=======
        `${RENTER_COMMENTS_TABLE}.order_id`
>>>>>>> fad5f76 (start):models/workerCommentModel.js
=======
        `${RENTER_COMMENTS_TABLE}.order_id`
>>>>>>> 45e89f9 (start):models/workerCommentModel.js
      );

    query = this.getBaseUserStatisticQueryJoin(query);

    return query
      .where(`${USERS_TABLE}.verified`, true)
      .where(`${USERS_TABLE}.active`, true)
<<<<<<< HEAD:models/tenantCommentModel.js
<<<<<<< HEAD:models/tenantCommentModel.js
      .where(`${TENANT_COMMENTS_TABLE}.approved`, true)
      .where(`${TENANT_COMMENTS_TABLE}.waiting_admin`, false)
=======
      .where(`${RENTER_COMMENTS_TABLE}.approved`, true)
      .where(`${RENTER_COMMENTS_TABLE}.waiting_admin`, false)
>>>>>>> fad5f76 (start):models/workerCommentModel.js
=======
      .where(`${RENTER_COMMENTS_TABLE}.approved`, true)
      .where(`${RENTER_COMMENTS_TABLE}.waiting_admin`, false)
>>>>>>> 45e89f9 (start):models/workerCommentModel.js
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

<<<<<<< HEAD:models/tenantCommentModel.js
<<<<<<< HEAD:models/tenantCommentModel.js
module.exports = new TenantCommentModel();
=======
module.exports = new RenterCommentModel();
>>>>>>> fad5f76 (start):models/workerCommentModel.js
=======
module.exports = new RenterCommentModel();
>>>>>>> 45e89f9 (start):models/workerCommentModel.js

require("dotenv").config();
const STATIC = require("../static");
const BaseCommentModel = require("./BaseCommentModel");
const db = require("../database");

const OWNER_COMMENTS_TABLE = STATIC.TABLES.OWNER_COMMENTS;
const USERS_TABLE = STATIC.TABLES.USERS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;

class OwnerCommentModel extends BaseCommentModel {
  type = "owner";
  keyFieldName = `userId`;
  keyField = `${LISTINGS_TABLE}.owner_id`;
<<<<<<< HEAD
  reviewerIdField = `${ORDERS_TABLE}.tenant_id`;
=======
  reviewerIdField = `${ORDERS_TABLE}.renter_id`;
>>>>>>> fad5f76 (start)
  table = OWNER_COMMENTS_TABLE;

  pointFields = [
    "itemDescriptionAccuracy",
    "photoAccuracy",
    "pickupCondition",
    "cleanliness",
    "responsiveness",
    "clarity",
    "schedulingFlexibility",
    "issueResolution",
  ];

  visibleFields = [
    `${OWNER_COMMENTS_TABLE}.id`,
    `${OWNER_COMMENTS_TABLE}.description`,
    `${OWNER_COMMENTS_TABLE}.leave_feedback as leaveFeedback`,

    `${OWNER_COMMENTS_TABLE}.item_description_accuracy as itemDescriptionAccuracy`,
    `${OWNER_COMMENTS_TABLE}.photo_accuracy as photoAccuracy`,
    `${OWNER_COMMENTS_TABLE}.pickup_condition as pickupCondition`,
    `${OWNER_COMMENTS_TABLE}.cleanliness`,
    `${OWNER_COMMENTS_TABLE}.responsiveness`,
    `${OWNER_COMMENTS_TABLE}.clarity`,
    `${OWNER_COMMENTS_TABLE}.scheduling_flexibility as schedulingFlexibility`,
    `${OWNER_COMMENTS_TABLE}.issue_resolution as issueResolution`,

    `${OWNER_COMMENTS_TABLE}.approved`,
    `${OWNER_COMMENTS_TABLE}.waiting_admin as waitingAdmin`,
    `${OWNER_COMMENTS_TABLE}.rejected_description as rejectedDescription`,
    `${OWNER_COMMENTS_TABLE}.created_at as createdAt`,
    `${OWNER_COMMENTS_TABLE}.order_id as orderId`,

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
    `${OWNER_COMMENTS_TABLE}.id`,
    `${OWNER_COMMENTS_TABLE}.created_at`,
    `${USERS_TABLE}.name`,
    `reviewers.name`,
  ];

  baseJoin = (query) => {
    return query
      .join(
        ORDERS_TABLE,
        `${ORDERS_TABLE}.id`,
        "=",
        `${OWNER_COMMENTS_TABLE}.order_id`
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
    let query = db(OWNER_COMMENTS_TABLE);
    query = this.baseJoin(query);
    return query;
  };

  getBaseUserStatisticQueryJoin = (query) => {
    return query
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${ORDERS_TABLE}.listing_id`
      )
      .join(
        USERS_TABLE,
        `${USERS_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.owner_id`
      );
  };

  create = async ({
    description,
    leaveFeedback,
    orderId,
    itemDescriptionAccuracy,
    photoAccuracy,
    pickupCondition,
    cleanliness,
    responsiveness,
    clarity,
    schedulingFlexibility,
    issueResolution,
  }) => {
    const res = await db(OWNER_COMMENTS_TABLE)
      .insert({
        description,
        leave_feedback: leaveFeedback,
        order_id: orderId,
        rejected_description: "",
        item_description_accuracy: itemDescriptionAccuracy,
        photo_accuracy: photoAccuracy,
        pickup_condition: pickupCondition,
        cleanliness,
        responsiveness,
        clarity,
        scheduling_flexibility: schedulingFlexibility,
        issue_resolution: issueResolution,
      })
      .returning("id");

    return res[0]["id"];
  };

  getBaseUserStatisticQuery = () => {
    let query = db(OWNER_COMMENTS_TABLE)
      .select([
        `${USERS_TABLE}.id`,
        db.raw(`COUNT(${OWNER_COMMENTS_TABLE}.id) AS "commentCount"`),

        db.raw(
          `AVG(${OWNER_COMMENTS_TABLE}.item_description_accuracy) AS "averageItemDescriptionAccuracy"`
        ),
        db.raw(
          `AVG(${OWNER_COMMENTS_TABLE}.photo_accuracy) AS "averagePhotoAccuracy"`
        ),
        db.raw(
          `AVG(${OWNER_COMMENTS_TABLE}.pickup_condition) AS "averagePickupCondition"`
        ),
        db.raw(
          `AVG(${OWNER_COMMENTS_TABLE}.cleanliness) AS "averageCleanliness"`
        ),
        db.raw(
          `AVG(${OWNER_COMMENTS_TABLE}.responsiveness) AS "averageResponsiveness"`
        ),
        db.raw(`AVG(${OWNER_COMMENTS_TABLE}.clarity) AS "averageClarity"`),
        db.raw(
          `AVG(${OWNER_COMMENTS_TABLE}.scheduling_flexibility) AS "averageSchedulingFlexibility"`
        ),
        db.raw(
          `AVG(${OWNER_COMMENTS_TABLE}.issue_resolution) AS "averageIssueResolution"`
        ),
        db.raw(`(
            AVG(${OWNER_COMMENTS_TABLE}.item_description_accuracy) + AVG(${OWNER_COMMENTS_TABLE}.photo_accuracy)
            + AVG(${OWNER_COMMENTS_TABLE}.pickup_condition) + AVG(${OWNER_COMMENTS_TABLE}.cleanliness)
            + AVG(${OWNER_COMMENTS_TABLE}.responsiveness) + AVG(${OWNER_COMMENTS_TABLE}.clarity)
            + AVG(${OWNER_COMMENTS_TABLE}.scheduling_flexibility) + AVG(${OWNER_COMMENTS_TABLE}.issue_resolution)
           ) / 8 AS "averageRating"`),
      ])
      .join(
        ORDERS_TABLE,
        `${ORDERS_TABLE}.id`,
        "=",
        `${OWNER_COMMENTS_TABLE}.order_id`
      );

    query = this.getBaseUserStatisticQueryJoin(query);

    return query
      .where(`${USERS_TABLE}.verified`, true)
      .where(`${USERS_TABLE}.active`, true)
      .where(`${OWNER_COMMENTS_TABLE}.approved`, true)
      .where(`${OWNER_COMMENTS_TABLE}.waiting_admin`, false)
      .groupBy([`${USERS_TABLE}.id`]);
  };

  getUserDetailInfo = async (id) => {
    let userDetails = await this.getBaseUserStatisticQuery()
      .where(`${USERS_TABLE}.id`, id)
      .first();

    if (!userDetails) {
      userDetails = {
        id,
        averageItemDescriptionAccuracy: 0,
        averagePhotoAccuracy: 0,
        averagePickupCondition: 0,
        averageCleanliness: 0,
        averageResponsiveness: 0,
        averageClarity: 0,
        averageSchedulingFlexibility: 0,
        averageIssueResolution: 0,
      };
    }

    Object.keys(userDetails).forEach(
      (key) => (userDetails[key] = Number(userDetails[key]))
    );

    return userDetails;
  };
}

module.exports = new OwnerCommentModel();

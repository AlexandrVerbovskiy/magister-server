require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const listingCategoryModel = require("./listingCategoryModel");
const { listingListDateConverter } = require("../utils");

const USERS_TABLE = STATIC.TABLES.USERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const LISTING_IMAGES_TABLE = STATIC.TABLES.LISTING_IMAGES;
const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;
const LISTING_APPROVAL_REQUESTS_TABLE = STATIC.TABLES.LISTING_APPROVAL_REQUESTS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const ORDER_UPDATE_REQUESTS_TABLE = STATIC.TABLES.ORDER_UPDATE_REQUESTS;
const LISTING_DEFECT_RELATIONS_TABLE = STATIC.TABLES.LISTING_DEFECT_RELATIONS;
const LISTING_DEFECTS_TABLE = STATIC.TABLES.LISTING_DEFECTS;

class ListingsModel extends Model {
  baseGroupedFields = [
    `${LISTINGS_TABLE}.id`,
    `${LISTINGS_TABLE}.name`,
    `${LISTINGS_TABLE}.approved`,
    `${LISTINGS_TABLE}.active`,
    `${LISTINGS_TABLE}.address`,
    `${LISTINGS_TABLE}.city`,
    `${LISTINGS_TABLE}.category_id`,
    `${LISTINGS_TABLE}.compensation_cost`,
    `${LISTINGS_TABLE}.count_stored_items`,
    `${LISTINGS_TABLE}.description`,
    `${LISTINGS_TABLE}.postcode`,
    `${LISTINGS_TABLE}.owner_id`,
    `${LISTINGS_TABLE}.price_per_day`,
    `${LISTINGS_TABLE}.min_rental_days`,
    `${LISTINGS_TABLE}.rental_lat`,
    `${LISTINGS_TABLE}.rental_lng`,
    `${LISTINGS_TABLE}.rental_radius`,
    `${LISTINGS_TABLE}.rental_terms`,
    `${LISTINGS_TABLE}.key_words`,
  ];

  visibleFields = [
    `${LISTINGS_TABLE}.id`,
    `${LISTINGS_TABLE}.name`,
    `${LISTINGS_TABLE}.approved`,
    `${LISTINGS_TABLE}.active`,
    `${LISTINGS_TABLE}.address`,
    `${LISTINGS_TABLE}.city`,
    `${LISTINGS_TABLE}.category_id as categoryId`,
    `${LISTINGS_TABLE}.compensation_cost as compensationCost`,
    `${LISTINGS_TABLE}.count_stored_items as countStoredItems`,
    `${LISTINGS_TABLE}.description`,
    `${LISTINGS_TABLE}.postcode`,
    `${LISTINGS_TABLE}.owner_id as ownerId`,
    `${LISTINGS_TABLE}.price_per_day as pricePerDay`,
    `${LISTINGS_TABLE}.min_rental_days as minRentalDays`,
    `${LISTINGS_TABLE}.rental_lat as rentalLat`,
    `${LISTINGS_TABLE}.rental_lng as rentalLng`,
    `${LISTINGS_TABLE}.rental_radius as rentalRadius`,
    `${LISTINGS_TABLE}.rental_terms as rentalTerms`,
    `${LISTINGS_TABLE}.key_words as keyWords`,
  ];

  listingImageVisibleFields = ["id", "listing_id as listingId", "type", "link"];

  strFilterFields = [
    `${LISTINGS_TABLE}.name`,
    `${LISTINGS_TABLE}.city`,
    "key_words",
  ];

  strFullFilterFields = [...this.strFilterFields, `${USERS_TABLE}.name`];

  orderFields = [
    "id",
    "name",
    "city",
    "min_rental_days",
    "count_stored_items",
    "price_per_day",
    "users.name",
  ];

  createImage = async ({ type, link, listingId }) => {
    const res = await db(LISTING_IMAGES_TABLE)
      .insert({
        listing_id: listingId,
        link,
        type,
      })
      .returning("id");

    return res[0]["id"];
  };

  updateImage = async ({ type, link, listingId, id }) => {
    await db(LISTING_IMAGES_TABLE).where("id", id).update({
      listing_id: listingId,
      link,
      type,
    });
  };

  create = async ({
    address,
    name,
    categoryId,
    compensationCost,
    countStoredItems,
    description = "",
    postcode,
    pricePerDay,
    rentalLat,
    rentalLng,
    rentalRadius,
    rentalTerms = "",
    ownerId,
    keyWords = "",
    approved = false,
    minRentalDays = null,
    listingImages = [],
    defects = [],
    city,
    active = true,
    dopDefect = "",
  }) => {
    if (!minRentalDays) {
      minRentalDays = null;
    }

    const res = await db(LISTINGS_TABLE)
      .insert({
        name,
        description,
        postcode,
        address,
        approved,
        rental_lat: Number(rentalLat),
        rental_lng: Number(rentalLng),
        rental_terms: rentalTerms,
        rental_radius: rentalRadius,
        category_id: categoryId,
        price_per_day: pricePerDay,
        min_rental_days: minRentalDays,
        compensation_cost: compensationCost,
        count_stored_items: countStoredItems,
        owner_id: ownerId,
        key_words: keyWords,
        city,
        active,
        dop_defect: dopDefect,
      })
      .returning("id");

    const listingId = res[0]["id"];

    listingImages.forEach(
      async (image) =>
        await this.createImage({
          type: image.type,
          link: image.link,
          listingId,
        })
    );

    const currentListingImages = await this.getListingImages(listingId);

    const createdDefects = await this.saveDefects(defects, listingId);

    return {
      listingId,
      listingImages: currentListingImages,
      defects: createdDefects,
    };
  };

  getListingListImages = async (listingIds) => {
    return await db(LISTING_IMAGES_TABLE)
      .whereIn("listing_id", listingIds)
      .select(this.listingImageVisibleFields)
      .orderBy("id");
  };

  getListingImages = (listingId) => this.getListingListImages([listingId]);

  getById = async (id) => {
    const listing = await db(LISTINGS_TABLE)
      .where({ id })
      .select(this.visibleFields)
      .first();

    if (!listing) return null;

    const listingImages = await this.getListingImages(id);
    const defects = await this.getDefects(id);

    return { ...listing, listingImages, defects };
  };

  getFullById = async (id) => {
    const listing = await db(LISTINGS_TABLE)
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .join(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
      )
      .where(`${LISTINGS_TABLE}.id`, id)
      .select([
        ...this.visibleFields,
        `${USERS_TABLE}.id as userId`,
        `${USERS_TABLE}.name as userName`,
        `${USERS_TABLE}.email as userEmail`,
        `${USERS_TABLE}.phone as userPhone`,
        `${USERS_TABLE}.photo as userPhoto`,
        `${USERS_TABLE}.instagram_url as userInstagramUrl`,
        `${USERS_TABLE}.linkedin_url as userLinkedinUrl`,
        `${USERS_TABLE}.facebook_url as userFacebookUrl`,
        `${USERS_TABLE}.twitter_url as userTwitterUrl`,
        `${USERS_TABLE}.place_work as userPlaceWork`,
        `${USERS_TABLE}.verified as userVerified`,
        `${LISTING_CATEGORIES_TABLE}.name as categoryName`,
        `${LISTING_CATEGORIES_TABLE}.level as categoryLevel`,
      ])
      .first();

    if (!listing) return null;

    const listingImages = await this.getListingImages(id);
    const categoryInfo = await listingCategoryModel.getRecursiveCategoryList(
      listing["categoryId"]
    );
    const defects = await this.getDefects(id);

    return { ...listing, listingImages, categoryInfo, defects };
  };

  updateById = async ({
    id,
    name,
    categoryId,
    compensationCost,
    countStoredItems,
    description,
    postcode,
    approved,
    pricePerDay,
    rentalLat,
    rentalLng,
    rentalRadius,
    rentalTerms,
    minRentalDays = null,
    listingImages = [],
    keyWords = "",
    city,
    ownerId,
    address,
    active,
    dopDefect = "",
    defects = [],
  }) => {
    if (!minRentalDays) {
      minRentalDays = null;
    }

    await db(LISTINGS_TABLE)
      .where({ id })
      .update({
        name,
        city,
        description,
        postcode,
        approved,
        rental_lat: Number(rentalLat),
        rental_lng: Number(rentalLng),
        rental_terms: rentalTerms,
        rental_radius: rentalRadius,
        category_id: categoryId,
        price_per_day: pricePerDay,
        min_rental_days: minRentalDays,
        compensation_cost: compensationCost,
        count_stored_items: countStoredItems,
        key_words: keyWords,
        owner_id: ownerId,
        address,
        active,
        dop_defect: dopDefect,
      });

    const currentImages = await this.getListingImages(id);
    const currentImageLinks = currentImages.map((image) => image.link);

    const listingImagesToInsert = listingImages.filter(
      (image) => !currentImageLinks.includes(image.link) && !image.id
    );

    const listingImagesToUpdate = listingImages.filter(
      (image) => !currentImageLinks.includes(image.link) && image.id
    );

    const actualListingImageLinks = listingImages
      .filter((image) => currentImageLinks.includes(image.link))
      .map((image) => image.link);

    const toDeleteImagesQuery = db(LISTING_IMAGES_TABLE)
      .where("listing_id", id)
      .whereNotIn("link", actualListingImageLinks);

    const deletedImagesInfos = await toDeleteImagesQuery.select(
      this.listingImageVisibleFields
    );

    const imagesToUpdateIds = listingImagesToUpdate.map((image) => image.id);
    await toDeleteImagesQuery.whereNotIn("id", imagesToUpdateIds).delete();

    listingImagesToUpdate.forEach(
      async (image) =>
        await this.updateImage({
          type: image.type,
          link: image.link,
          id: image.id,
          listingId: id,
        })
    );

    listingImagesToInsert.forEach(
      async (image) =>
        await this.createImage({
          type: image.type,
          link: image.link,
          listingId: id,
        })
    );

    const createdDefects = await this.saveDefects(defects, id);
    const currentListingImages = await this.getListingImages(id);
    return {
      deletedImagesInfos,
      listingImages: currentListingImages,
      defects: createdDefects,
    };
  };

  hasAccess = async (listingId, userId) => {
    const listing = await db(LISTINGS_TABLE)
      .where({ id: listingId, owner_id: userId })
      .first();
    return listing;
  };

  approve = async (listingId) => {
    await db(LISTINGS_TABLE)
      .where({
        id: listingId,
      })
      .update({ approved: true });
  };

  deleteById = async (listingId) => {
    const toDeleteImagesQuery = db(LISTING_IMAGES_TABLE).where({
      listing_id: listingId,
    });

    const deletedImagesInfos = await toDeleteImagesQuery.select(
      this.listingImageVisibleFields
    );

    await toDeleteImagesQuery.delete();
    await db(LISTINGS_TABLE).where({ id: listingId }).delete();

    return { deletedImagesInfos };
  };

  changeActiveByUser = async (listingId, userId) => {
    const res = await db(LISTINGS_TABLE)
      .where({ id: listingId, owner_id: userId })
      .update({ active: db.raw("NOT active") })
      .returning("active");

    return res[0].active;
  };

  changeActive = async (listingId) => {
    const res = await db(LISTINGS_TABLE)
      .where({ id: listingId })
      .update({ active: db.raw("NOT active") })
      .returning("active");

    return res[0].active;
  };

  baseListJoin = (query) =>
    query
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .join(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
      )
      .leftJoin(
        `${LISTING_CATEGORIES_TABLE} as c2`,
        `${LISTING_CATEGORIES_TABLE}.parent_id`,
        "=",
        `c2.id`
      )
      .leftJoin(
        `${LISTING_CATEGORIES_TABLE} as c3`,
        `c2.parent_id`,
        "=",
        `c3.id`
      );

  listTimeWhere = (serverFromTime, serverToTime, query) => {
    return query.whereNotIn(`${LISTINGS_TABLE}.id`, function () {
      this.select("listing_id")
        .from(ORDERS_TABLE)
        .joinRaw(
          `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
               ${ORDERS_TABLE}.id = ${ORDER_UPDATE_REQUESTS_TABLE}.order_id AND ${ORDER_UPDATE_REQUESTS_TABLE}.active`
        ).whereRaw(`${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_OWNER}' AND
            ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_TENANT}' AND
            (${ORDERS_TABLE}.cancel_status IS NULL OR ${ORDERS_TABLE}.cancel_status != '${STATIC.ORDER_CANCELATION_STATUSES.CANCELED}') AND
            ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.REJECTED}'`);

      const whereQueryParts = [];
      const props = [];

      if (serverFromTime) {
        const formattedFromTime = listingListDateConverter(serverFromTime);

        whereQueryParts.push(`(${ORDER_UPDATE_REQUESTS_TABLE}.id IS NOT NULL AND (${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date <= ? AND ${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date >= ?)) OR
              (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NULL AND (${ORDERS_TABLE}.start_date <= ? AND ${ORDERS_TABLE}.end_date >= ?))`);

        props.push(
          formattedFromTime,
          formattedFromTime,
          formattedFromTime,
          formattedFromTime
        );
      }

      if (serverToTime) {
        const formattedToTime = listingListDateConverter(serverToTime);

        whereQueryParts.push(`(${ORDER_UPDATE_REQUESTS_TABLE}.id IS NOT NULL AND (${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date <= ? AND ${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date >= ?)) OR
              (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NULL AND (${ORDERS_TABLE}.start_date <= ? AND ${ORDERS_TABLE}.end_date >= ?))`);

        props.push(
          formattedToTime,
          formattedToTime,
          formattedToTime,
          formattedToTime
        );
      }

      const where = "(" + whereQueryParts.join(" OR ") + ")";
      this.whereRaw(where, props);
    });
  };

  totalCount = async ({
    serverFromTime,
    serverToTime,
    cities = [],
    categories = [],
    userId = null,
    searchCity = null,
    searchCategory = null,
  }) => {
    const fieldLowerEqualArray = this.fieldLowerEqualArray;

    let query = db(LISTINGS_TABLE);
    query = this.baseListJoin(query);
    query = query
      .where("approved", true)
      .where(`${USERS_TABLE}.verified`, true)
      .where(`${USERS_TABLE}.active`, true)
      .where(`${LISTINGS_TABLE}.active`, true);

    if (serverFromTime && serverToTime) {
      query = this.listTimeWhere(serverFromTime, serverToTime, query);
    }

    const queryCities = [...cities];
    const queryCategories = [...categories];

    if (searchCity) {
      queryCities.push(searchCity);
    }

    if (searchCategory) {
      queryCategories.push(searchCategory);
    }

    if (queryCities.length > 0) {
      query.whereRaw(...fieldLowerEqualArray(`city`, queryCities));
    }

    if (queryCategories.length > 0) {
      query.where(function () {
        this.whereRaw(
          ...fieldLowerEqualArray(
            `${LISTING_CATEGORIES_TABLE}.name`,
            queryCategories
          )
        )
          .orWhereRaw(...fieldLowerEqualArray(`c2.name`, queryCategories))
          .orWhereRaw(...fieldLowerEqualArray(`c3.name`, queryCategories));
      });
    }

    if (userId) {
      query = query.where({ owner_id: userId });
    }

    const { count } = await query
      .count(`${LISTINGS_TABLE}.id as count`)
      .first();
    return count;
  };

  totalCountWithLastRequests = async (
    filter,
    userId = null,
    status = "all"
  ) => {
    const subquery = db
      .select("id")
      .from(LISTING_APPROVAL_REQUESTS_TABLE)
      .groupBy("id")
      .orderBy("id", "desc")
      .limit(1);

    let query = db(LISTINGS_TABLE)
      .leftJoin(LISTING_APPROVAL_REQUESTS_TABLE, function () {
        this.on(
          `${LISTING_APPROVAL_REQUESTS_TABLE}.listing_id`,
          "=",
          `${LISTINGS_TABLE}.id`
        ).andOn(`${LISTING_APPROVAL_REQUESTS_TABLE}.id`, "=", subquery);
      })
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .whereRaw(
        ...this.baseStrFilter(
          filter,
          userId ? this.strFilterFields : this.strFullFilterFields
        )
      );

    const statusWhere = (isData) =>
      `(${LISTING_APPROVAL_REQUESTS_TABLE}.approved IS ${isData} AND ${LISTING_APPROVAL_REQUESTS_TABLE}.id IS NOT NULL)`;

    if (status == "approved") {
      query = query.whereRaw(statusWhere("TRUE"));
    }

    if (status == "unapproved") {
      query = query.whereRaw(
        `(${statusWhere(
          "FALSE"
        )} OR ${LISTING_APPROVAL_REQUESTS_TABLE}.id IS NULL)`
      );
    }

    if (status == "not_processed") {
      query = query.whereRaw(statusWhere("NULL"));
    }

    if (userId) {
      query = query.where({ owner_id: userId });
    }

    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async (props) => {
    const {
      serverFromTime = null,
      serverToTime = null,
      cities = [],
      categories = [],
      start,
      count,
      lat = null,
      lng = null,
      order = "default",
      searchCity = null,
      searchCategory = null,
    } = props;

    const fieldLowerEqualArray = this.fieldLowerEqualArray;

    const selectParams = [
      ...this.visibleFields,
      `${LISTING_CATEGORIES_TABLE}.name as categoryName`,
      `${USERS_TABLE}.name as userName`,
      `${USERS_TABLE}.photo as userPhoto`,
      `${USERS_TABLE}.id as userId`,
    ];

    const groupedParams = [
      ...this.baseGroupedFields,
      `${LISTING_CATEGORIES_TABLE}.name`,
      `${USERS_TABLE}.name`,
      `${USERS_TABLE}.photo`,
      `${USERS_TABLE}.id`,
    ];

    let canUseDefaultCoordsOrder = false;
    const generateDistanceRow = `SQRT(POW(${STATIC.LATITUDE_LONGITUDE_TO_KILOMETERS} * (rental_lat - ?), 2) + POW(${STATIC.LATITUDE_LONGITUDE_TO_KILOMETERS} * (? - rental_lng) * COS(rental_lat / ${STATIC.DEGREES_TO_RADIANS}), 2))`;

    if (lat && lng && (!order || order == "default")) {
      selectParams.push(
        db.raw(`${generateDistanceRow} AS distanceFromCenter`, [lat, lng])
      );

      canUseDefaultCoordsOrder = true;
    }

    let query = db(LISTINGS_TABLE).select(selectParams);
    query = this.baseListJoin(query);
    query = query
      .where("approved", true)
      .where(`${USERS_TABLE}.verified`, true)
      .where(`${USERS_TABLE}.active`, true)
      .where(`${LISTINGS_TABLE}.active`, true);

    if (serverFromTime && serverToTime) {
      query = this.listTimeWhere(serverFromTime, serverToTime, query);
    }

    const queryCities = [...cities];
    const queryCategories = [...categories];

    if (searchCity) {
      queryCities.push(searchCity);
    }

    if (searchCategory) {
      queryCategories.push(searchCategory);
    }

    if (queryCities.length > 0) {
      query.whereRaw(...fieldLowerEqualArray(`city`, queryCities));
    }

    if (queryCategories.length > 0) {
      query.where(function () {
        this.whereRaw(
          ...fieldLowerEqualArray(
            `${LISTING_CATEGORIES_TABLE}.name`,
            queryCategories
          )
        )
          .orWhereRaw(...fieldLowerEqualArray(`c2.name`, queryCategories))
          .orWhereRaw(...fieldLowerEqualArray(`c3.name`, queryCategories));
      });
    }

    if (props.userId) {
      query = query.where({ owner_id: props.userId });
    }

    let orderField = "id";
    let orderType = "asc";

    if (order == "latest") {
      orderField = "id";
      orderType = "desc";
    }

    if (order == "price_to_high") {
      orderField = "price_per_day";
      orderType = "asc";
    }

    if (order == "price_to_low") {
      orderField = "price_per_day";
      orderType = "desc";
    }

    if (canUseDefaultCoordsOrder) {
      orderField = db.raw(`${generateDistanceRow}`, [lat, lng]);
      orderType = "asc";
    }

    return await query
      .orderBy(orderField, orderType)
      .limit(count)
      .groupBy(groupedParams)
      .offset(start);
  };

  listWithLastRequests = async (props) => {
    const { filter, start, count, status } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = db(LISTINGS_TABLE)
      .select([
        ...this.visibleFields,
        `${LISTING_CATEGORIES_TABLE}.name as categoryName`,
        `${USERS_TABLE}.name as userName`,
        `${LISTING_APPROVAL_REQUESTS_TABLE}.id as requestId`,
        `${LISTING_APPROVAL_REQUESTS_TABLE}.approved as requestApproved`,
      ])
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .join(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
      )
      .leftJoin(LISTING_APPROVAL_REQUESTS_TABLE, function () {
        this.on(
          `${LISTING_APPROVAL_REQUESTS_TABLE}.listing_id`,
          "=",
          `${LISTINGS_TABLE}.id`
        ).andOnIn(
          `${LISTING_APPROVAL_REQUESTS_TABLE}.id`,
          db.raw(
            `(select max(id) from ${LISTING_APPROVAL_REQUESTS_TABLE} group by listing_id)`
          )
        );
      })
      .whereRaw(
        ...this.baseStrFilter(
          filter,
          props.userId ? this.strFilterFields : this.strFullFilterFields
        )
      );

    const statusWhere = (isData) =>
      `(${LISTING_APPROVAL_REQUESTS_TABLE}.approved IS ${isData} AND ${LISTING_APPROVAL_REQUESTS_TABLE}.id IS NOT NULL)`;

    if (status == "approved") {
      query = query.whereRaw(statusWhere("TRUE"));
    }

    if (status == "unapproved") {
      query = query.whereRaw(
        `(${statusWhere(
          "FALSE"
        )} OR ${LISTING_APPROVAL_REQUESTS_TABLE}.id IS NULL)`
      );
    }

    if (status == "not_processed") {
      query = query.whereRaw(statusWhere("NULL"));
    }

    if (props.userId) {
      query = query.where({ owner_id: props.userId });
    }

    return await query.orderBy(order, orderType).limit(count).offset(start);
  };

  changeApprove = async (id) => {
    const res = await db(LISTINGS_TABLE)
      .where({ id })
      .update({ approved: db.raw("NOT approved") })
      .returning("approved");

    return res[0].approved;
  };

  replaceOldNewCategories = async (oldNewCategoriesIds = []) => {
    for (let i = 0; i < oldNewCategoriesIds.length; i++) {
      await db(LISTINGS_TABLE)
        .where({ category_id: oldNewCategoriesIds[i]["prevId"] })
        .update({ category_id: oldNewCategoriesIds[i]["newId"] });
    }
  };

  getTopListings = () => this.list({ start: 0, count: 4, order: "latest" });

  listingsBindImages = async (listings, key = "id") => {
    const ids = listings.map((listing) => listing[key]);
    const listingImages = await this.getListingListImages(ids);

    const listingsWithImages = listings.map((listing) => {
      listing["images"] = listingImages.filter(
        (image) => image.listingId === listing[key]
      );
      return listing;
    });

    return listingsWithImages;
  };

  getDefects = async (listingId) => {
    return await db(LISTING_DEFECT_RELATIONS_TABLE)
      .join(
        LISTING_DEFECTS_TABLE,
        `${LISTING_DEFECTS_TABLE}.id`,
        "=",
        `${LISTING_DEFECT_RELATIONS_TABLE}.listing_defect_id`
      )
      .where("listing_id", listingId)
      .select([
        `${LISTING_DEFECT_RELATIONS_TABLE}.id`,
        `${LISTING_DEFECTS_TABLE}.id as defectId`,
        `${LISTING_DEFECTS_TABLE}.name as defectName`,
        `${LISTING_DEFECTS_TABLE}.order_index as orderIndex`,
      ]);
  };

  saveDefects = async (defectIds, listingId) => {
    await db(LISTING_DEFECT_RELATIONS_TABLE)
      .where("listing_id", listingId)
      .whereNotIn("listing_defect_id", defectIds)
      .delete();

    const prevDefectInfos = await db(LISTING_DEFECT_RELATIONS_TABLE)
      .where("listing_id", listingId)
      .whereIn("listing_defect_id", defectIds)
      .select([`listing_defect_id as defectId`]);

    const dbIds = prevDefectInfos.map((info) => info.defectId);

    const idsToSave = defectIds.filter((id) => !dbIds.includes(id));
    const relationsToSave = idsToSave.map((defectId) => ({
      listing_defect_id: defectId,
      listing_id: listingId,
    }));

    if (relationsToSave.length > 0) {
      await db(LISTING_DEFECT_RELATIONS_TABLE).insert(relationsToSave);
    }

    return await this.getDefects(listingId);
  };
}

module.exports = new ListingsModel();

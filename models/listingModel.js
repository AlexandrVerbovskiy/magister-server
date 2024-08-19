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
const USER_LISTING_FAVORITES_TABLE = STATIC.TABLES.USER_LISTING_FAVORITES;

class ListingsModel extends Model {
  baseGroupedFields = [
    `${LISTINGS_TABLE}.id`,
    `${LISTINGS_TABLE}.name`,
    `${LISTINGS_TABLE}.approved`,
    `${LISTINGS_TABLE}.active`,
    `${LISTINGS_TABLE}.address`,
    `${LISTINGS_TABLE}.city`,
    `${LISTINGS_TABLE}.category_id`,
    `${LISTINGS_TABLE}.other_category`,
    `${LISTINGS_TABLE}.other_category_parent_id`,
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
    `${LISTINGS_TABLE}.background_photo`,
  ];

  visibleFields = [
    `${LISTINGS_TABLE}.id`,
    `${LISTINGS_TABLE}.name`,
    `${LISTINGS_TABLE}.approved`,
    `${LISTINGS_TABLE}.active`,
    `${LISTINGS_TABLE}.address`,
    `${LISTINGS_TABLE}.city`,
    `${LISTINGS_TABLE}.category_id as categoryId`,
    `${LISTINGS_TABLE}.other_category as otherCategory`,
    `${LISTINGS_TABLE}.other_category_parent_id as otherCategoryParentId`,
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
  ];

  fullVisibleFields = [
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
    `${USERS_TABLE}.paypal_id as userPaypalId`,
    `${LISTING_CATEGORIES_TABLE}.name as categoryName`,
    `${LISTING_CATEGORIES_TABLE}.level as categoryLevel`,
  ];

  fullGroupedFields = [
    ...this.baseGroupedFields,
    `${USERS_TABLE}.id`,
    `${USERS_TABLE}.name`,
    `${USERS_TABLE}.email`,
    `${USERS_TABLE}.phone`,
    `${USERS_TABLE}.photo`,
    `${USERS_TABLE}.instagram_url`,
    `${USERS_TABLE}.linkedin_url`,
    `${USERS_TABLE}.facebook_url`,
    `${USERS_TABLE}.twitter_url`,
    `${USERS_TABLE}.place_work`,
    `${USERS_TABLE}.verified`,
    `${LISTING_CATEGORIES_TABLE}.name`,
    `${LISTING_CATEGORIES_TABLE}.level`,
  ];

  listingImageVisibleFields = ["id", "listing_id as listingId", "type", "link"];

  strFilterFields = [`${LISTINGS_TABLE}.name`, `${LISTINGS_TABLE}.city`];

  strFullFilterFields = [...this.strFilterFields, `${USERS_TABLE}.name`];

  orderFields = [
    "id",
    "name",
    "city",
    "min_rental_days",
    "count_stored_items",
    "price_per_day",
    "users.name",
    "approved",
    "active",
  ];

  generateDistanceRow = `SQRT(POW(${STATIC.LATITUDE_LONGITUDE_TO_KILOMETERS} * (rental_lat - ?), 2) + POW(${STATIC.LATITUDE_LONGITUDE_TO_KILOMETERS} * (? - rental_lng) * COS(rental_lat / ${STATIC.DEGREES_TO_RADIANS}), 2))`;

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
    categoryId = null,
    compensationCost,
    countStoredItems,
    description = "",
    postcode,
    pricePerDay,
    rentalLat,
    rentalLng,
    rentalRadius,
    ownerId,
    approved = false,
    minRentalDays = null,
    listingImages = [],
    city,
    backgroundPhoto = null,
    active = true,
    otherCategory = null,
    otherCategoryParentId = null,
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
        rental_radius: rentalRadius,
        category_id: categoryId,
        price_per_day: pricePerDay,
        min_rental_days: minRentalDays,
        compensation_cost: compensationCost,
        count_stored_items: countStoredItems,
        owner_id: ownerId,
        city,
        active,
        background_photo: backgroundPhoto,
        other_category: otherCategory,
        other_category_parent_id: otherCategoryParentId,
      })
      .returning("id");

    const listingId = res[0]["id"];

    for (let i = 0; i < listingImages.length; i++) {
      const image = listingImages[i];
      await this.createImage({
        type: image.type,
        link: image.link,
        listingId,
      });
    }

    const currentListingImages = await this.getListingImages(listingId);

    return {
      listingId,
      listingImages: currentListingImages,
    };
  };

  getListingListImages = async (listingIds) => {
    return await db(LISTING_IMAGES_TABLE)
      .whereIn("listing_id", listingIds)
      .select(this.listingImageVisibleFields)
      .orderBy("id");
  };

  getListingImages = (listingId) => this.getListingListImages([listingId]);

  getLightById = async (id) => {
    return await db(LISTINGS_TABLE)
      .where({ id })
      .select(this.visibleFields)
      .first();
  };

  getById = async (id) => {
    const listing = await this.getLightById(id);

    if (!listing) {
      return null;
    }

    const listingImages = await this.getListingImages(id);
    return { ...listing, listingImages };
  };

  getListByIds = async (ids) => {
    const listings = await db(LISTINGS_TABLE)
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .leftJoin(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
      )
      .whereIn(`${LISTINGS_TABLE}.id`, ids)
      .select(this.fullVisibleFields);

    return await this.listingsBindImages(listings);
  };

  getDopForTop = async (ignoreIds, count) => {
    const listings = await db(LISTINGS_TABLE)
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .leftJoin(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
      )
      .whereNotIn(`${LISTINGS_TABLE}.id`, ignoreIds)
      .orderBy(`${LISTINGS_TABLE}.created_at`, "desc")
      .select(this.fullVisibleFields)
      .limit(count);

    return await this.listingsBindImages(listings);
  };

  getFullWithoutImages = async (id) => {
    return await db(LISTINGS_TABLE)
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .leftJoin(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
      )
      .where(`${LISTINGS_TABLE}.id`, id)
      .select(this.fullVisibleFields)
      .first();
  };

  getFullById = async (id) => {
    const listing = await this.getFullWithoutImages(id);

    if (!listing) return null;

    const listingImages = await this.getListingImages(id);
    const categoryInfo = await listingCategoryModel.getRecursiveCategoryList(
      listing["categoryId"]
    );
    listing["userCountItems"] = await this.getOwnerCountListings(
      listing.userId
    );

    return { ...listing, listingImages, categoryInfo };
  };

  updateById = async ({
    id,
    name,
    categoryId = null,
    compensationCost,
    countStoredItems,
    description,
    postcode,
    approved,
    pricePerDay,
    rentalLat,
    rentalLng,
    rentalRadius,
    minRentalDays = null,
    listingImages = [],
    city,
    ownerId,
    address,
    active,
    backgroundPhoto = null,
    otherCategory = null,
    otherCategoryParentId = null,
  }) => {
    if (!minRentalDays) {
      minRentalDays = null;
    }

    const updateData = {
      name,
      city,
      description,
      postcode,
      approved,
      rental_lat: Number(rentalLat),
      rental_lng: Number(rentalLng),
      rental_radius: rentalRadius,
      category_id: categoryId,
      price_per_day: pricePerDay,
      min_rental_days: minRentalDays,
      compensation_cost: compensationCost,
      count_stored_items: countStoredItems,
      owner_id: ownerId,
      address,
      active,
      other_category: otherCategory,
      other_category_parent_id: otherCategoryParentId,
    };

    if (backgroundPhoto) {
      updateData["background_photo"] = backgroundPhoto;
    }

    await db(LISTINGS_TABLE).where({ id }).update(updateData);

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

    const imagesToUpdateIds = listingImagesToUpdate.map((image) => image.id);

    const imagesToDeleteLinks = currentImageLinks.filter(
      (link) => !actualListingImageLinks.includes(link)
    );

    await db(LISTING_IMAGES_TABLE)
      .where("listing_id", id)
      .whereNotIn("link", actualListingImageLinks)
      .whereNotIn("id", imagesToUpdateIds)
      .delete();

    for (let i = 0; i < listingImagesToUpdate.length; i++) {
      const image = listingImagesToUpdate[i];
      await this.updateImage({
        type: image.type,
        link: image.link,
        id: image.id,
        listingId: id,
      });
    }

    for (let i = 0; i < listingImagesToInsert.length; i++) {
      const image = listingImagesToInsert[i];
      await this.createImage({
        type: image.type,
        link: image.link,
        listingId: id,
      });
    }

    const currentListingImages = await this.getListingImages(id);

    return {
      listingImages: currentListingImages,
      imagesToDeleteLinks,
    };
  };

  updateOtherCategoryToNormal = async ({ prevCategoryName, newCategoryId }) => {
    await db(LISTINGS_TABLE)
      .whereRaw(
        `LOWER(${LISTINGS_TABLE}.other_category) LIKE ?`,
        `%${prevCategoryName.toLowerCase()}%`
      )
      .update({ category_id: newCategoryId, other_category: null });
  };

  hasAccess = async (listingId, userId) => {
    const listing = await db(LISTINGS_TABLE)
      .where({ id: listingId })
      .select(this.visibleFields)
      .first();

    if (!listing || listing.ownerId != userId) {
      return null;
    }

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
    await db(LISTING_IMAGES_TABLE)
      .where({
        listing_id: listingId,
      })
      .delete();

    await db(LISTINGS_TABLE).where({ id: listingId }).delete();
  };

  changeActiveByUser = async (listingId, userId) => {
    const res = await db(LISTINGS_TABLE)
      .where({ id: listingId, owner_id: userId })
      .update({ active: db.raw("NOT active") })
      .returning("active");

    return res[0]?.active ?? null;
  };

  changeActive = async (listingId) => {
    const res = await db(LISTINGS_TABLE)
      .where({ id: listingId })
      .update({ active: db.raw("NOT active") })
      .returning("active");

    return res[0]?.active ?? null;
  };

  baseListJoin = (query) =>
    query
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .leftJoin(
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

  baseJoinUserFavorites = (query, favorites, searcherId) => {
    if (!favorites || !searcherId) {
      return query;
    }

    return query.joinRaw(
      `JOIN ${USER_LISTING_FAVORITES_TABLE} ON (${USER_LISTING_FAVORITES_TABLE}.listing_id = ${LISTINGS_TABLE}.id AND ${USER_LISTING_FAVORITES_TABLE}.user_id = ?)`,
      [searcherId]
    );
  };

  listTimeWhere = (timeInfos, query) => {
    const { serverFromTime, serverToTime } = timeInfos;

    return query.whereNotIn(`${LISTINGS_TABLE}.id`, function () {
      this.select("listing_id")
        .from(ORDERS_TABLE)
        .joinRaw(
          `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
               ${ORDERS_TABLE}.id = ${ORDER_UPDATE_REQUESTS_TABLE}.order_id AND ${ORDER_UPDATE_REQUESTS_TABLE}.active`
        ).whereRaw(`${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_OWNER}' AND
            ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_TENANT}' AND
            (${ORDERS_TABLE}.cancel_status IS NULL OR ${ORDERS_TABLE}.cancel_status != '${STATIC.ORDER_CANCELATION_STATUSES.CANCELLED}') AND
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

  baseDistanceFilter = (query, distance = null, lat = null, lng = null) => {
    if (distance && lat && lng) {
      distance = query.whereRaw(`${this.generateDistanceRow} <= ?`, [
        lat,
        lng,
        distance,
      ]);
    }

    return query;
  };

  basePriceFilter = (query, minPrice = null, maxPrice = null) => {
    if (minPrice) {
      query = query.where(`${LISTINGS_TABLE}.price_per_day`, ">=", minPrice);
    }

    if (maxPrice) {
      query = query.where(`${LISTINGS_TABLE}.price_per_day`, "<=", maxPrice);
    }

    return query;
  };

  queryByActive = (query, active) => {
    if (active == "active") {
      query = query.where(`${LISTINGS_TABLE}.active`, true);
    }

    if (active == "inactive") {
      query = query.where(`${LISTINGS_TABLE}.active`, false);
    }

    return query;
  };

  queryByStatus = (query, status) => {
    if (status == "approved") {
      query = query.whereRaw(`(${LISTINGS_TABLE}.approved IS TRUE)`);
    }

    if (status == "unapproved") {
      query = query.whereRaw(
        `(${LISTINGS_TABLE}.approved IS FALSE AND (${LISTING_APPROVAL_REQUESTS_TABLE}.id IS NULL OR ${LISTING_APPROVAL_REQUESTS_TABLE}.approved IS NOT NULL))`
      );
    }

    if (status == "not-processed") {
      query = query.whereRaw(
        `(${LISTING_APPROVAL_REQUESTS_TABLE}.approved IS NULL AND ${LISTING_APPROVAL_REQUESTS_TABLE}.id IS NOT NULL)`
      );
    }

    return query;
  };

  queryByApproved = (query, approved) => {
    if (approved == "approved") {
      query = query.where(`${LISTINGS_TABLE}.approved`, true);
    }

    if (approved == "unapproved") {
      query = query.where(`${LISTINGS_TABLE}.approved`, false);
    }

    return query;
  };

  baseCategoryFilter = ({
    query,
    queryCategories,
    totalOthersCategories,
    othersCategories,
  }) => {
    const fieldLowerEqualArray = this.fieldLowerEqualArray;

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

        if (totalOthersCategories) {
          this.orWhereNull(`${LISTINGS_TABLE}.category_id`);
        }

        if (othersCategories.length > 0) {
          this.orWhereIn(
            `${LISTINGS_TABLE}.other_category_parent_id`,
            othersCategories
          );
        }
      });
    } else {
      if (totalOthersCategories) {
        query = query.where(function () {
          this.whereNull(`${LISTINGS_TABLE}.category_id`);
        });

        if (othersCategories.length > 0) {
          this.orWhereIn(
            `${LISTINGS_TABLE}.other_category_parent_id`,
            othersCategories
          );
        }
      } else {
        if (othersCategories.length > 0) {
          query = query.whereIn(
            `${LISTINGS_TABLE}.other_category_parent_id`,
            othersCategories
          );
        }
      }
    }

    return query;
  };

  totalCount = async ({
    cities = [],
    categories = [],
    othersCategories = [],
    userId = null,
    searchCity = null,
    searchCategory = null,
    distance = null,
    minPrice = null,
    maxPrice = null,
    lat = null,
    lng = null,
    totalOthersCategories = null,
    searchListing = null,
    favorites = false,
    searcherId = null,
  }) => {
    const fieldLowerEqualArray = this.fieldLowerEqualArray;

    let query = db(LISTINGS_TABLE);
    query = this.baseListJoin(query);
    query = this.baseJoinUserFavorites(query, favorites, searcherId);

    query = query
      .where("approved", true)
      .where(`${USERS_TABLE}.active`, true)
      .where(`${LISTINGS_TABLE}.active`, true);

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

    if (searchListing) {
      query.whereRaw(
        ...this.fieldLowerEqualString(`${LISTINGS_TABLE}.name`, searchListing)
      );
    }

    query = this.baseCategoryFilter({
      query,
      queryCategories,
      totalOthersCategories,
      othersCategories,
    });

    if (userId) {
      query = query.where("owner_id", userId);
    }

    query = this.baseDistanceFilter(query, distance, lat, lng);
    query = this.basePriceFilter(query, minPrice, maxPrice);

    const result = await query.count(`${LISTINGS_TABLE}.id as count`).first();
    return +result?.count;
  };

  bindOwnerListCountListings = async (
    entities,
    key = "id",
    resultKey = "ownerCountItems"
  ) => {
    const userIds = entities.map((entity) => entity[key]);

    const countInfos = await db(LISTINGS_TABLE)
      .select("owner_id as ownerId")
      .count(`${LISTINGS_TABLE}.id as count`)
      .whereIn("owner_id", userIds)
      .groupBy("owner_id");

    entities.forEach((entity, index) => {
      entities[index][resultKey] = 0;

      countInfos.forEach((countInfo) => {
        if (entities[index] === countInfo["ownerId"]) {
          entities[index][resultKey] = countInfo["count"];
        }
      });
    });

    return entities;
  };

  getOwnerCountListings = async (userId) => {
    const result = await db(LISTINGS_TABLE)
      .where({ owner_id: userId })
      .where({ active: true })
      .where({ approved: true })
      .count(`${LISTINGS_TABLE}.id as count`)
      .first();

    return +result?.count;
  };

  bindTenantListCountListings = async (
    entities,
    key = "id",
    resultKey = "tenantCountItems"
  ) => {
    const userIds = entities.map((entity) => entity[key]);

    const countInfos = await db(ORDERS_TABLE)
      .select("tenant_id as tenantId")
      .countDistinct(`${ORDERS_TABLE}.listing_id as count`)
      .whereIn("tenant_id", userIds)
      .groupBy("tenant_id");

    entities.forEach((entity, index) => {
      entities[index][resultKey] = 0;

      countInfos.forEach((countInfo) => {
        if (entities[index] === countInfo["tenantId"]) {
          entities[index][resultKey] = countInfo["count"];
        }
      });
    });

    return entities;
  };

  getTenantCountListings = async (userId) => {
    const result = await db(ORDERS_TABLE)
      .where({ tenant_id: userId })
      .countDistinct(`${ORDERS_TABLE}.listing_id as count`)
      .first();

    return +result?.count;
  };

  baseTotalCountWithLastRequestsQuery = (filter, userId = null) => {
    let query = db(LISTINGS_TABLE)
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
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .whereRaw(
        ...this.baseStrFilter(
          filter,
          userId ? this.strFilterFields : this.strFullFilterFields
        )
      );

    if (userId) {
      query = query.where("owner_id", userId);
    }

    return query;
  };

  totalCountWithLastRequestsByApprovedWaited = async (
    filter,
    userId = null,
    { active = null, approved = null }
  ) => {
    let query = this.baseTotalCountWithLastRequestsQuery(filter, userId);
    query = this.queryByActive(query, active);
    query = this.queryByApproved(query, approved);

    const result = await query.count("* as count").first();
    return +result?.count;
  };

  totalCountWithLastRequestsByStatus = async (
    filter,
    userId = null,
    { status = null }
  ) => {
    let query = this.baseTotalCountWithLastRequestsQuery(filter, userId);
    query = this.queryByStatus(query, status);
    const result = await query.count("* as count").first();
    return +result?.count;
  };

  list = async (props) => {
    const {
      cities = [],
      categories = [],
      othersCategories = [],
      start,
      count,
      lat = null,
      lng = null,
      order = "default",
      searchCity = null,
      searchCategory = null,
      searchListing = null,
      distance = null,
      minPrice = null,
      maxPrice = null,
      totalOthersCategories = null,
      favorites = false,
      searcherId = null,
    } = props;

    const fieldLowerEqualArray = this.fieldLowerEqualArray;

    const selectParams = this.fullVisibleFields;
    const groupedParams = this.fullGroupedFields;

    let canUseDefaultCoordsOrder = false;

    if (lat && lng && (!order || order == "default")) {
      selectParams.push(
        db.raw(`${this.generateDistanceRow} AS distanceFromCenter`, [lat, lng])
      );

      canUseDefaultCoordsOrder = true;
    }

    let query = db(LISTINGS_TABLE).select(selectParams);
    query = this.baseListJoin(query);
    query = this.baseJoinUserFavorites(query, favorites, searcherId);
    query = query
      .where("approved", true)
      .where(`${USERS_TABLE}.active`, true)
      .where(`${LISTINGS_TABLE}.active`, true);

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

    if (searchListing) {
      query.whereRaw(
        ...this.fieldLowerEqualString(`${LISTINGS_TABLE}.name`, searchListing)
      );
    }

    query = this.baseCategoryFilter({
      query,
      queryCategories,
      totalOthersCategories,
      othersCategories,
    });

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
      orderField = db.raw(`${this.generateDistanceRow}`, [lat, lng]);
      orderType = "asc";
    }

    query = this.baseDistanceFilter(query, distance, lat, lng);
    query = this.basePriceFilter(query, minPrice, maxPrice);

    return await query
      .orderBy(orderField, orderType)
      .limit(count)
      .groupBy(groupedParams)
      .offset(start);
  };

  baseListWithLastRequestsQuery = (props) => {
    const { filter } = props;

    let query = db(LISTINGS_TABLE)
      .select([
        ...this.visibleFields,
        `${LISTING_CATEGORIES_TABLE}.name as categoryName`,
        `${USERS_TABLE}.name as ownerName`,
        `${USERS_TABLE}.email as ownerEmail`,
        `${USERS_TABLE}.phone as ownerPhone`,
        `${USERS_TABLE}.photo as ownerPhoto`,
        `${LISTING_APPROVAL_REQUESTS_TABLE}.id as requestId`,
        `${LISTING_APPROVAL_REQUESTS_TABLE}.approved as requestApproved`,
        db.raw(`COUNT(${ORDERS_TABLE}.id) as "ordersCount"`),
      ])
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .joinRaw(
        `LEFT JOIN ${ORDERS_TABLE} ON ${LISTINGS_TABLE}.id = ${ORDERS_TABLE}.listing_id AND (${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.FINISHED}' AND ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.REJECTED}' AND (${ORDERS_TABLE}.cancel_status IS NULL OR ${ORDERS_TABLE}.cancel_status != '${STATIC.ORDER_CANCELATION_STATUSES.CANCELLED}'))`
      )
      .leftJoin(
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

    if (props.userId) {
      query = query.where({ owner_id: props.userId });
    }

    return query;
  };

  baseListWithLastRequestsSelect = async (query, props) => {
    const { start, count } = props;
    const { order, orderType } = this.getOrderInfo(props);

    return await query
      .groupBy([
        ...this.baseGroupedFields,
        `${LISTING_CATEGORIES_TABLE}.name`,
        `${USERS_TABLE}.name`,
        `${USERS_TABLE}.email`,
        `${USERS_TABLE}.phone`,
        `${USERS_TABLE}.photo`,
        `${LISTING_APPROVAL_REQUESTS_TABLE}.id`,
        `${LISTING_APPROVAL_REQUESTS_TABLE}.approved`,
      ])
      .orderBy(`${LISTINGS_TABLE}.active`, "desc")
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  listWithLastRequestsByApprovedWaited = async (props) => {
    const { active = null, approved = null } = props;

    let query = this.baseListWithLastRequestsQuery(props);
    query = this.queryByActive(query, active);
    query = this.queryByApproved(query, approved);

    return this.baseListWithLastRequestsSelect(query, props);
  };

  listWithLastRequestsByStatus = async (props) => {
    const { status = null } = props;
    let query = this.baseListWithLastRequestsQuery(props);
    query = this.queryByStatus(query, status);
    return this.baseListWithLastRequestsSelect(query, props);
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

  priceLimits = async () => {
    const result = await db(LISTINGS_TABLE)
      .min("price_per_day as minLimitPrice")
      .max("price_per_day as maxLimitPrice")
      .first();

    return {
      minPrice: result["minLimitPrice"] ?? 0,
      maxPrice: result["maxLimitPrice"] ?? 0,
    };
  };

  timeRentedByIds = async (ids) => {
    const requestResult = await db(ORDERS_TABLE)
      .whereIn("listing_id", ids)
      .where(`${ORDERS_TABLE}.status`, STATIC.ORDER_STATUSES.FINISHED)
      .groupBy("listing_id")
      .count("* as count")
      .select(`listing_id as listingId`);

    const obj = {};
    ids.forEach((id) => (obj[id] = 0));
    requestResult.forEach((info) => (obj[info["listingId"]] = +info["count"]));

    return obj;
  };
}

module.exports = new ListingsModel();

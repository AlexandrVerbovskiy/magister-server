require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const listingCategoriesModel = require("./listingCategoriesModel");

const USERS_TABLE = STATIC.TABLES.USERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const LISTING_IMAGES_TABLE = STATIC.TABLES.LISTING_IMAGES;
const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;

class ListingsModel extends Model {
  visibleFields = [
    `${LISTINGS_TABLE}.id`,
    `${LISTINGS_TABLE}.name`,
    "city",
    "category_id as categoryId",
    "compensation_cost as compensationCost",
    "count_stored_items as countStoredItems",
    "description",
    "postcode",
    "approved",
    "owner_id as ownerId",
    "price_per_day as pricePerDay",
    "min_rental_days as minimumRentalDays",
    "rental_lat as rentalLat",
    "rental_lng as rentalLng",
    "rental_radius as rentalRadius",
    "rental_terms as rentalTerms",
    "key_words as keyWords",
  ];

  listingImageVisibleFields = ["id", "listing_id as listingId", "type", "link"];

  strFilterFields = [`${LISTINGS_TABLE}.name`, "key_words"];

  orderFields = [
    `id`,
    "line",
    "min_rental_days",
    "count_stored_items",
    "price_per_day",
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

  create = async ({
    name,
    categoryId,
    compensationCost,
    countStoredItems,
    description,
    postcode,
    pricePerDay,
    rentalLat,
    rentalLng,
    rentalRadius,
    rentalTerms,
    ownerId,
    keyWords,
    approved = false,
    minimumRentalDays = null,
    listingImages = [],
    city,
  }) => {
    const res = await db(LISTINGS_TABLE)
      .insert({
        name,
        description,
        postcode,
        approved,
        rental_lat: rentalLat,
        rental_lng: rentalLng,
        rental_terms: rentalTerms,
        rental_radius: rentalRadius,
        category_id: categoryId,
        price_per_day: pricePerDay,
        min_rental_days: minimumRentalDays,
        compensation_cost: compensationCost,
        count_stored_items: countStoredItems,
        owner_id: ownerId,
        key_words: keyWords,
        city,
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

    return listingId;
  };

  getListingImages = async (listingId) => {
    return await db(LISTING_IMAGES_TABLE)
      .where({ listing_id: listingId })
      .select(this.listingImageVisibleFields);
  };

  getListingListImages = async (listingIds) => {
    return await db(LISTING_IMAGES_TABLE)
      .whereIn("listing_id", listingIds)
      .select(this.listingImageVisibleFields);
  };

  getById = async (id) => {
    const listing = await db(LISTINGS_TABLE)
      .where({ id })
      .select(this.visibleFields)
      .first();

    if (!listing) return null;

    const listingImages = await this.getListingImages(id);

    return { ...listing, listingImages };
  };

  getFullById = async (id) => {
    const listing = await db(LISTINGS_TABLE)
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
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
      ])
      .first();

    if (!listing) return null;

    const listingImages = await this.getListingImages(id);
    const categoryInfo = await listingCategoriesModel.getRecursiveCategoryList(
      listing["categoryId"]
    );
    return { ...listing, listingImages, categoryInfo };
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
    minimumRentalDays = null,
    listingImages = [],
    keyWords,
    city,
  }) => {
    await db(LISTINGS_TABLE).where({ id }).update({
      name,
      city,
      description,
      postcode,
      approved,
      rental_lat: rentalLat,
      rental_lng: rentalLng,
      rental_terms: rentalTerms,
      rental_radius: rentalRadius,
      category_id: categoryId,
      price_per_day: pricePerDay,
      min_rental_days: minimumRentalDays,
      compensation_cost: compensationCost,
      count_stored_items: countStoredItems,
      key_words: keyWords,
    });

    const currentImages = await this.getListingImages(id);
    const currentImageLinks = currentImages.map((image) => image.link);

    const listingImagesToInsert = listingImages.filter(
      (image) => !currentImageLinks.includes(image.link)
    );

    const actualListingImageLinks = listingImages
      .filter((image) => currentImageLinks.includes(image.link))
      .map((image) => image.link);

    const toDeleteImagesQuery = db(LISTING_IMAGES_TABLE).whereNotIn(
      "link",
      actualListingImageLinks
    );

    const deletedImagesInfos = await toDeleteImagesQuery.select(
      this.listingImageVisibleFields
    );

    await toDeleteImagesQuery.delete();

    listingImagesToInsert.forEach(
      async (image) =>
        await this.createImage({
          type: image.type,
          link: image.link,
          listingId: id,
        })
    );

    return { deletedImagesInfos };
  };

  hasAccess = async (listingId, userId) => {
    const listing = await db(LISTINGS_TABLE)
      .where({ id: listingId, owner_id: userId })
      .first();
    return !!listing;
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

  totalCount = async (filter, userId = null) => {
    let query = db(LISTINGS_TABLE).whereRaw(...this.baseStrFilter(filter));

    if (userId) {
      query = query.where({ owner_id: userId });
    }

    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async (props) => {
    const { filter, start, count } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = db(LISTINGS_TABLE)
      .select([
        ...this.visibleFields,
        `${LISTING_CATEGORIES_TABLE}.name as categoryName`,
      ])
      .join(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
      )
      .whereRaw(...this.baseStrFilter(filter));

    if (props.userId) {
      query = query.where({ owner_id: props.userId });
    }

    return await query.orderBy(order, orderType).limit(count).offset(start);
  };
}

module.exports = new ListingsModel();

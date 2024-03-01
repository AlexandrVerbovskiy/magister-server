require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const listingCategoriesModel = require("./listingCategoriesModel");

const USERS_TABLE = STATIC.TABLES.USERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const LISTING_IMAGES_TABLE = STATIC.TABLES.LISTING_IMAGES;

class ListingsModel extends Model {
  visibleFields = [
    "id",
    "name",
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

  listingImageVisibleFields = ["id", "listing_id", "type", "link"];

  strFilterFields = ["name", "key_words"];

  orderFields = [
    "id",
    "line",
    "min_rental_days",
    "count_stored_items",
    "price_per_day",
  ];

  createImage = async ({ type, link, listingId }) => {
    const res = await db(LISTING_IMAGES_TABLE)
      .insert({
        listing_id: listingId,
        type,
        link,
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

  getById = async (id) => {
    const listing = await db(LISTING_IMAGES_TABLE)
      .where({ id })
      .select(this.visibleFields)
      .first();

    if (!listing) return null;

    const listingImages = await this.getListingImages(id);

    return { ...listing, listingImages };
  };

  getFullById = async (id) => {
    const listing = await db(LISTING_IMAGES_TABLE)
      .join(
        USERS_TABLE,
        `${USERS_TABLE}.id`,
        "=",
        `${LISTING_IMAGES_TABLE}.owner_id`
      )
      .where({ id })
      .select([
        ...this.visibleFields,
        `${LISTING_IMAGES_TABLE}.id as user_id`,
        `${LISTING_IMAGES_TABLE}.name as user_name`,
        `${LISTING_IMAGES_TABLE}.email as user_email`,
        `${LISTING_IMAGES_TABLE}.photo as user_photo`,
      ])
      .first();

    if (!listing) return null;

    const listingImages = await this.getListingImages(id);
    const categoryInfo = await listingCategoriesModel.categoriesWithParents(
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
  }) => {
    await db(LISTINGS_TABLE).where({ id }).update({
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
      key_words: keyWords,
    });

    const currentImages = await this.getListingImages(id);
    const currentImageIds = currentImages.map((image) => image.id);

    const listingImagesToInsert = listingImages.filter(
      (image) => !currentImageIds.includes(image.id)
    );

    const actualListingImageIds = listingImages
      .filter((image) => currentImageIds.includes(image.id))
      .map((image) => image.id);

    const toDeleteImagesQuery = db(LISTING_IMAGES_TABLE).whereNotIn(
      "id",
      actualListingImageIds
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
          listingId,
        })
    );

    return { deletedImagesInfos };
  };

  hasAccess = async (listingId, userId) => {
    const listing = await db(LISTINGS_TABLE)
      .where({ listing_id: listingId, owner_id: userId })
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
}

module.exports = new ListingsModel();

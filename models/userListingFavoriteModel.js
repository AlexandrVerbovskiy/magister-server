const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const USER_LISTING_FAVORITES_TABLE = STATIC.TABLES.USER_LISTING_FAVORITES;

class UserListingFavoriteModel extends Model {
  checkUserListingHasRelation = async (userId, listingId) =>
    await db(USER_LISTING_FAVORITES_TABLE)
      .where({
        listing_id: listingId,
        user_id: userId,
      })
      .first();

  changeUserFavorite = async (userId, listingId) => {
    const hasRelation = await this.checkUserListingHasRelation(
      userId,
      listingId
    );

    if (hasRelation) {
      await db(USER_LISTING_FAVORITES_TABLE)
        .where({
          listing_id: listingId,
          user_id: userId,
        })
        .delete();
    } else {
      await db(USER_LISTING_FAVORITES_TABLE).insert({
        listing_id: listingId,
        user_id: userId,
      });
    }

    return !hasRelation;
  };

  bindUserListingListFavorite = async (listings, userId, key = "id") => {
    const listingIds = listings.map((listing) => listing[key]);

    const dbRelations = await db(USER_LISTING_FAVORITES_TABLE)
      .where("user_id", userId)
      .whereIn("listing_id", listingIds)
      .select(["listing_id as listingId"]);

    listings.forEach((listing, index) => {
      listings[index]["favorite"] = false;

      dbRelations.forEach((relation) => {
        if (listing[key] == relation.listingId) {
          listings[index]["favorite"] = true;
        }
      });
    });

    return listings;
  };
}

module.exports = new UserListingFavoriteModel();

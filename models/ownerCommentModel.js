require("dotenv").config();
const userCommentModel = require("./userCommentModel");

class OwnerCommentModel extends userCommentModel {
  type = "owner";
}

module.exports = new OwnerCommentModel();

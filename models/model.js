require("dotenv").config();

class Model {
  constructor(db) {
    this.db = db;
  }
}

module.exports = Model;

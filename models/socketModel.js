require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const SOCKET_TABLE = STATIC.TABLES.SOCKETS;
const USER_TABLE = STATIC.TABLES.USERS;

class Socket extends Model {
  findUserSockets = async (userIds) => {
    const resultSelect = await db(SOCKET_TABLE)
      .whereIn("user_id", userIds)
      .select(["user_id as userId", "socket"]);

    return resultSelect.map((row) => row.socket);
  };

  getAdminsSockets = async () => {
    const opponentInfos = await db(USER_TABLE)
      .join(SOCKET_TABLE, `${USER_TABLE}.id`, "=", `${SOCKET_TABLE}.user_id`)
      .whereNot(`${USER_TABLE}.role`, STATIC.ROLES.USER)
      .select(["user_id as userId", "socket"]);

    return opponentInfos.map((row) => row.socket);
  };

  connect = async (socket, userId) => {
    const res = await db(SOCKET_TABLE)
      .insert({
        socket,
        user_id: userId,
      })
      .returning("id");

    return res[0]["id"];
  };

  disconnect = async (socket) => {
    await db(SOCKET_TABLE).where("socket", socket.id).delete();
  };
}

module.exports = new Socket();

require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const SOCKET_TABLE = STATIC.TABLES.SOCKETS;

class Socket extends Model {
  findUserSockets = async (userIds) => {
    const resultSelect = await db(SOCKET_TABLE)
      .whereIn("user_id", userIds)
      .select(["user_id as userId", "socket"]);

    return resultSelect.map((row) => row.socket);
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

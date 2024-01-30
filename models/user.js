require("dotenv").config();
const bcrypt = require("bcrypt");
const STATIC = require("../static");
const Model = require("./model");
const { generateRandomString } = require("../utils");

class User extends Model {
  userByEmail = async (email) => {
    const users = await this.db.query("SELECT * from users where email = $1", [
      email,
    ]);
    return users[0];
  };

  create = async ({
    name,
    email,
    password,
    acceptedTermCondition,
    role = null,
  }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userToSave = {
      role: role ?? STATIC.ROLES.USER,
      name,
      email,
      acceptedTermCondition,
      password: hashedPassword,
    };

    const { id } = await this.db.one(
      "INSERT INTO users(role, name, email, password, accepted_term_condition) VALUES(${role}, ${name}, ${email}, ${password}, ${acceptedTermCondition}) RETURNING id",
      userToSave
    );

    return id;
  };

  findByEmailAndPassword = async (email, password) => {
    const userByEmail = await this.userByEmail(email);

    if (!userByEmail) return null;

    const isPasswordValid = await bcrypt.compare(
      password,
      userByEmail.password
    );

    if (!isPasswordValid) return null;

    return userByEmail;
  };

  getById = async (id) => {
    const users = await this.db.query("SELECT * from users where id = $1", [
      id,
    ]);
    return users[0];
  };

  __checkRole = async (id, role) => {
    const users = await this.db.query(
      "SELECT email from users where id = ${id} AND role=${role}",
      { id, role: role }
    );
    return users[0];
  };

  checkIsAdmin = (id) => {
    return this.__checkRole(id, STATIC.ROLES.ADMIN);
  };

  setRole = async (id, role) => {
    await this.db.one("UPDATE users SET role=${role} where id = ${id}", {
      role: role,
      id,
    });
  };

  changeActive = async (id) => {
    const { active } = await this.db.one(
      "UPDATE users SET active = NOT active where id = $1 RETURNING active",
      [id]
    );

    return active;
  };

  generateEmailVerifyToken = async (id) => {
    const token = generateRandomString();
    await this.db.none(
      "INSERT INTO email_verified_tokens (user_id, token) VALUES (${id}, ${token})",
      { id, token }
    );
    return token;
  };

  getUserIdByEmailVerifiedToken = async (token) => {
    const tokens = await this.db.query(
      "SELECT user_id from email_verified_tokens where token = ${token}",
      { token }
    );

    if (tokens.length < 1) return null;

    return tokens[0].user_id;
  };

  setEmailVerified = async (id) => {
    await this.db.none("UPDATE users SET email_verified = true where id = $1", [
      id,
    ]);
  };

  removeEmailVerifiedToken = async (userId) => {
    await this.db.none("DELETE FROM users where user_id = $1", [userId]);
  };

  generateResetPasswordToken = async (id) => {
    const tokens = await this.db.query(
      "SELECT token from reset_password_tokens where id = $1",
      [id]
    );

    if (tokens.length > 0) return tokens[0].token;

    const token = generateRandomString();

    await this.db.none(
      "INSERT INTO reset_password_tokens (user_id, token) VALUES (${id}, ${token})",
      { id, token }
    );
    
    return token;
  };

  getUserIdByResetPasswordToken = async (token) => {
    const tokens = await this.db.query(
      "SELECT user_id from reset_password_tokens where token = ${token}",
      { token }
    );

    if (tokens.length < 1) return null;

    return tokens[0].user_id;
  };

  setNewPassword = async (id, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.db.none(
      "UPDATE users SET password = ${password} where id = ${id}",
      { id, password: hashedPassword }
    );
  };

  removeResetPasswordToken = async (userId) => {
    await this.db.none("DELETE FROM reset_password_tokens where user_id = $1", [
      userId,
    ]);
  };
}

module.exports = User;

require("dotenv").config();
const bcrypt = require("bcrypt");
const STATIC = require("../static");
const Model = require("./model");
const { generateRandomString } = require("../utils");

class User extends Model {
  userFilter =
    "(email LIKE ${filter} OR name like ${filter} OR phone like ${filter})";

  visibleFields = `id, name, email, email_verified, role, contact_details, brief_bio, photo, phone, phone_verified, linkedin, facebook, active, suspicious`;

  getByEmail = async (email) => {
    const query = "SELECT * from users where email = $1";
    const users = await this.db.query(query, [email]);
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

    const query = `INSERT INTO users(role, name, email, password, accepted_term_condition) 
      VALUES(\${role}, \${name}, \${email}, \${password}, \${acceptedTermCondition}) 
      RETURNING id`;
    const { id } = await this.db.one(query, userToSave);
    return id;
  };

  findByEmailAndPassword = async (email, password) => {
    const getByEmail = await this.getByEmail(email);

    if (!getByEmail) return null;

    const isPasswordValid = await bcrypt.compare(password, getByEmail.password);

    if (!isPasswordValid) return null;

    return getByEmail;
  };

  getById = async (id) => {
    const query = `SELECT ${this.visibleFields} from users where id = $1`;
    const users = await this.db.query(query, [id]);
    return users[0];
  };

  checkRole = async (id, role) => {
    const query = "SELECT email from users where id = ${id} AND role=${role}";
    const users = await this.db.query(query, { id, role: role });
    return users[0];
  };

  checkIsAdmin = (id) => {
    return this.checkRole(id, STATIC.ROLES.ADMIN);
  };

  setRole = async (id, role) => {
    const query = "UPDATE users SET role=${role} where id = ${id}";
    await this.db.one(query, {
      role: role,
      id,
    });
  };

  changeActive = async (id) => {
    const query =
      "UPDATE users SET active = NOT active where id = $1 RETURNING active";
    const { active } = await this.db.one(query, [id]);
    return active;
  };

  generateEmailVerifyToken = async (id) => {
    const token = generateRandomString();
    const query =
      "INSERT INTO email_verified_tokens (user_id, token) VALUES (${id}, ${token})";
    await this.db.none(query, { id, token });
    return token;
  };

  getUserIdByEmailVerifiedToken = async (token) => {
    const query =
      "SELECT user_id from email_verified_tokens where token = ${token}";
    const tokens = await this.db.query(query, { token });

    if (tokens.length < 1) {
      return null;
    }

    return tokens[0].user_id;
  };

  setEmailVerified = async (id) => {
    const query = "UPDATE users SET email_verified = true where id = $1";
    await this.db.none(query, [id]);
  };

  removeEmailVerifiedToken = async (userId) => {
    const query = "DELETE FROM users where user_id = $1";
    await this.db.none(query, [userId]);
  };

  generateResetPasswordToken = async (id) => {
    const selectTokensQuery =
      "SELECT token from reset_password_tokens where id = $1";
    const tokens = await this.db.query(selectTokensQuery, [id]);

    if (tokens.length > 0) {
      return tokens[0].token;
    }

    const token = generateRandomString();
    const insertTokensQuery =
      "INSERT INTO reset_password_tokens (user_id, token) VALUES (${id}, ${token})";
    await this.db.none(insertTokensQuery, { id, token });
    return token;
  };

  getUserIdByResetPasswordToken = async (token) => {
    const query =
      "SELECT user_id from reset_password_tokens where token = ${token}";
    const tokens = await this.db.query(query, { token });

    if (tokens.length < 1) {
      return null;
    }

    return tokens[0].user_id;
  };

  setNewPassword = async (id, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "UPDATE users SET password = ${password} where id = ${id}";
    await this.db.none(query, { id, password: hashedPassword });
  };

  removeResetPasswordToken = async (userId) => {
    const query = "DELETE FROM reset_password_tokens where user_id = $1";
    await this.db.none(query, [userId]);
  };

  totalCount = async (filter) => {
    filter = `%${filter}%`;
    const query = `SELECT COUNT(*) as count FROM users WHERE ${this.userFilter}`;
    const res = await this.db.query(query, { filter });
    return res[0]["count"];
  };

  list = async ({ filter, order, orderType, start, count }) => {
    filter = `%${filter}%`;
    const canBeOrderField = ["id", "email", "name", "phone"];

    orderType = orderType ?? "desc";
    orderType = orderType.toLowerCase() == "desc" ? "desc" : "asc";
    order = order ?? "id";

    if (!canBeOrderField.includes(order.toLowerCase())) {
      order = "id";
    }

    const query = `SELECT ${this.visibleFields} FROM users
      WHERE ${this.userFilter} 
      ORDER BY ${order} ${orderType} 
      LIMIT \${count} OFFSET \${start}`;

    return await this.db.query(query, { filter, start, count });
  };

  delete = async (id) => {
    const query = "DELETE FROM users where id = $1";
    await this.db.none(query, [id]);
  };

  getById = async (id) => {
    const query = `SELECT ${this.visibleFields}, two_factor_authentication FROM users where id = $1`;
    const users = await this.db.query(query, [id]);
    return users[0];
  };

  updateById = async (
    id,
    {
      name,
      email,
      phone,
      briefBio,
      linkedin,
      facebook,
      contactDetails,
      twoFactorAuthentication,
      emailVerified = null,
      phoneVerified = null,
      active = null,
      suspicious = null,
      role = null,
      photo = null,
    }
  ) => {
    let query = `UPDATE users SET 
      name = \${name},
      email = \${email},
      phone = \${phone},
      contact_details=\${contactDetails},
      brief_bio=\${briefBio},
      linkedin=\${linkedin},
      facebook=\${facebook},
      two_factor_authentication=\${twoFactorAuthentication}`;

    const props = {
      id,
      name,
      email,
      phone,
      briefBio,
      linkedin,
      facebook,
      contactDetails,
      twoFactorAuthentication,
    };

    if (emailVerified) {
      query += ", email_verified=${emailVerified}";
      props["emailVerified"] = emailVerified;
    }

    if (phoneVerified) {
      query += ", phone_verified=${phoneVerified}";
      props["phoneVerified"] = phoneVerified;
    }

    if (active) {
      query += ", active=${active}";
      props["active"] = active;
    }

    if (suspicious) {
      query += ", suspicious=${suspicious}";
      props["suspicious"] = suspicious;
    }

    if (role) {
      query += ", role=${role}";
      props["role"] = role;
    }

    if (photo) {
      query += ", photo=${photo}";
      props["photo"] = photo;
    }

    query += "WHERE id = ${id}";

    await this.db.none(query, props);
  };
}

module.exports = User;

require("dotenv").config();
const bcrypt = require("bcrypt");
const STATIC = require("../static");
const db = require("../database");
const { generateRandomString } = require("../utils");

class User {
  visibleFields = [
    "id",
    "name",
    "email",
    "email_verified",
    "role",
    "contact_details",
    "brief_bio",
    "photo",
    "phone",
    "phone_verified",
    "linkedin",
    "facebook",
    "active",
    "suspicious",
  ];

  userFilter(filter) {
    filter = `%${filter}%`;
    const searchableFields = ["name", "email", "phone"];

    const conditions = searchableFields
      .map((field) => `${field} ILIKE ?`)
      .join(" OR ");

    const props = searchableFields.map((field) => filter);
    return [conditions, props];
  }

  getByEmail = async (email) => {
    return await db("users").select("*").where("email", email).first();
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

    const { id } = await db("users")
      .insert({
        role: userToSave.role,
        name: userToSave.name,
        email: userToSave.email,
        password: userToSave.password,
        accepted_term_condition: userToSave.acceptedTermCondition,
      })
      .returning("id");

    return id;
  };

  findByEmailAndPassword = async (email, password) => {
    const getByEmail = await this.getByEmail(email);

    if (!getByEmail) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, getByEmail.password);

    if (!isPasswordValid) {
      return null;
    }

    return getByEmail;
  };

  getById = async (id) => {
    return await db("users").select(this.visibleFields).where("id", id).first();
  };

  checkRole = async (id, role) => {
    return await db("users").select("email").where({ id, role }).first();
  };

  checkIsAdmin = (id) => {
    return this.checkRole(id, STATIC.ROLES.ADMIN);
  };

  setRole = async (id, role) => {
    await db("users").where({ id }).update({ role });
  };

  changeActive = async (id) => {
    const { active } = await db("users")
      .where({ id })
      .update({ active: db.raw("NOT active") })
      .returning("active");

    return active;
  };

  generateEmailVerifyToken = async (id) => {
    const token = generateRandomString();
    await db("email_verified_tokens").insert({ user_id: id, token });
    return token;
  };

  getUserIdByEmailVerifiedToken = async (token) => {
    const { user_id } = await db("email_verified_tokens")
      .select("user_id")
      .where({ token })
      .first();

    return user_id;
  };

  setEmailVerified = async (id) => {
    await db("users").where({ id }).update({ email_verified: true });
  };

  removeEmailVerifiedToken = async (userId) => {
    await db("users").where({ id: userId }).del();
  };

  generateResetPasswordToken = async (id) => {
    const { token: foundToken } = await db("reset_password_tokens")
      .select("token")
      .where({ user_id: id })
      .first();

    if (foundToken) {
      return foundToken;
    }

    const token = generateRandomString();
    await db("reset_password_tokens").insert({ user_id: id, token });
    return token;
  };

  getUserIdByResetPasswordToken = async (token) => {
    const { user_id } = await db("reset_password_tokens")
      .select("user_id")
      .where({ token })
      .first();

    return user_id;
  };

  setNewPassword = async (id, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db("users").where({ id }).update({ password: hashedPassword });
  };

  removeResetPasswordToken = async (userId) => {
    await db("reset_password_tokens").where({ user_id: userId }).del();
  };

  totalCount = async (filter) => {
    const { count } = await db("users")
      .whereRaw(...this.userFilter(filter))
      .count("* as count")
      .first();

    return count;
  };

  list = async ({ filter, order, orderType, start, count }) => {
    const canBeOrderField = ["id", "email", "name", "phone"];

    if (!order) order = "id";
    if (!orderType) orderType = "asc";

    orderType = orderType.toLowerCase() === "desc" ? "desc" : "asc";
    order = canBeOrderField.includes(order.toLowerCase()) ? order : "id";

    return await db("users")
      .select(this.visibleFields)
      .whereRaw(...this.userFilter(filter))
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  delete = async (id) => {
    await db("users").where({ id }).del();
  };

  getById = async (id) => {
    return await db("users")
      .select([...this.visibleFields, "two_factor_authentication"])
      .where({ id })
      .first();
  };

  updateById = async (id, userData) => {
    const {
      name,
      email,
      phone,
      briefBio,
      linkedin,
      facebook,
      contactDetails,
      twoFactorAuthentication,
      emailVerified,
      phoneVerified,
      active,
      suspicious,
      role,
      photo,
    } = userData;

    const updateData = {
      name,
      email,
      phone,
      contact_details: contactDetails,
      brief_bio: briefBio,
      linkedin,
      facebook,
      two_factor_authentication: twoFactorAuthentication,
    };

    if (emailVerified !== null) {
      updateData.email_verified = emailVerified;
    }

    if (phoneVerified !== null) {
      updateData.phone_verified = phoneVerified;
    }

    if (active !== null) {
      updateData.active = active;
    }

    if (suspicious !== null) {
      updateData.suspicious = suspicious;
    }

    if (role !== null) {
      updateData.role = role;
    }

    if (photo !== null) {
      updateData.photo = photo;
    }

    await db("users").where("id", id).update(updateData);
  };
}

module.exports = User;

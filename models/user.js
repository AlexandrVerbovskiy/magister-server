require("dotenv").config();
const bcrypt = require("bcrypt");
const STATIC = require("../static");
const db = require("../database");
const { generateRandomString, generateOtp } = require("../utils");

const USERS_TABLE = STATIC.TABLES.USERS;
const PHONE_VERIFIED_CODES_TABLE = STATIC.TABLES.PHONE_VERIFIED_CODES;
const TWO_FACTOR_AUTH_CODES_TABLE = STATIC.TABLES.TWO_FACTOR_AUTH_CODES
const RESET_PASSWORD_TOKENS_TABLE = STATIC.TABLES.RESET_PASSWORD_TOKENS;
const EMAIL_VERIFIED_TOKENS_TABLE = STATIC.TABLES.EMAIL_VERIFIED_TOKENS;

class User {
  visibleFields = [
    "id",
    "name",
    "email",
    "email_verified as emailVerified",
    "role",
    "contact_details as contactDetails",
    "brief_bio as briefBio",
    "photo",
    "phone",
    "phone_verified as phoneVerified",
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

  async getByEmail(email) {
    return await db(USERS_TABLE)
      .select([
        ...this.visibleFields,
        "password",
        "two_factor_authentication as twoFactorAuthentication",
      ])
      .where("email", email)
      .first();
  }

  async create({ name, email, password, acceptedTermCondition, role = null }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userToSave = {
      role: role ?? STATIC.ROLES.USER,
      name,
      email,
      acceptedTermCondition,
      password: hashedPassword,
    };

    const { id } = await db(USERS_TABLE)
      .insert({
        role: userToSave.role,
        name: userToSave.name,
        email: userToSave.email,
        password: userToSave.password,
        accepted_term_condition: userToSave.acceptedTermCondition,
      })
      .returning("id");

    return id;
  }

  async findByEmailAndPassword(email, password) {
    const getByEmail = await this.getByEmail(email);

    if (!getByEmail) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, getByEmail.password);

    if (!isPasswordValid) {
      return null;
    }

    return getByEmail;
  }

  async getById(id) {
    return await db(USERS_TABLE)
      .select(this.visibleFields)
      .where("id", id)
      .first();
  }

  async checkRole(id, role) {
    return await db(USERS_TABLE).select("email").where({ id, role }).first();
  }

  checkIsAdmin(id) {
    return this.checkRole(id, STATIC.ROLES.ADMIN);
  }

  async setRole(id, role) {
    await db(USERS_TABLE).where({ id }).update({ role });
  }

  async changeActive(id) {
    const { active } = await db(USERS_TABLE)
      .where({ id })
      .update({ active: db.raw("NOT active") })
      .returning("active");

    return active;
  }

  async generateEmailVerifyToken(id) {
    const token = generateRandomString();
    await db(EMAIL_VERIFIED_TOKENS_TABLE).insert({ user_id: id, token });
    return token;
  }

  async getUserIdByEmailVerifiedToken(token) {
    const { user_id } = await db(EMAIL_VERIFIED_TOKENS_TABLE)
      .select("user_id")
      .where({ token })
      .first();

    return user_id;
  }

  async setEmailVerified(id) {
    await db(USERS_TABLE).where({ id }).update({ email_verified: true });
  }

  async removeEmailVerifiedToken(userId) {
    await db(USERS_TABLE).where({ id: userId }).del();
  }

  async generateResetPasswordToken(id) {
    const { token: foundToken } = await db(RESET_PASSWORD_TOKENS_TABLE)
      .select("token")
      .where({ user_id: id })
      .first();

    if (foundToken) {
      return foundToken;
    }

    const token = generateRandomString();
    await db(RESET_PASSWORD_TOKENS_TABLE).insert({ user_id: id, token });
    return token;
  }

  async getUserIdByResetPasswordToken(token) {
    const { user_id } = await db(RESET_PASSWORD_TOKENS_TABLE)
      .select("user_id")
      .where({ token })
      .first();

    return user_id;
  }

  async setNewPassword(id, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db(USERS_TABLE).where({ id }).update({ password: hashedPassword });
  }

  async removeResetPasswordToken(userId) {
    await db(RESET_PASSWORD_TOKENS_TABLE).where({ user_id: userId }).del();
  }

  async totalCount(filter) {
    const { count } = await db(USERS_TABLE)
      .whereRaw(...this.userFilter(filter))
      .count("* as count")
      .first();

    return count;
  }

  async list({ filter, order, orderType, start, count }) {
    const canBeOrderField = ["id", "email", "name", "phone"];

    if (!order) order = "id";
    if (!orderType) orderType = "asc";

    orderType = orderType.toLowerCase() === "desc" ? "desc" : "asc";
    order = canBeOrderField.includes(order.toLowerCase()) ? order : "id";

    return await db(USERS_TABLE)
      .select(this.visibleFields)
      .whereRaw(...this.userFilter(filter))
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  }

  async delete(id) {
    await db(USERS_TABLE).where({ id }).del();
  }

  async getById(id) {
    return await db(USERS_TABLE)
      .select([
        ...this.visibleFields,
        "two_factor_authentication as twoFactorAuthentication",
      ])
      .where({ id })
      .first();
  }

  async updateById(id, userData) {
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

    await db(USERS_TABLE).where("id", id).update(updateData);
  }

  async generatePhoneVerifyCode(userId) {
    const user = await this.getById(userId);
    if (!user) return null;
    if (!user.phone) return { phone: null, code: null };

    const code = generateOtp();
    await db(PHONE_VERIFIED_CODES_TABLE).insert({ user_id: userId, code });
    return { code: null, phone: user.phone };
  }

  async getUserIdByPhoneVerifyCode(code) {
    const { user_id } = await db(PHONE_VERIFIED_CODES_TABLE)
      .select("user_id")
      .where({ code })
      .first();

    return user_id;
  }

  async setPhoneVerified(id) {
    await db(USERS_TABLE).where({ id }).update({ phone_verified: true });
  }

  async generateTwoAuthCode(userId, type) {
    const user = await this.getById(userId);
    if (!user) return null;

    const dataToSave = { user_id: userId };

    if (type == "phone") {
      if (!user.phone) return { phone: null, code: null };
      dataToSave["code"] = generateOtp();
      dataToSave["type_verification"] = "phone";
      dataToSave["phone"] = user.phone;
    } else {
      dataToSave["code"] = generateRandomString();
      dataToSave["type_verification"] = "email";
      dataToSave["email"] = user.email;
    }

    await db(TWO_FACTOR_AUTH_CODES_TABLE).insert(dataToSave);
    return { phone: user.phone, code: dataToSave["code"] };
  }

  async getUserIdByTwoAuthCode(code, type) {
    const { user_id } = await db(TWO_FACTOR_AUTH_CODES_TABLE)
      .select("user_id")
      .where({ code, type })
      .first();

    return user_id;
  }
}

module.exports = new User();

require("dotenv").config();
const bcrypt = require("bcrypt");
const STATIC = require("../static");
const db = require("../database");
const { generateRandomString, generateOtp } = require("../utils");

const USERS_TABLE = STATIC.TABLES.USERS;
const PHONE_VERIFIED_CODES_TABLE = STATIC.TABLES.PHONE_VERIFIED_CODES;
const TWO_FACTOR_AUTH_CODES_TABLE = STATIC.TABLES.TWO_FACTOR_AUTH_CODES;
const RESET_PASSWORD_TOKENS_TABLE = STATIC.TABLES.RESET_PASSWORD_TOKENS;
const EMAIL_VERIFIED_TOKENS_TABLE = STATIC.TABLES.EMAIL_VERIFIED_TOKENS;
const USER_DOCUMENTS_TABLE = STATIC.TABLES.USER_DOCUMENTS;

class UserModel {
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
    "suspicious",
    "place_work as placeWork",
    "facebook_url as facebookUrl",
    "instagram_url as instagramUrl",
    "linkedin_url as linkedinUrl",
    "twitter_url as twitterUrl",
  ];

  allFields = [
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
    "active",
    "verified",
    "suspicious",
    "password",
    "place_work as placeWork",
    "need_set_password as needSetPassword",
    "need_regular_view_info_form as needRegularViewInfoForm",
    "two_factor_authentication as twoFactorAuthentication",
    "facebook_url as facebookUrl",
    "instagram_url as instagramUrl",
    "linkedin_url as linkedinUrl",
    "twitter_url as twitterUrl",
  ];

  documentFields = [
    "user_id as userId",
    "proof_of_address_link as proofOfAddressLink",
    "reputable_bank_id_link as reputableBankIdLink",
    "utility_link as utilityLink",
    "hmrc_link as hmrcLink",
    "council_tax_bill_link as councilTaxBillLink",
    "passport_or_driving_id_link as passportOrDrivingIdLink",
    "confirm_money_laundering_checks_and_compliance_link as confirmMoneyLaunderingChecksAndComplianceLink",
  ];

  userFilter = (filter) => {
    filter = `%${filter}%`;
    const searchableFields = ["name", "email", "phone"];

    const conditions = searchableFields
      .map((field) => `${field} ILIKE ?`)
      .join(" OR ");

    const props = searchableFields.map((field) => filter);
    return [conditions, props];
  };

  getByEmail = async (email) => {
    return await db(USERS_TABLE)
      .select(this.visibleFields)
      .where("email", email)
      .first();
  };

  getFullByEmail = async (email) => {
    return await db(USERS_TABLE)
      .select(this.allFields)
      .where("email", email)
      .first();
  };

  create = async ({
    name,
    email,
    password,
    acceptedTermCondition,
    role = null,
    emailVerified = false,
    needSetPassword = false,
  }) => {
    let hashedPassword = null;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const userToSave = {
      role: role ?? STATIC.ROLES.USER,
      name,
      email,
      acceptedTermCondition,
      password: hashedPassword,
      emailVerified,
      needSetPassword,
    };

    const res = await db(USERS_TABLE)
      .insert({
        role: userToSave.role,
        name: userToSave.name,
        email: userToSave.email,
        password: userToSave.password,
        accepted_term_condition: userToSave.acceptedTermCondition,
        email_verified: emailVerified,
        need_set_password: needSetPassword,
      })
      .returning("id");

    return res[0].id;
  };

  findByEmailAndPassword = async (email, password) => {
    const getByEmail = await this.getFullByEmail(email);

    if (!getByEmail || !getByEmail.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, getByEmail.password);

    if (!isPasswordValid) {
      return null;
    }

    return getByEmail;
  };

  getById = async (id) => {
    return await db(USERS_TABLE)
      .select(this.visibleFields)
      .where("id", id)
      .first();
  };

  getFullById = async (id) => {
    return await db(USERS_TABLE).select(this.allFields).where("id", id).first();
  };

  checkRole = async (id, role) => {
    return await db(USERS_TABLE).select("email").where({ id, role }).first();
  };

  checkIsAdmin = async (id) => {
    return await this.checkRole(id, STATIC.ROLES.ADMIN);
  };

  checkIsSupport = async (id) => {
    const isSupport = await this.checkRole(id, STATIC.ROLES.SUPPORT);
    if (isSupport) return true;

    const isAdmin = await this.checkIsAdmin(id);
    return isAdmin;
  };

  setRole = async (id, role) => {
    await db(USERS_TABLE).where({ id }).update({ role });
  };

  changeActive = async (id) => {
    const res = await db(USERS_TABLE)
      .where({ id })
      .update({ active: db.raw("NOT active") })
      .returning("active");

    return res[0].active;
  };

  changeVerified = async (id) => {
    const res = await db(USERS_TABLE)
      .where({ id })
      .update({ verified: db.raw("NOT verified") })
      .returning("verified");

    return res[0].verified;
  };

  generateEmailVerifyToken = async (id) => {
    const token = generateRandomString();
    await db(EMAIL_VERIFIED_TOKENS_TABLE).insert({ user_id: id, token });
    return token;
  };

  getUserIdByEmailVerifiedToken = async (token) => {
    const res = await db(EMAIL_VERIFIED_TOKENS_TABLE)
      .select("user_id")
      .where({ token })
      .first();

    return res?.user_id;
  };

  setEmailVerified = async (id) => {
    await db(USERS_TABLE).where({ id }).update({ email_verified: true });
  };

  removeEmailVerifiedToken = async (userId) => {
    await db(EMAIL_VERIFIED_TOKENS_TABLE).where({ user_id: userId }).del();
  };

  generateResetPasswordToken = async (id) => {
    const res = await db(RESET_PASSWORD_TOKENS_TABLE)
      .select("token")
      .where({ user_id: id })
      .first();

    if (res) {
      return res.token;
    }

    const token = generateRandomString();
    await db(RESET_PASSWORD_TOKENS_TABLE).insert({ user_id: id, token });
    return token;
  };

  getUserIdByResetPasswordToken = async (token) => {
    const res = await db(RESET_PASSWORD_TOKENS_TABLE)
      .select("user_id")
      .where({ token })
      .first();

    return res?.user_id;
  };

  setNewPassword = async (id, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db(USERS_TABLE)
      .where({ id })
      .update({ password: hashedPassword, need_set_password: false });
  };

  removeResetPasswordToken = async (userId) => {
    await db(RESET_PASSWORD_TOKENS_TABLE).where({ user_id: userId }).del();
  };

  totalCount = async (filter) => {
    const { count } = await db(USERS_TABLE)
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

    return await db(USERS_TABLE)
      .select([...this.visibleFields, "active", "verified"])
      .whereRaw(...this.userFilter(filter))
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  delete = async (id) => {
    await db(USERS_TABLE).where({ id }).del();
  };

  updateById = async (id, userData) => {
    const {
      name,
      email,
      phone,
      briefBio,
      contactDetails,
      twoFactorAuthentication,
      emailVerified,
      phoneVerified,
      active,
      suspicious,
      role,
      photo,
      placeWork,
      facebookUrl,
      instagramUrl,
      linkedinUrl,
      twitterUrl,
      verified,
    } = userData;

    const updateData = {
      name,
      email,
      phone,
      contact_details: contactDetails,
      brief_bio: briefBio,
      two_factor_authentication: twoFactorAuthentication,
      place_work: placeWork,
      facebook_url: facebookUrl,
      instagram_url: instagramUrl,
      linkedin_url: linkedinUrl,
      twitter_url: twitterUrl,
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

    if (verified !== null) {
      updateData.verified = verified;
    }

    await db(USERS_TABLE).where("id", id).update(updateData);
  };

  generatePhoneVerifyCode = async (userId) => {
    const user = await this.getById(userId);
    if (!user) return null;
    if (!user.phone) return { phone: null, code: null };

    const code = generateOtp();
    await db(PHONE_VERIFIED_CODES_TABLE).insert({ user_id: userId, code });
    return { code, phone: user.phone };
  };

  getUserIdByPhoneVerifyCode = async (code) => {
    const res = await db(PHONE_VERIFIED_CODES_TABLE)
      .select("user_id")
      .where({ code })
      .first();

    return res?.user_id;
  };

  setPhoneVerified = async (id) => {
    await db(USERS_TABLE).where({ id }).update({ phone_verified: true });
  };

  generateTwoAuthCode = async (userId, type) => {
    const dataToSave = { user_id: userId };

    if (type == "phone") {
      dataToSave["code"] = generateOtp();
      dataToSave["type_verification"] = "phone";
    } else {
      dataToSave["code"] = generateRandomString();
      dataToSave["type_verification"] = "email";
    }

    await db(TWO_FACTOR_AUTH_CODES_TABLE).insert(dataToSave);
    return dataToSave;
  };

  getUserIdByTwoAuthCode = async (code, type) => {
    const res = await db(TWO_FACTOR_AUTH_CODES_TABLE)
      .select("user_id")
      .where({ code, type_verification: type })
      .first();

    return res?.user_id;
  };

  removeTwoAuthCode = async (code, type, userId) => {
    await db(TWO_FACTOR_AUTH_CODES_TABLE)
      .select("user_id")
      .where({ code, type_verification: type, user_id: userId })
      .delete();
  };

  getDocumentsByUserId = async (id) => {
    const documents = await db(USER_DOCUMENTS_TABLE)
      .select(this.documentFields)
      .where({ user_id: id })
      .first();
    return documents ?? {};
  };

  checkUserPasswordEmpty = async (id) => {
    const { password } = await db(USERS_TABLE)
      .select("password")
      .where({ id })
      .first();

    return !!password;
  };

  checkUserPasswordEqual = async (id, checkedPassword) => {
    const { password } = await db(USERS_TABLE)
      .select("password")
      .where({ id })
      .first();

    return await bcrypt.compare(checkedPassword, password);
  };

  convertDocumentLinksToSql = (links) => {
    const res = {};

    if (links["proofOfAddressLink"]) {
      res["proof_of_address_link"] = links["proofOfAddressLink"];
    }

    if (links["newReputableBankIdLink"]) {
      res["reputable_bank_id_link"] = links["newReputableBankIdLink"];
    }

    if (links["utilityLink"]) {
      res["utility_link"] = links["utilityLink"];
    }

    if (links["hmrcLink"]) {
      res["hmrc_link"] = links["hmrcLink"];
    }

    if (links["councilTaxBillLink"]) {
      res["council_tax_bill_link"] = links["councilTaxBillLink"];
    }

    if (links["passportOrDrivingIdLink"]) {
      res["passport_or_driving_id_link"] = links["passportOrDrivingIdLink"];
    }

    if (links["confirmMoneyLaunderingChecksAndComplianceLink"]) {
      res["confirm_money_laundering_checks_and_compliance_link"] =
        links["confirmMoneyLaunderingChecksAndComplianceLink"];
    }

    return res;
  };

  createUserDocuments = async (userId, documents) => {
    await db(USER_DOCUMENTS_TABLE).insert({
      user_id: userId,
      ...this.convertDocumentLinksToSql(documents),
    });
  };

  updateUserDocuments = async (userId, documents) => {
    await db(USER_DOCUMENTS_TABLE)
      .where({ user_id: userId })
      .update({ ...this.convertDocumentLinksToSql(documents) });
  };
}

module.exports = new UserModel();

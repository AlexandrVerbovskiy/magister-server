require("dotenv").config();
const bcrypt = require("bcrypt");
const STATIC = require("../static");
const db = require("../database");
const {
  generateOtp,
  getOneHourAgo,
  formatDateToSQLFormat,
} = require("../utils");
const Model = require("./Model");

const USERS_TABLE = STATIC.TABLES.USERS;
const PHONE_VERIFIED_CODES_TABLE = STATIC.TABLES.PHONE_VERIFIED_CODES;
const TWO_FACTOR_AUTH_CODES_TABLE = STATIC.TABLES.TWO_FACTOR_AUTH_CODES;
const USER_DOCUMENTS_TABLE = STATIC.TABLES.USER_DOCUMENTS;
const USER_VERIFY_REQUESTS_TABLE = STATIC.TABLES.USER_VERIFY_REQUESTS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const SENDER_PAYMENTS_TABLE = STATIC.TABLES.SENDER_PAYMENTS;

class UserModel extends Model {
  visibleFields = [
    `${USERS_TABLE}.id`,
    `${USERS_TABLE}.name`,
    `${USERS_TABLE}.email`,
    `${USERS_TABLE}.role`,
    `${USERS_TABLE}.contact_details as contactDetails`,
    `${USERS_TABLE}.brief_bio as briefBio`,
    `${USERS_TABLE}.photo`,
    `${USERS_TABLE}.online`,
    `${USERS_TABLE}.phone`,
    `${USERS_TABLE}.suspicious`,
    `${USERS_TABLE}.place_work as placeWork`,
    `${USERS_TABLE}.facebook_url as facebookUrl`,
    `${USERS_TABLE}.instagram_url as instagramUrl`,
    `${USERS_TABLE}.linkedin_url as linkedinUrl`,
    `${USERS_TABLE}.twitter_url as twitterUrl`,
    `${USERS_TABLE}.paypal_id as paypalId`,
  ];

  allFields = [
    ...this.visibleFields,
    "email_verified as emailVerified",
    "phone_verified as phoneVerified",
    "active",
    "verified",
    "password",
    "has_password_access as hasPasswordAccess",
    "need_regular_view_info_form as needRegularViewInfoForm",
    "two_factor_authentication as twoFactorAuthentication",
  ];

  documentFields = [
    `${USER_DOCUMENTS_TABLE}.user_id as userId`,
    "user_photo as userPhoto",
    "document_front as documentFront",
    "document_back as documentBack",
  ];

  strFilterFields = ["name", "email", "phone"];

  orderFields = ["id", "email", "name", "phone"];

  getByEmail = async (email) => {
    return await db(USERS_TABLE)
      .select([
        ...this.visibleFields,
        "email_verified as emailVerified",
        "phone_verified as phoneVerified",
        "need_regular_view_info_form as needRegularViewInfoForm",
        "has_password_access as hasPasswordAccess",
        "active",
      ])
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
    hasPasswordAccess = true,
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
      hasPasswordAccess,
    };

    const res = await db(USERS_TABLE)
      .insert({
        role: userToSave.role,
        name: userToSave.name,
        email: userToSave.email,
        password: userToSave.password,
        accepted_term_condition: userToSave.acceptedTermCondition,
        email_verified: emailVerified,
        has_password_access: hasPasswordAccess,
      })
      .returning("id");

    return res[0].id;
  };

  convertFullUserDataToSave = (userData) => {
    const {
      email,
      name,
      phone = null,
      briefBio = null,
      contactDetails = null,
      twoFactorAuthentication = null,
      emailVerified,
      phoneVerified,
      active,
      suspicious,
      role,
      photo,
      placeWork = null,
      facebookUrl = null,
      instagramUrl = null,
      linkedinUrl = null,
      twitterUrl = null,
      verified,
      acceptedTermCondition,
      needRegularViewInfoForm,
      paypalId = null,
    } = userData;

    const updateData = {
      name,
      phone,
      contact_details: contactDetails,
      brief_bio: briefBio,
      place_work: placeWork,
      facebook_url: facebookUrl,
      instagram_url: instagramUrl,
      linkedin_url: linkedinUrl,
      twitter_url: twitterUrl,
    };

    if (twoFactorAuthentication !== null) {
      updateData["two_factor_authentication"] = twoFactorAuthentication;
    }

    if (email !== null) {
      updateData.email = email;
    }

    if (emailVerified !== null) {
      updateData.email_verified = emailVerified;
    }

    if (acceptedTermCondition !== null) {
      updateData.accepted_term_condition = acceptedTermCondition;
    }

    if (needRegularViewInfoForm !== null) {
      updateData.need_regular_view_info_form = needRegularViewInfoForm;
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

    if (paypalId !== null) {
      updateData.paypal_id = paypalId;
    }

    return updateData;
  };

  createFull = async (userData) => {
    userData["twoFactorAuthentication"] = true;
    const dataToSave = this.convertFullUserDataToSave(userData);
    const res = await db(USERS_TABLE).insert(dataToSave).returning("id");
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

  checkUserPasswordEqual = async (userId, newPassword) => {
    const user = await this.getFullById(userId);

    if (!user.password) {
      return false;
    }

    return await bcrypt.compare(newPassword, user.password);
  };

  getById = (id) => this.baseGetById(id, USERS_TABLE);

  getByIdWithEmailVerified = async (id) => {
    return await db(USERS_TABLE)
      .select([...this.allFields, "email_verified as emailVerified"])
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

  checkIsVerified = async (id) => {
    return await db(USERS_TABLE)
      .select("email")
      .where({ id, verified: true })
      .first();
  };

  checkVerifiedAndHasPaypal = async (id) => {
    const userInfo = await db(USERS_TABLE)
      .select("paypal_id as paypalId")
      .where({ id, verified: true })
      .first();

    const paypalId = userInfo?.paypalId;
    return paypalId && paypalId.length > 0;
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

  setPaypalId = async (id, paypalId) => {
    await db(USERS_TABLE).where({ id }).update({ paypal_id: paypalId });
  };

  changeActive = async (id) => {
    const res = await db(USERS_TABLE)
      .where({ id })
      .update({ active: db.raw("NOT active") })
      .returning("active");

    return res[0].active;
  };

  setVerified = async (id, verified) => {
    await db(USERS_TABLE).where({ id }).update({ verified });
  };

  changeTwoFactorAuth = async (id) => {
    const res = await db(USERS_TABLE)
      .where({ id })
      .update({
        two_factor_authentication: db.raw("NOT two_factor_authentication"),
      })
      .returning("two_factor_authentication as twoFactorAuthentication");

    return res[0].twoFactorAuthentication;
  };

  changeVerified = async (id) => {
    const res = await db(USERS_TABLE)
      .where({ id })
      .update({ verified: db.raw("NOT verified") })
      .returning("verified");

    return res[0].verified;
  };

  noNeedRegularViewInfoForm = async (id) => {
    await db(USERS_TABLE)
      .where({ id })
      .update({ need_regular_view_info_form: false });
  };

  setEmailVerified = async (id) => {
    await db(USERS_TABLE).where({ id }).update({ email_verified: true });
  };

  setNewPassword = async (id, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db(USERS_TABLE)
      .where({ id })
      .update({ password: hashedPassword, has_password_access: true });
  };

  queryByRole = (query, role) => {
    if (role == "admin") {
      query = query.where(`${USERS_TABLE}.role`, STATIC.ROLES.ADMIN);
    }

    if (role == "support") {
      query = query.where(`${USERS_TABLE}.role`, STATIC.ROLES.SUPPORT);
    }

    if (role == "user") {
      query = query.where(`${USERS_TABLE}.role`, STATIC.ROLES.USER);
    }

    return query;
  };

  queryByActive = (query, active) => {
    if (active == "active") {
      query = query.where(`${USERS_TABLE}.active`, true);
    }

    if (active == "inactive") {
      query = query.where(`${USERS_TABLE}.active`, false);
    }

    return query;
  };

  queryByVerified = (query, verified) => {
    if (verified == "verified") {
      query = query.where(`${USERS_TABLE}.verified`, true);
    }

    if (verified == "unverified") {
      query = query.where(`${USERS_TABLE}.verified`, false);
    }

    return query;
  };

  totalCount = async (
    filter,
    timeInfos,
    { active = null, role = null, verified = null }
  ) => {
    let query = db(USERS_TABLE).whereRaw(...this.baseStrFilter(filter));
    query = this.baseListTimeFilter(timeInfos, query);

    query = this.queryByActive(query, active);
    query = this.queryByVerified(query, verified);
    query = this.queryByRole(query, role);

    const result = await query.count("* as count").first();
    return +result?.count;
  };

  list = async (props) => {
    const {
      filter,
      start,
      count,
      active = null,
      role = null,
      verified = null,
    } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = db(USERS_TABLE).whereRaw(...this.baseStrFilter(filter));

    query = this.baseListTimeFilter(
      props.timeInfos,
      query,
      `${USERS_TABLE}.created_at`
    );

    query = this.queryByActive(query, active);
    query = this.queryByVerified(query, verified);
    query = this.queryByRole(query, role);

    return await query
      .joinRaw(
        `LEFT JOIN ${SENDER_PAYMENTS_TABLE} ON
       (${SENDER_PAYMENTS_TABLE}.user_id = ${USERS_TABLE}.id AND ${SENDER_PAYMENTS_TABLE}.hidden = false)`
      )
      .leftJoin(ORDERS_TABLE, `${ORDERS_TABLE}.tenant_id`, `${USERS_TABLE}.id`)
      .joinRaw(
        `LEFT JOIN ${USER_VERIFY_REQUESTS_TABLE} ON (${USER_VERIFY_REQUESTS_TABLE}.user_id = ${USERS_TABLE}.id AND (${USER_VERIFY_REQUESTS_TABLE}.has_response = false))`
      )
      .select([
        ...this.visibleFields,
        `${USERS_TABLE}.active`,
        `${USERS_TABLE}.verified`,
        `${USERS_TABLE}.email_verified as emailVerified`,
        `${USERS_TABLE}.phone_verified as phoneVerified`,
        `${USERS_TABLE}.created_at as createdAt`,
        `${USER_VERIFY_REQUESTS_TABLE}.id as verifyRequestId`,
        `${USER_VERIFY_REQUESTS_TABLE}.has_response as verifyRequestHasResponse`,
        db.raw(`COUNT(${SENDER_PAYMENTS_TABLE}.id) as "totalRents"`),
        db.raw(`SUM(${SENDER_PAYMENTS_TABLE}.money) as "totalSpent"`),
        db.raw(`MAX(${ORDERS_TABLE}.start_date) as "lastRenterDate"`),
      ])
      .groupBy([`${USERS_TABLE}.id`, `${USER_VERIFY_REQUESTS_TABLE}.id`])
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  delete = async (id) => {
    await db(USER_DOCUMENTS_TABLE).where("user_id", id).del();
    await db(USER_VERIFY_REQUESTS_TABLE).where("user_id", id).del();
    await db(USERS_TABLE).where({ id }).del();
  };

  updateById = async (id, userData) => {
    const dataToSave = this.convertFullUserDataToSave(userData);
    await db(USERS_TABLE).where("id", id).update(dataToSave);
  };

  generatePhoneVerifyCode = async (userId) => {
    const user = await this.getById(userId);
    if (!user) return null;
    if (!user.phone) return { phone: null, code: null };

    const code = generateOtp();

    const userToken = await db(PHONE_VERIFIED_CODES_TABLE)
      .where({ user_id: userId })
      .first();

    if (userToken) {
      await db(PHONE_VERIFIED_CODES_TABLE)
        .where({ user_id: userId })
        .update({ code, updated_at: db.fn.now() });
    } else {
      await db(PHONE_VERIFIED_CODES_TABLE).insert({ user_id: userId, code });
    }

    return { code, phone: user.phone };
  };

  getUserIdByPhoneVerifyCode = async (code) => {
    const res = await db(PHONE_VERIFIED_CODES_TABLE)
      .select("user_id")
      .where({ code })
      .where("updated_at", ">", db.raw("?", [getOneHourAgo()]))
      .first();

    return res?.user_id;
  };

  setPhoneVerified = async (id) => {
    await db(USERS_TABLE).where({ id }).update({ phone_verified: true });
  };

  generateTwoAuthCode = async (userId, type) => {
    const dataToSave = { user_id: userId };

    dataToSave["code"] = generateOtp();

    if (type == "phone") {
      dataToSave["type_verification"] = "phone";
    } else {
      dataToSave["type_verification"] = "email";
    }

    const userToken = await db(TWO_FACTOR_AUTH_CODES_TABLE)
      .where({ user_id: userId })
      .first();

    if (userToken) {
      await db(TWO_FACTOR_AUTH_CODES_TABLE)
        .where({ user_id: userId })
        .update({ ...dataToSave, updated_at: db.fn.now() });
    } else {
      await db(TWO_FACTOR_AUTH_CODES_TABLE).insert(dataToSave);
    }

    return dataToSave;
  };

  getUserIdByTwoAuthCode = async (code, type) => {
    const res = await db(TWO_FACTOR_AUTH_CODES_TABLE)
      .select("user_id")
      .where({ code, type_verification: type })
      .where("updated_at", ">", db.raw("?", [getOneHourAgo()]))
      .first();

    return res?.user_id;
  };

  removeTwoAuthCode = async (code, type, userId) => {
    await db(TWO_FACTOR_AUTH_CODES_TABLE)
      .select("user_id")
      .where({ code, type_verification: type, user_id: userId })
      .delete();
  };

  getDocumentsByUserIds = async (ids) => {
    const documentsByUserId = {};

    ids.forEach(
      (id) =>
        (documentsByUserId[id] = {
          userPhoto: null,
          documentFront: null,
          documentBack: null,
        })
    );

    const documents = await db(USER_DOCUMENTS_TABLE)
      .select(this.documentFields)
      .whereIn("user_id", ids);

    documents.forEach((document) => {
      const cloned = { ...document };
      delete cloned["userId"];
      documentsByUserId[document.userId] = cloned;
    });

    return documentsByUserId;
  };

  getDocumentsByUserId = async (id) => {
    const documents = await this.getDocumentsByUserIds([id]);
    return documents[id];
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

    if (!password) {
      return false;
    }

    return await bcrypt.compare(checkedPassword, password);
  };

  convertDocumentLinksToSql = (links) => {
    const res = {};

    if (links["userPhoto"]) {
      res["user_photo"] = links["userPhoto"];
    }

    if (links["documentFront"]) {
      res["document_front"] = links["documentFront"];
    }

    if (links["documentBack"]) {
      res["document_back"] = links["documentBack"];
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

  getNameIdList = async (start, count, filter) => {
    const res = await db(USERS_TABLE)
      .select(["id as value", "name as title", "verified as active"])
      .whereILike("name", `%${filter}%`)
      .limit(count)
      .offset(start);
    return res;
  };

  getTotalCountBeforeDate = async (dateStart) => {
    const result = await db(USERS_TABLE)
      .where(`${USERS_TABLE}.created_at`, "<", formatDateToSQLFormat(dateStart))
      .count();

    return +result[0].count;
  };

  getInactiveRegisteredByDuration = async (dateStart, dateEnd) => {
    return await db(USERS_TABLE)
      .where("active", false)
      .where(
        `${USERS_TABLE}.created_at`,
        ">=",
        formatDateToSQLFormat(dateStart)
      )
      .where(`${USERS_TABLE}.created_at`, "<=", formatDateToSQLFormat(dateEnd))
      .select([
        `${USERS_TABLE}.id as orderId`,
        `${USERS_TABLE}.created_at as createdAt`,
      ]);
  };

  getRegisteredByDuration = async (dateStart, dateEnd) => {
    return await db(USERS_TABLE)
      .where(
        `${USERS_TABLE}.created_at`,
        ">=",
        formatDateToSQLFormat(dateStart)
      )
      .where(`${USERS_TABLE}.created_at`, "<=", formatDateToSQLFormat(dateEnd))
      .select([
        `${USERS_TABLE}.id as orderId`,
        `${USERS_TABLE}.created_at as createdAt`,
      ]);
  };

  updateOnline = async (userId, online) => {
    await db(USERS_TABLE).where("id", userId).update({ online });
  };
}

module.exports = new UserModel();

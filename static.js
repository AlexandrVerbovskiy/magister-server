module.exports = {
  SUCCESS: {
    CREATED: {
      KEY: "created",
      STATUS: 201,
      DEFAULT_MESSAGE: "Operation done successfully",
    },
    OK: {
      KEY: "ok",
      STATUS: 200,
      DEFAULT_MESSAGE: "Request done successfully",
    },
  },
  ERRORS: {
    BAD_REQUEST: {
      KEY: "bad_request",
      STATUS: 400,
      DEFAULT_MESSAGE: "Bad request",
    },
    DATA_CONFLICT: {
      KEY: "data_conflict",
      STATUS: 409,
      DEFAULT_MESSAGE: "Data conflict",
    },
    UNAUTHORIZED: {
      KEY: "unauthorized",
      STATUS: 401,
      DEFAULT_MESSAGE: "Authentication failed",
    },
    INVALID_KEY_DATA: {
      KEY: "invalid_key_data",
      STATUS: 401,
      DEFAULT_MESSAGE: "Invalid data",
    },
    FORBIDDEN: {
      KEY: "forbidden",
      STATUS: 403,
      DEFAULT_MESSAGE: "Access denied",
    },
    NOT_FOUND: {
      KEY: "not_found",
      STATUS: 404,
      DEFAULT_MESSAGE: "Object not found",
    },
    UNPREDICTABLE: {
      KEY: "internal_server_error",
      STATUS: 500,
      DEFAULT_MESSAGE: "Internal Server Error",
    },
  },
  RESPONSE_TYPES: {
    JSON: "json",
    DATA: "data",
  },
  ROLES: {
    ADMIN: "admin",
    USER: "user",
    SUPPORT: "support",
  },
  JWT_DEFAULT_ACCESS_LIFETIME: "7d",
  JWT_REMEMBER_ACCESS_LIFETIME: "90d",
  BEARER_COOKIE_LIFETIME: 1000 * 60 * 60 * 24 * 7,
  BEARER_REMEMBER_COOKIE_LIFETIME: 1000 * 60 * 60 * 24 * 90,

  JWT_VERIFY_LIFETIME: "1h",
  CLIENT_LINKS: {
    EMAIL_VERIFICATION: "email-verification",
    PASSWORD_RESET: "password-reset",
    USER_AUTHORIZED: "user-authorized",
  },
  MAIN_DIRECTORY: __dirname,
  TABLES: {
    USERS: "users",
    USER_VERIFY_REQUESTS: "user_verify_requests",
    PHONE_VERIFIED_CODES: "phone_verified_codes",
    TWO_FACTOR_AUTH_CODES: "two_factor_auth_codes",
    SEED_STATUS: "seeds_status",
    LOGS: "logs",
    USER_DOCUMENTS: "user_documents",
    EMAIL_VERIFIED_TOKENS: "email_verified_tokens",
    RESET_PASSWORD_TOKENS: "reset_password_tokens",
    USER_EVENT_LOGS: "user_event_logs",
    SYSTEM: "system",
    LISTINGS: "listings",
    LISTING_CATEGORIES: "listing_categories",
    SEARCHED_WORDS: "searched_words",
    NEW_CATEGORY_USER_NOTIFICATION: "new_category_user_notifications",
    LISTING_IMAGES: "listing_images",
  },
};

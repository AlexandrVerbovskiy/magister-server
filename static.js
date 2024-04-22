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
    LISTING_PAGE: "listing-list",
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
    LISTING_IMAGES: "listing_images",
    LISTING_APPROVAL_REQUESTS: "listing_approval_requests",
    LISTING_CATEGORY_CREATE_NOTIFICATIONS:
      "listing_category_create_notifications",
    ORDERS: "orders",
    ORDER_UPDATE_REQUESTS: "order_update_requests",
  },
  LATITUDE_LONGITUDE_TO_KILOMETERS: 111.045,
  DEGREES_TO_RADIANS: 57.3,
  DEFAULT_LOCATION: { lat: 53.390044, lng: -2.59695 },
  ORDER_STATUSES: {
    PENDING_OWNER: "pending_owner",
    PENDING_TENANT: "pending_tenant",
    PENDING_CLIENT_PAYMENT: "pending_client_payment",
    PENDING_ITEM_TO_CLIENT: "pending_item_to_client",
    PENDING_ITEM_TO_OWNER: "pending_item_to_owner",
    FINISHED: "finished",
    REJECTED: "rejected",
  },
  ORDER_CANCELATION_STATUSES: {
    WAITING_OWNER_APPROVE: "waiting_owner_approve",
    WAITING_TENANT_APPROVE: "waiting_tenant_approve",
    WAITING_ADMIN_APPROVE: "waiting_admin_approve",
    CANCELED: "canceled",
  },
  ORDER_UPDATE_REQUEST_RECIPIENTS: {
    TO_OWNER: "to_owner",
    TO_TENANT: "to_tenant",
  },
  TIME_OPTIONS_TYPE_DEFAULT: {
    BASE: "base",
    TODAY: "today",
    NULL: "null",
  },
};

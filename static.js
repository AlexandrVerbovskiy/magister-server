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
    SIZE_LIMIT: {
      KEY: "size_limit",
      STATUS: 413,
      DEFAULT_MESSAGE: "Out of data size",
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
    PAYMENT_FAILED: {
      KEY: "payment_failed",
      STATUS: 402,
      DEFAULT_MESSAGE: "Payment failed",
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
  CLIENT_LINKS: {
    EMAIL_VERIFICATION: "email-verification",
    PASSWORD_RESET: "password-reset",
    USER_AUTHORIZED: "user-authorized",
    LISTING_PAGE: "listing-list",
  },
  TABLES: {
    USERS: "users",
    USER_VERIFY_REQUESTS: "user_verify_requests",
    PHONE_VERIFIED_CODES: "phone_verified_codes",
    EMAIL_VERIFIED_CODES: "email_verified_codes",
    TWO_FACTOR_AUTH_CODES: "two_factor_auth_codes",
    SEED_STATUS: "seeds_status",
    LOGS: "logs",
    USER_DOCUMENTS: "user_documents",
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
    SENDER_PAYMENTS: "sender_payments",
    RECIPIENT_PAYMENTS: "recipient_payments",
    REFUND_PAYMENT_REQUESTS: "refund_payment_requests",
    WORKER_COMMENTS: "worker_comments",
    OWNER_COMMENTS: "owner_comments",
    USER_LISTING_FAVORITES: "user_listing_favorites",
    DISPUTES: "disputes",
    CHATS: "chats",
    CHAT_RELATIONS: "chat_relations",
    CHAT_MESSAGES: "chat_messages",
    CHAT_MESSAGE_CONTENTS: "chat_messages_contents",
    SOCKETS: "sockets",
    ACTIVE_ACTIONS: "active_actions",
    CHECKLISTS: "checklists",
    CHECKLIST_PHOTOS: "checklist_photos",
  },
  ORDER_STATUSES: {
    PENDING_OWNER: "pending_owner",
    PENDING_WORKER: "pending_worker",
    PENDING_OWNER_PAYMENT: "pending_owner_payment",
    IN_PROCESS: "in_process",
    PENDING_OWNER_FINISHED: "pending_owner_finished",
    FINISHED: "finished",
    REJECTED: "rejected",
  },
  ORDER_CANCELATION_STATUSES: {
    WAITING_OWNER_APPROVE: "waiting_owner_approve",
    WAITING_WORKER_APPROVE: "waiting_worker_approve",
    WAITING_ADMIN_APPROVE: "waiting_admin_approve",
    CANCELLED: "cancelled",
  },
  ORDER_UPDATE_REQUEST_RECIPIENTS: {
    TO_OWNER: "to_owner",
    TO_WORKER: "to_worker",
  },
  TIME_OPTIONS_TYPE_DEFAULT: {
    BASE: "base",
    TODAY: "today",
    NULL: "null",
  },
  RECIPIENT_STATUSES: {
    COMPLETED: "completed",
    FAILED: "failed",
    WAITING: "waiting",
    CANCELLED: "cancelled",
  },
  RECIPIENT_TYPES: {
    REFUND: "refund",
    RECIPIENT: "recipient",
  },
  TIME_FILTER_TYPES: {
    TYPE: "type",
    DURATION: "duration",
  },
  DISPUTE_STATUSES: {
    SOLVED: "solved",
    OPEN: "open",
    UNSOLVED: "unsolved",
  },
  MESSAGE_TYPES: {
    TEXT: "text",
    FILE: "file",
    VIDEO: "video",
    AUDIO: "audio",
    IMAGE: "image",
    NEW_ORDER: "new-order",
    UPDATE_ORDER: "update-order",
    ACCEPTED_ORDER: "accepted-order",
    REJECTED_ORDER: "rejected-order",
    WORKER_PAYED: "worker-payed",
    WORKER_PAYED_WAITING: "worker-payed-waiting",
    FINISHED: "finished",
    CANCELED_ORDER: "canceled-order",
    CREATED_CANCEL_REQUEST: "created-cancel",
    ACCEPTED_CANCEL_REQUEST: "accepted-cancel",
    OWNER_REVIEW: "owner-review",
    WORKER_REVIEW: "worker-review",
    STARTED_DISPUTE: "started-dispute",
    RESOLVED_DISPUTE: "resolved-dispute",
  },
  VIDEO_EXTENSIONS: [
    "mp4",
    "avi",
    "mov",
    "wmv",
    "flv",
    "mkv",
    "mpg",
    "mpeg",
    "3gp",
    "swf",
  ],
  AUDIO_EXTENSIONS: [
    "mp3",
    "wav",
    "ogg",
    "aac",
    "wma",
    "flac",
    "m4a",
    "ac3",
    "aiff",
    "au",
    "mid",
    "midi",
  ],
  IMAGE_EXTENSIONS: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "ico",
    "svg",
    "tif",
    "tiff",
    "webp",
  ],
  CHAT_TYPES: { DISPUTE: "dispute", ORDER: "order" },
  PAYMENT_TYPES: {
    PAYPAL: "paypal",
    CREDIT_CARD: "credit-card",
    BANK_TRANSFER: "bank-transfer",
  },
  CHECKLIST_TYPES: {
    OWNER: "owner",
    WORKER: "worker",
  },
  LIMITS: {
    MIN_WORKER_COMMISSION: 5,
    MIN_OWNER_COMMISSION: 5,
  },
  DEFAULTS: { LOCATION: { lat: 53.390044, lng: -2.59695 } },
  JWT_DEFAULT_ACCESS_LIFETIME: "7d",
  JWT_REMEMBER_ACCESS_LIFETIME: "90d",
  BEARER_COOKIE_LIFETIME: 1000 * 60 * 60 * 24 * 7,
  BEARER_REMEMBER_COOKIE_LIFETIME: 1000 * 60 * 60 * 24 * 90,
  JWT_VERIFY_LIFETIME: "1h",
  MAIN_DIRECTORY: __dirname,
  LATITUDE_LONGITUDE_TO_KILOMETERS: 111.045,
  DEGREES_TO_RADIANS: 57.3,
  MONTH_DURATION: 30,
  INFINITY_SELECT_ITERATION_LIMIT: 10,
  CURRENCY_NAME: "GBP", //"USD"
  CURRENCY: "£", //"$"
};

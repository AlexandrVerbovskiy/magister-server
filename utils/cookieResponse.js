const STATIC = require("../static");

const generateBearerCookie = (token, remember) => {
  const duration = remember
    ? STATIC.BEARER_REMEMBER_COOKIE_LIFETIME
    : STATIC.BEARER_COOKIE_LIFETIME;

  return {
    name: "Bearer",
    value: token,
    options: {
      maxAge: duration,
    },
  };
};

module.exports = {
  generateBearerCookie,
};

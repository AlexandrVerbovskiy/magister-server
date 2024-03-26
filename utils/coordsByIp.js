const STATIC = require("../static");
const fields = "lat,lon";

module.exports = async function coordsByIp(ip) {
  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=${fields}`
    );
    ipdat = await response.json();

    if (!ipdat) {
      const response2 = await fetch(
        `http://www.geoplugin.net/json.gp?ip=${ip}`
      );
      ipdat = await response2.json();
    }

    if (!ipdat) {
      const response3 = await fetch(`https://freeipapi.com/api/json/${ip}`);
      ipdat = await response3.json();
    }

    return ipdat;
  } catch (error) {
    console.error("Помилка під час отримання даних про IP:", error);
    return STATIC.DEFAULT_LOCATION;
  }
};

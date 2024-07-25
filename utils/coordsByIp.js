const STATIC = require("../static");
const fields = "lat,lon";

module.exports = async function coordsByIp(ip = null) {
  try {
    if (!ip) {
      return STATIC.DEFAULTS.LOCATION;
    }

    ip = ip.split(", ")[0];

    let data = null;

    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=${fields}`
    );

    const { lat, lon } = await response.json();
    data = { lat, lng: lon };

    if (!data || Object.keys(data).length < 1) {
      const response2 = await fetch(
        `http://www.geoplugin.net/json.gp?ip=${ip}`
      );

      const { geoplugin_latitude = 0, geoplugin_longitude = 0 } =
        await response2.json();

      if (geoplugin_latitude || geoplugin_longitude) {
        data = { lat: geoplugin_latitude, lng: geoplugin_longitude };
      }
    }

    if (!data || Object.keys(data).length < 1) {
      const response3 = await fetch(`https://freeipapi.com/api/json/${ip}`);
      const { latitude = 0, longitude = 0 } = await response3.json();

      if (latitude || longitude) {
        data = { lat: latitude, lng: longitude };
      }
    }

    if (!data || Object.keys(data).length < 1) {
      return STATIC.DEFAULTS.LOCATION;
    }

    return data;
  } catch (error) {
    console.error("Error getting IP data:", error);
    return STATIC.DEFAULTS.LOCATION;
  }
};

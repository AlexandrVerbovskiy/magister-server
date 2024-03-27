const STATIC = require("../static");
const fields = "lat,lon";

module.exports = async function coordsByIp(ip = null) {
  try {
    if (!ip) {
      return STATIC.DEFAULT_LOCATION;
    }

    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=${fields}`
    );
    let data = await response.json();

    if (!data || Object.keys(data).length < 1) {
      const response2 = await fetch(
        `http://www.geoplugin.net/json.gp?ip=${ip}`
      );
      const resData2 = await response2.json();
      console.log("resData2: ", resData2);
    }

    if (!data || Object.keys(data).length < 1) {
      const response3 = await fetch(`https://freeipapi.com/api/json/${ip}`);
      const { latitude = 0, longitude = 0 } = await response3.json();

      if (latitude || longitude) {
        data = { lat: latitude, lng: longitude };
      }
    }

    if (!data || Object.keys(data).length < 1) {
      return STATIC.DEFAULT_LOCATION;
    }

    return data;
  } catch (error) {
    console.error("Помилка під час отримання даних про IP:", error);
    return STATIC.DEFAULT_LOCATION;
  }
};

require("dotenv").config();
const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",
  apiKey: process.env.GOOGLE_GEOCODING_KEY,
};

const geocoder = NodeGeocoder(options);

const getAddressByCoords = async ({ lat, lng }) => {
  try {
    const res = await geocoder.reverse({ lat, lon: lng });

    if (!res.length) {
      throw new Error("Undefined coords");
    }

    return { error: null, result: res[0].formattedAddress };
  } catch (error) {
    console.error("Geocoding error: ", error);
    return { error: error.message, result: null };
  }
};

const getCoordsByAddress = async (address) => {
  if (!address) {
    return { error: null, result: null };
  }

  try {
    const res = await geocoder.geocode(address);

    if (!res.length) {
      throw new Error("Undefined address");
    }

    const coords = res[0];
    return {
      error: null,
      result: { lat: coords.latitude, lng: coords.longitude },
    };
  } catch (error) {
    console.error("Geocoding error: ", error);
    return { error: error.message, result: null };
  }
};

module.exports = { getCoordsByAddress, getAddressByCoords };

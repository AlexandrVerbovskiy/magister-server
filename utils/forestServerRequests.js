require("dotenv").config();
const axios = require("axios");
const API_URL = process.env.FOREST_API_URL;

const startCheckingModel = async (id) => {
  await axios.post(API_URL + "/predict-training", {
    id,
  });
};

const checkModelQuery = async (params) => {
  const response = await axios.post(API_URL + "/check-query", {
    params,
  });

  return response.data.errorMessage;
};

module.exports = { startCheckingModel, checkModelQuery };

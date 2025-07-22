require("dotenv").config();
const axios = require("axios");
const systemOptionModel = require("../models/systemOptionModel");
const API_URL = process.env.FOREST_API_URL;

const startCheckingModel = async (id) => {
  const apiKey = await systemOptionModel.getApiKey();

  await axios.post(API_URL + "/api/predict-training", {
    id,
    apiKey,
  });
};

const checkModelQuery = async (params) => {
  const apiKey = await systemOptionModel.getApiKey();

  const response = await axios.post(API_URL + "/api/check-query", {
    params,
    apiKey,
  });

  return response.data.errorMessage;
};

module.exports = { startCheckingModel, checkModelQuery };

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

const startTrainingModel = async (id) => {
  const apiKey = await systemOptionModel.getApiKey();

  await axios.post(API_URL + "/api/start-training", {
    id,
    apiKey,
  });
};

const startRevaluationOrders = async () => {
  const apiKey = await systemOptionModel.getApiKey();

  await axios.post(API_URL + "/api/revaluation", {
    apiKey,
  });
};

const predictTempOrderDispute = async (orderId) => {
  const apiKey = await systemOptionModel.getApiKey();

  const response = await axios.post(API_URL + "/api/predict-dispute", {
    orderId,
    apiKey,
  });

  return {
    probabilityOfDelay: response.data.probability_of_delay,
    prediction: response.data.prediction,
  };
};

module.exports = {
  startCheckingModel,
  checkModelQuery,
  startTrainingModel,
  startRevaluationOrders,
  predictTempOrderDispute,
};

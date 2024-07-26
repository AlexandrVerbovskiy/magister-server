require("dotenv").config();
const fetch = require("node-fetch");

const { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY } = process.env;
const baseApi = `https://api.${process.env.PAYPAL_API_URL}`;
const baseApiM = `https://api-m.${process.env.PAYPAL_API_URL}`;

async function getToken() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const tokenInfo = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`
  ).toString("base64");
  myHeaders.append("Authorization", `Basic ${tokenInfo}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("ignoreCache", "true");
  urlencoded.append("return_authn_schemes", "true");
  urlencoded.append("return_client_metadata", "true");
  urlencoded.append("return_unconsented_scopes", "true");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  const res = await fetch(`${baseApiM}/v1/oauth2/token`, requestOptions);

  const data = await res.json();
  return data.access_token;
}

const createPaypalOrder = async (amount, orderId, listingName) => {
  const accessToken = await getToken();
  const url = `${baseApiM}/v2/checkout/orders`;

  if (listingName.length > 127) {
    listingName = listingName.substring(0, 123) + "...";
  }

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: amount,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: amount,
            },
          },
        },
        items: [
          {
            name: listingName,
            quantity: 1,
            sku: orderId,
            unit_amount: {
              currency_code: "USD",
              value: amount,
            },
            description: "Tool rental",
          },
        ],
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const jsonResponse = await response.json();

  if (!jsonResponse.status || jsonResponse.status.toLowerCase() !== "created") {
    throw new Error(jsonResponse.message);
  }

  return jsonResponse;
};

const capturePaypalOrder = async (orderId) => {
  const accessToken = await getToken();
  const url = `${baseApiM}/v2/checkout/orders/${orderId}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const jsonResponse = await response.json();

  if (
    !jsonResponse.status ||
    jsonResponse.status.toLowerCase() !== "completed"
  ) {
    throw new Error(jsonResponse.message);
  }

  return true;
};

async function refundPaypalOrderCapture(id) {
  /*const accessToken = await getToken();
  const url = `${baseApiM}/v2/payments/captures/${id}/refund`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const jsonResponse = await response.json();

  if (!jsonResponse.status || jsonResponse.status.toLowerCase() !== "pending") {
    throw new Error(jsonResponse.message);
  }*/

  const accessToken = await getToken();
  const url = `${baseApiM}/v2/payments/captures/${id}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const jsonResponse = await response.json();

  return jsonResponse;
}

async function sendMoneyToPaypal(type, getter, amount, currency) {
  const token = await getToken();

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("PayPal-Request-Id", "5ace1e04-e3cb-4d3d-bffa-cadebc98e93c");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    sender_batch_header: {
      sender_batch_id: "batch_" + Math.random().toString(36).substring(9),
      email_subject: "You have a payout!",
    },
    items: [
      {
        recipient_type: type,
        amount: {
          value: amount,
          currency: currency,
        },
        note: "Thank you.",
        receiver: getter,
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    `${baseApiM}/v1/payments/payouts`,
    requestOptions
  );
  const data = await response.json();

  if (data.message) {
    return { error: data.message, details: data.details };
  } else {
    return { error: false };
  }
}

async function sendMoneyToPaypalByEmail(email, amount) {
  return sendMoneyToPaypal("EMAIL", email, amount, "USD");
}

async function sendMoneyToPaypalByPhone(phone, amount) {
  return sendMoneyToPaypal("PHONE", phone, amount, "USD");
}

async function sendMoneyToPaypalByPaypalID(paypalId, amount) {
  return sendMoneyToPaypal("PAYPAL_ID", paypalId, amount, "USD");
}

const getPaypalOrderInfo = async (orderId) => {
  const accessToken = await getToken();
  const url = `${baseApi}/v2/checkout/orders/${orderId}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  });

  return await response.json();
};

const getProfileData = async (code) => {
  try {
    const response = await fetch(`${baseApiM}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`).toString(
            "base64"
          ),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
      }),
    });

    if (!response.ok) {
      if (response.status) {
        throw new Error(`Paypal Api error! status: ${response.status}`);
      } else if (response.statusText) {
        throw new Error(`Paypal Api error! ${response.statusText}`);
      } else {
        throw new Error(`Paypal Api unknown error! PaypalApi line 252`);
      }
    }

    const data = await response.json();
    return { error: null, data };
  } catch (error) {
    return {
      error: error.response ? error.response.data : error.message,
      data: null,
    };
  }
};

const getUserPaypalId = async (code) => {
  try {
    const profileData = await getProfileData(code);

    if (profileData.error) {
      throw new Error(profileData.error);
    }

    const response = await fetch(
      `${baseApi}/v1/identity/oauth2/userinfo?schema`,
      {
        headers: {
          Authorization: `Bearer ${profileData.data.access_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!response.ok) {
      if (response.status) {
        throw new Error(`Paypal Api error! status: ${response.statusText}`);
      } else if (response.statusText) {
        throw new Error(`Paypal Api error! ${response.status}`);
      } else {
        throw new Error(`Paypal Api unknown error! PaypalApi line 252`);
      }
    }

    const result = await response.json();

    return { error: null, paypalId: result.payer_id };
  } catch (e) {
    return { error: e.message, paypalId: null };
  }
};

module.exports = {
  capturePaypalOrder,
  createPaypalOrder,
  sendMoneyToPaypalByEmail,
  sendMoneyToPaypalByPhone,
  sendMoneyToPaypalByPaypalID,
  getPaypalOrderInfo,
  refundPaypalOrderCapture,
  getProfileData,
  getUserPaypalId,
};

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createStripeCustomer = async (email, name) => {
  const param = { email, name };
  return await stripe.customers.create(param);
};

const retrieveStripeCustomer = async () => {
  return await stripe.customers.retrieve("cus_Gi1jjdxYhsaMN2");
};

const createStripeCardToken = async ({ number, expMonth, expYear, cvc }) => {
  const param = {
    type: "card",
    card: {
      number: number,
      exp_month: expMonth,
      exp_year: expYear,
      cvc,
    },
  };
  return await stripe.paymentMethods.create(param);
};

const addStripeCardToCustomer = async (customerId, cardId) => {
  return await stripe.paymentMethods.attach(cardId, {
    customer: customerId,
  });
};

const chargeStripeCustomerThroughCustomerID = async () => {
  const param = {
    amount: "2000",
    currency: "usd",
    description: "First payment",
    customer: "cus_Gi1jjdxYhsaMN2",
  };

  return await stripe.charges.create(param);
};

const chargeStripeCustomerThroughTokenID = async () => {
  const param = {
    amount: "2000",
    currency: "usd",
    description: "First payment",
    source: "tok_1GFGKuCEXnEqdvqz10yhHl8s",
  };

  return await stripe.charges.create(param);
};

const getAllStripeCustomers = async () => {
  return await stripe.customers.list({ limit: 4 });
};

const createStripePayment = async ({ id, amount }) => {
  return await stripe.paymentIntents.create({
    payment_method: id,
    amount,
    currency: "USD",
    description: `Order from test`,
    confirm: true,
    return_url: process.env.CLIENT_URL + "/",
  });
};

const createPrice = async () => {
  return await stripe.prices.create({
    currency: "usd",
    unit_amount: 1000,
    product_data: {
      name: "Gold Plan 12",
    },
  });
};

const createStripePaymentLink = async (priceId, quantity) => {
  return await stripe.paymentLinks.create({
    line_items: [
      {
        price: priceId,
        quantity: quantity,
      },
    ],
  });
};

const createFullStripePaymentLink = async () => {
  const price = await createPrice();
  return await createStripePaymentLink(price.id, 1);
};

const getStripeBalance = async () => {
  const balanceInfo = await stripe.balance.retrieve();
  let result = 0;

  if (balanceInfo && balanceInfo.pending) {
    balanceInfo.pending.forEach(
      (balancePart) => (result += balancePart.amount)
    );
  }

  return result;
};

const checkAccount = async (accountId) => {
  return await stripe.accounts.retrieve(accountId);
};

const createStripeTransfer = async (amount, cardId) => {
  const transfer = await stripe.payouts.create({
    amount,
    currency: "usd",
    destination: cardId,
  });
  return transfer;
};

const activateStripeAccount = async (accountId) => {
  let time = new Date().getTime() / 1000;
  time = Math.round(time);

  await stripe.accounts.update(accountId, {
    tos_acceptance: {
      date: time,
      ip: "8.8.8.8",
    },
  });
};

const createStripeAccount = async (email) => {
  const account = await stripe.accounts.create({
    type: "express",
    country: "US",
    /*email,*/
  });
  return account;
};

const generateAccountLink = async (accountId) => {
  return await stripe.accountLinks.create({
    account: accountId,
    refresh_url: "https://example.com/reauth",
    return_url: "https://example.com/return",
    type: "account_onboarding",
  });
};

const createTestTransaction = async () => {
  return await stripe.paymentIntents.create({
    amount: 2000,
    currency: "usd",
    confirm: true,
    payment_method: "pm_card_visa",
    return_url: process.env.CLIENT_URL + "/",
    payment_method_types: ["card"],
    transfer_data: {
      amount: 1000,
      destination: "acct_1P94ddESRerYS2ea",
    },
  });
};

module.exports = {
  createStripePayment,
  getAllStripeCustomers,
  createStripeCustomer,
  chargeStripeCustomerThroughTokenID,
  chargeStripeCustomerThroughCustomerID,
  addStripeCardToCustomer,
  createStripeCardToken,
  retrieveStripeCustomer,
  getStripeBalance,
  createPrice,
  createStripePaymentLink,
  createFullStripePaymentLink,
  createStripeTransfer,
  checkAccount,
  createStripeAccount,
  createTestTransaction,
  activateStripeAccount,
  generateAccountLink
};

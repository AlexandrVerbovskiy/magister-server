const STATIC = require("../static");
const {
  createPaypalOrder,
  capturePaypalOrder,
  getPaypalOrderInfo,
} = require("../utils");
const Controller = require("./Controller");

class SenderPaymentController extends Controller {
  constructor() {
    super();
  }

  paypalCreateOrder = async (req, res) =>
    this.baseWrapper(res, res, async () => {
      const { amount } = req.body;
      const result = await createPaypalOrder(amount);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  paypalOrderPayed = async (req, res) =>
    this.baseWrapper(res, res, async () => {
      const { userId } = req.userData;
      const { orderId } = req.body;
      const { error, body } = await capturePaypalOrder(orderId);
      
      const result = await getPaypalOrderInfo(orderId);
      console.log(JSON.stringify(result));

      if (error) {
        return this.sendErrorResponse(res, STATIC.ERRORS.PAYMENT_FAILED);
      }

      console.log(userId, body);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });
}

module.exports = new SenderPaymentController();

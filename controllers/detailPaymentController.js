const DetailPayment = require('../models/DetailPayment');

const detailPaymentController = {
  add: async (req, res) => {
    const {
      vnp_Amount,
      vnp_BankCode,
      vnp_BankTranNo,
      vnp_CartType,
      vnp_PayDate,
    } = req.body;

    const detailPayment = new DetailPayment({
      price: vnp_Amount,
      bank_code: vnp_BankCode,
      bank_tran_no: vnp_BankTranNo,
      cart_type: vnp_CartType,
      pay_date: vnp_PayDate,
    });

    await detailPayment.save();

    return detailPayment;
  },
};

module.exports = detailPaymentController;

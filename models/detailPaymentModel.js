const mongoose = require('mongoose');

const DetailPayment = new mongoose.Schema({
  price: {
    type: Number,
    require,
  },
  bank_code: {
    type: String,
    require,
  },
  bank_tran_no: {
    type: String,
    require,
  },
  card_type: {
    type: String,
    require,
  },
  // yyyyMMddHHmmss
  pay_date: {
    type: Number,
    require,
  },
});

const DetailPaymentModel = mongoose.model('DetailPayment', DetailPayment);

module.exports = DetailPaymentModel;

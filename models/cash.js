const mongoose = require('mongoose');

const cashFlowSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'visa', 'knet', 'link']
  },
  description: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  orderNo: Number,
});

const CashFlow = mongoose.model('CashFlow', cashFlowSchema);

module.exports = CashFlow;

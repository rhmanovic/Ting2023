var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var PurchaseSchema = new mongoose.Schema({
  purchaseNo: Number,
  warehouse: String,
  customerName: {
    type: String,
    default: "-"
  },
  email: {
    type: String,
    default: "-"
  },
  userID: String,
  vendorID: {
      type: String,
      default: ""
  },
  vendorName: {
      type: String,
      default: ""
  },
  totalCost: {
      type: Number,
      default: 0
  },


  productIDs: Array,
  quantity: Array,
  price: Array,
  cost: Array,
  productNames: Array,
  // CustomerID : String,
  customerName: {
    type: String,
    default: "-"
  },
  totalPrice: Number,
  mobile: {
    type: String,
    default: "-"
  },
  address: {
    type: String,
    default: "-"
  },
  ID_CITY: String,
  shippingCost: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  city: String,
  status: {
    type: String,
    default: "processing"
  },
  // charge : String, 
  // InternalChgId : String, 
  // this will create date automaticaly so I can qurey by date.
  time: { type: Date, default: Date.now },
});

var Purchase = mongoose.model('purchase', PurchaseSchema);
module.exports = Purchase;

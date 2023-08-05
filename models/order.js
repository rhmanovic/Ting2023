var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var OrderSchema = new mongoose.Schema({
  orderNo: Number,
  img: String,
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


  productIDs: Array,
  quantity: Array,
  warranty: Array,
  price: Array,
  cost: Array,
  productNames: Array,
  // CustomerID : String,
  customerName: {
    type: String,
    default: "-"
  },
  totalPrice: Number,
  totalCost: Number,
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
  
  invoice: {
    type: Number,
    default: 0
  },
  
  city: String,
  note: String,
  status: {
    type: String,
    default: "processing"
  },
  // charge : String, 
  // InternalChgId : String, 
  // this will create date automaticaly so I can qurey by date.
  time: { type: Date, default: Date.now },
});

var Order = mongoose.model('order', OrderSchema);
module.exports = Order;

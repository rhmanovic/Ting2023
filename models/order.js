var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var OrderSchema = new mongoose.Schema({

  

  inventoryQuantities: [{
    type: Number,
    default: 0
  }],
  inventoryCosts: [{
    type: Number,
    default: 0
  }],
  inventoryPrices: [{
    type: Number,
    default: 0
  }],
  
  nameAs: [{
    type: String,
    default: ""
  }],
  nameEs: [{
    type: String,
    default: ""
  }],
  productNos: [{
    type: String,
    default: ""
  }],
  productIDs: [{
    type: String,
    ref: ''
  }],
  brands: [{
    type: String,
    default: ""
  }],
  warranties: [{
    type: String,
    default: "-"
  }],
  productNameAs: [{
    type: String,
    default: ""
  }],
  productNameEs: [{
    type: String,
    default: ""
  }],
  costs: [{
    type: Number,
    default: 0
  }],
  prices: [{
    type: Number,
    default: 0
  }],
  inventoryIDs: [{
    type: String,
    ref: ''
  }],


  
  orderNo: Number,
  img: String,
  payment_method: String,
  KentStatus: String,
  KentStatusBackEnd: String,
  paymentLog: Object,
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
  variation: Array,
  warranty: Array,
  warehouseNo: Array,
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

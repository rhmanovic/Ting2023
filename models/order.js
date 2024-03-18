var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var OrderSchema = new mongoose.Schema({


  createdBy: {
    name: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: () => Date.now() + (3 * 60 * 60 * 1000) // GMT +3
    }
  },
  
  approvedDeletedBy: {
    name: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: () => Date.now() + (3 * 60 * 60 * 1000) // GMT +3
    }
  },

  payment : {
    payment_method: {
      type: String,
      
      enum: ['cash', 'visa', 'knet', 'link']
    },
    payment_status:{
      Total_paid: {
        type: Number,
        default: 0
      },
      Total_due: {
        type: Number,
        default: 0
      },
      status: {
        type: String,
        enum: ['unpaid', 'partial', 'paid'],
        default: 'unpaid'
      }
    }
  },

  changeStatusBy: [{
    name: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: () => Date.now() + (3 * 60 * 60 * 1000) // GMT +3
    }
  }],

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


  
  paid: {
    type: Boolean,
    default: false
  },
  orderNo: Number,
  img: String,
  payment_method: {
    type: String,
    
    enum: ['cash', 'visa', 'knet', 'link']
  },
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
  
  totalPrice: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
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

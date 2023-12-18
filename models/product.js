var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var ProductSchema = new mongoose.Schema({
   
    productNo: {
      type: String,
      default: "",
      text: true 
      // unique: true,
    },
    warehouseNo: {
      type: String,
      default: "",
      text: true 
      // unique: true,
    },
    
    group: {
      type: Boolean,
      default: false,      
    },
    discounted: {
      type: Boolean,
      default: false,      
    },
    name: {
      type: String,
      efault: ""
    },
    url: {
      type: String,
      unique: true
    },
    googleSheet: {
      type: Boolean,
      default: false
    },
    warehouseAvialable: {
      type: Boolean,
      default: false
    },
    showInWebsite: {
      type: Boolean,
      default: true
    },
    canBeOrdered: {
      type: Boolean,
      default: true
    },
    variant: {
      type: Boolean,
      default: false
    },
    name: {
        type: String,
        default: "",
      text: false 
        
    },
    variantName: {
        type: String,
        default: "",
    },
    nameE: {
        type: String,
        default: ""
    },
    googleCategory: {
        type: String,
        default: ""
    },
    SKU: String,
    color: {
        type: String,
        default: ""
    } ,
    cost: {
        type: Number,
        default: 0
    } ,
    price: {
        type: Number,
        default: 0
    } ,
    upsell: {
        type: Number,
        default: 0
    } ,
    sellCount: {
        type: Number,
        default: 0
    } ,
    quantity: {
        type: Number,
        default: 0
    } ,
    warranty: {
        type: Number,
        default: 0
    } ,
    naseem: {
        type: Number,
        default: 0
    } ,
    qurain: {
        type: Number,
        default: 0
    } ,
    package: {
        type: Number,
        default: 0
    } ,
    discountPrice: {
        type: Number,
        default: 0
    } ,
    beforePrice: {
        type: Number,
        default: 0
    } ,
    img: {
        type: Array,
        default: []
    },
    category: {
        type: Array,
        default: []
    },
    variation: {
        type: String,
        default: ""
    },
    
    categoryName: {
        type: String,
        default: ""
    },
    categoryNo: {
        type: String,
        default: ""
    },
    brand: {
        type: String,
        default: ""
    },
    brandName: {
        type: String,
        default: ""
    },
    vendor: {
        type: String,
        default: ""
    },
    vendorName: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: ""
    } ,
    SubProductId: {
        type: Array,
        default: ""
    } ,
    SuperProductID: {  
        type: String,
        default: "-"
    } ,
    Size: {  
        type: String,
        default: "-"
    } ,
    Dim: {  
        type: String,
        default: "-"
    } ,
    Water: {  
        type: String,
        default: "-"
    } ,
    description: {  
        type: String,
        default: "-"
    } ,
});

var Product = mongoose.model('product', ProductSchema);
module.exports = Product;
